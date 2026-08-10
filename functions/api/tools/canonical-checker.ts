import { getUserFromSession } from '../_auth';

export async function onRequestPost(context: { request: Request; env: any }) {
  const { request, env } = context;
  const user = await getUserFromSession(request, env);
  
  const body: any = await request.json().catch(() => ({}));
  const targetUrl = body.url?.trim();

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'Target URL is required' }), { status: 400 });
  }

  try {
    const res = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CanonicalChecker/1.0)' }
    });

    if (!res.ok) {
      return new Response(JSON.stringify({
        valid: false,
        error: `HTTP ${res.status} error fetching target URL`,
        url: targetUrl
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const html = await res.text();
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
                           html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);

    const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : null;
    const issues: string[] = [];

    if (!canonicalUrl) {
      issues.push('Missing <link rel="canonical"> tag in page HTML header.');
    } else {
      const isSelfReferencing = canonicalUrl === targetUrl || canonicalUrl === targetUrl.replace(/\/$/, '') || `${canonicalUrl}/` === targetUrl;
      
      try {
        const targetHost = new URL(targetUrl).hostname;
        const canonicalHost = new URL(canonicalUrl).hostname;
        if (targetHost !== canonicalHost) {
          issues.push(`Canonical URL points to a different domain (${canonicalHost}) instead of self domain (${targetHost})`);
        }
      } catch (e) {
        issues.push('Canonical URL is relative or invalid absolute URL');
      }
    }

    return new Response(JSON.stringify({
      valid: issues.length === 0,
      url: targetUrl,
      canonicalUrl,
      isSelfReferencing: canonicalUrl ? (canonicalUrl === targetUrl || canonicalUrl === targetUrl.replace(/\/$/, '')) : false,
      issues
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({
      valid: false,
      error: `Network Error: ${err.message}`,
      url: targetUrl
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
