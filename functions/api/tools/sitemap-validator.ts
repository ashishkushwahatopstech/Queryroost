import { getUserFromSession } from '../_auth';

export async function onRequestPost(context: { request: Request; env: any }) {
  const { request, env } = context;
  const user = await getUserFromSession(request, env);
  const db = env.DB;

  const todayStr = new Date().toISOString().split('T')[0];
  const toolName = 'sitemap_validator';
  const userIdOrIp = user?.id || request.headers.get('CF-Connecting-IP') || 'anon_ip';

  if (db) {
    // Check admin setting
    const adminSetting = await db.prepare('SELECT value FROM admin_settings WHERE key = ?').bind('require_premium_sitemap_validator').first();
    if (adminSetting?.value === 'true' && user?.plan !== 'premium') {
      return new Response(JSON.stringify({
        error: 'Premium feature',
        message: 'Sitemap XML Validator is locked to Premium tier by administrator.',
        requiresPremium: true
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    if (user?.plan !== 'premium') {
      const usageRow = await db.prepare('SELECT used_count FROM tool_usage WHERE (user_id = ? OR ip_address = ?) AND tool_name = ? AND date_str = ?')
        .bind(userIdOrIp, userIdOrIp, toolName, todayStr).first();
      
      const usedCount = usageRow?.used_count || 0;
      if (usedCount >= 3) {
        return new Response(JSON.stringify({
          error: 'Daily limit reached',
          message: 'Free tier includes 3 tool checks per day. Upgrade to Premium for unlimited access.',
          requiresPremium: true,
          usedCount
        }), { status: 429, headers: { 'Content-Type': 'application/json' } });
      }

      await db.prepare(`
        INSERT INTO tool_usage (id, user_id, ip_address, tool_name, used_count, date_str)
        VALUES (?, ?, ?, ?, 1, ?)
        ON CONFLICT(id) DO UPDATE SET used_count = used_count + 1
      `).bind(`tu_${userIdOrIp}_${toolName}_${todayStr}`, user?.id || null, userIdOrIp, toolName, todayStr).run();
    }
  }

  const body: any = await request.json().catch(() => ({}));
  const sitemapUrl = body.url?.trim();

  if (!sitemapUrl) {
    return new Response(JSON.stringify({ error: 'Sitemap URL is required' }), { status: 400 });
  }

  try {
    const fetchRes = await fetch(sitemapUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SitemapValidator/1.0)' }
    });

    if (!fetchRes.ok) {
      return new Response(JSON.stringify({
        valid: false,
        error: `HTTP Error ${fetchRes.status}: Unable to fetch sitemap from ${sitemapUrl}`,
        httpStatus: fetchRes.status
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const xmlText = await fetchRes.text();
    const isXml = xmlText.includes('<?xml') || xmlText.includes('<urlset') || xmlText.includes('<sitemapindex');
    const locMatches = xmlText.match(/<loc>([^<]+)<\/loc>/g) || [];
    const urlCount = locMatches.length;

    const hasLastmod = xmlText.includes('<lastmod>');
    const hasChangefreq = xmlText.includes('<changefreq>');
    const hasPriority = xmlText.includes('<priority>');

    const issues: string[] = [];
    if (!isXml) issues.push('File does not appear to have valid XML standard declaration or <urlset> tags.');
    if (urlCount === 0) issues.push('No <loc> URLs found in sitemap.');
    if (!hasLastmod) issues.push('Missing <lastmod> timestamps for URLs.');

    return new Response(JSON.stringify({
      valid: issues.length === 0,
      url: sitemapUrl,
      urlCount,
      isSitemapIndex: xmlText.includes('<sitemapindex'),
      hasLastmod,
      hasChangefreq,
      hasPriority,
      issues,
      rawSnippet: xmlText.substring(0, 300)
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({
      valid: false,
      error: `Network Error: ${err.message}`,
      url: sitemapUrl
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
