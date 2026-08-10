import { getUserFromSession } from '../_auth';

export async function onRequestPost(context: { request: Request; env: any }) {
  const { request, env } = context;
  const user = await getUserFromSession(request, env);
  const db = env.DB;

  const todayStr = new Date().toISOString().split('T')[0];
  const toolName = 'schema_validator';
  const userIdOrIp = user?.id || request.headers.get('CF-Connecting-IP') || 'anon_ip';

  if (db) {
    const adminSetting = await db.prepare('SELECT value FROM admin_settings WHERE key = ?').bind('require_premium_schema_validator').first();
    if (adminSetting?.value === 'true' && user?.plan !== 'premium') {
      return new Response(JSON.stringify({
        error: 'Premium feature',
        message: 'Schema Validator is locked to Premium tier by administrator.',
        requiresPremium: true
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }
  }

  const body: any = await request.json().catch(() => ({}));
  const targetUrl = body.url?.trim();
  const rawSchemaCode = body.schemaCode?.trim();

  let jsonLdSchemas: any[] = [];
  let issues: string[] = [];
  let detectedTypes: string[] = [];

  if (rawSchemaCode) {
    try {
      const parsed = JSON.parse(rawSchemaCode);
      jsonLdSchemas.push(parsed);
    } catch (e: any) {
      issues.push(`Malformed JSON-LD syntax error: ${e.message}`);
    }
  } else if (targetUrl) {
    try {
      const res = await fetch(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SchemaValidator/1.0)' }
      });
      if (res.ok) {
        const html = await res.text();
        const scriptMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
        
        for (const script of scriptMatches) {
          const content = script.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
          try {
            const parsed = JSON.parse(content);
            jsonLdSchemas.push(parsed);
          } catch (e) {
            issues.push('Found malformed JSON-LD script block on page');
          }
        }
      }
    } catch (e: any) {
      issues.push(`Unable to fetch HTML from URL: ${e.message}`);
    }
  }

  // Validate shapes
  for (const s of jsonLdSchemas) {
    const type = s['@type'] || s['type'] || 'Unknown';
    detectedTypes.push(type);

    if (type === 'Article' || type === 'NewsArticle' || type === 'BlogPosting') {
      if (!s.headline) issues.push(`Schema ${type} missing required 'headline' property`);
      if (!s.author) issues.push(`Schema ${type} missing recommended 'author' property`);
    } else if (type === 'Organization' || type === 'LocalBusiness') {
      if (!s.name) issues.push(`Schema ${type} missing required 'name' property`);
      if (!s.url) issues.push(`Schema ${type} missing recommended 'url' property`);
    }
  }

  if (jsonLdSchemas.length === 0 && !issues.length) {
    issues.push('No JSON-LD structured data schemas found on target page.');
  }

  return new Response(JSON.stringify({
    success: issues.length === 0,
    schemasCount: jsonLdSchemas.length,
    detectedTypes,
    schemas: jsonLdSchemas,
    issues,
    recommendations: [
      'Add FAQPage schema if your page contains Q&A content to gain rich SERP accordions.',
      'Add Organization schema to establish brand entity authority in Google Knowledge Graph.'
    ]
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
