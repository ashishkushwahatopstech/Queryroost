export async function onRequestGet(context: { request: Request }) {
  const url = new URL(context.request.url);
  const targetUrl = url.searchParams.get('url')?.trim();

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'Target URL is required' }), { status: 400 });
  }

  try {
    const fetchRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AkTechSEO-Proxy/1.0; +https://seo.aktechstudio.com)'
      }
    });

    if (!fetchRes.ok) {
      return new Response(JSON.stringify({ error: `HTTP ${fetchRes.status} Error fetching target URL` }), { status: fetchRes.status });
    }

    const html = await fetchRes.text();
    return new Response(JSON.stringify({ success: true, url: targetUrl, html }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: `Network error: ${err.message}` }), { status: 500 });
  }
}
