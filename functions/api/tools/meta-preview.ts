import { getUserFromSession } from '../_auth';

export async function onRequestPost(context: { request: Request; env: any }) {
  const { request, env } = context;
  const user = await getUserFromSession(request, env);
  const db = env.DB;

  const todayStr = new Date().toISOString().split('T')[0];
  const toolName = 'meta_preview';
  const userIdOrIp = user?.id || request.headers.get('CF-Connecting-IP') || 'anon_ip';

  if (db) {
    // Check global admin setting
    const adminSetting = await db.prepare('SELECT value FROM admin_settings WHERE key = ?').bind('require_premium_meta_preview').first();
    const isPremiumRequired = adminSetting?.value === 'true';

    if (isPremiumRequired && user?.plan !== 'premium') {
      return new Response(JSON.stringify({
        error: 'Premium feature',
        message: 'Meta Previewer is currently locked to Premium tier by administrator.',
        requiresPremium: true
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    // Check usage limits if free
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

      // Record usage
      await db.prepare(`
        INSERT INTO tool_usage (id, user_id, ip_address, tool_name, used_count, date_str)
        VALUES (?, ?, ?, ?, 1, ?)
        ON CONFLICT(id) DO UPDATE SET used_count = used_count + 1
      `).bind(`tu_${userIdOrIp}_${toolName}_${todayStr}`, user?.id || null, userIdOrIp, toolName, todayStr).run();
    }
  }

  const body: any = await request.json().catch(() => ({}));
  const targetUrl = body.url?.trim();
  const customTitle = body.title?.trim();
  const customDescription = body.description?.trim();

  let pageTitle = customTitle || '';
  let pageDescription = customDescription || '';
  let ogImage = '';
  let canonicalUrl = targetUrl || '';
  let metaTags: any[] = [];

  if (targetUrl && !customTitle) {
    try {
      const fetchRes = await fetch(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SEO-Previewer/1.0' }
      });
      if (fetchRes.ok) {
        const html = await fetchRes.text();
        
        // Match Title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch) pageTitle = titleMatch[1].trim();

        // Match Description
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
        if (descMatch) pageDescription = descMatch[1].trim();

        // Match OG Image
        const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
        if (ogImageMatch) ogImage = ogImageMatch[1].trim();

        metaTags = [
          { name: 'title', content: pageTitle, status: pageTitle.length > 10 && pageTitle.length < 60 ? 'optimal' : 'warning' },
          { name: 'description', content: pageDescription, status: pageDescription.length > 50 && pageDescription.length < 160 ? 'optimal' : 'warning' },
          { name: 'og:image', content: ogImage, status: ogImage ? 'optimal' : 'missing' },
        ];
      }
    } catch (err) {
      pageTitle = pageTitle || 'Sample Website Title - SEO Preview';
      pageDescription = pageDescription || 'Sample description snippet for testing SERP appearance in Google search results.';
    }
  }

  return new Response(JSON.stringify({
    success: true,
    url: canonicalUrl,
    serp: {
      title: pageTitle || 'SEO Rank Tracking Platform | aktechstudio',
      description: pageDescription || 'Connect your Google Search Console to track real search query rankings, average positions, clicks, and CTR.',
      displayUrl: canonicalUrl ? new URL(canonicalUrl).hostname : 'seo.aktechstudio.com',
      ogImage: ogImage || 'https://seo.aktechstudio.com/og-banner.png'
    },
    metaTags,
    usedCountToday: 1
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
