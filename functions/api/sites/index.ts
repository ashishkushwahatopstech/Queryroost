import { getUserFromSession, getValidAccessToken } from '../_auth';

export async function onRequestGet(context: { request: Request; env: any }) {
  const user = await getUserFromSession(context.request, context.env);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const db = context.env.DB;
  let userSites: any[] = [];
  if (db) {
    const { results } = await db.prepare('SELECT id, site_url, permission_level, added_at FROM sites WHERE user_id = ?').bind(user.id).all();
    userSites = results || [];
  }

  // Fetch valid access token to list real verified sites from Google Search Console
  let gscVerifiedSites: any[] = [];
  const accessToken = await getValidAccessToken(user.id, context.env);

  if (accessToken) {
    try {
      const gscRes = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (gscRes.ok) {
        const gscData: any = await gscRes.json();
        gscVerifiedSites = gscData.siteEntry || [];
      }
    } catch (e) {
      console.error('Error fetching GSC site entries:', e);
    }
  }

  return new Response(JSON.stringify({
    connectedSites: userSites,
    gscVerifiedSites: gscVerifiedSites.map((s: any) => ({
      siteUrl: s.siteUrl,
      permissionLevel: s.permissionLevel
    })),
    userPlan: user.plan
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context: { request: Request; env: any }) {
  const user = await getUserFromSession(context.request, context.env);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const db = context.env.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: 'Database binding missing' }), { status: 500 });
  }

  const body: any = await context.request.json().catch(() => ({}));
  const siteUrl = body.siteUrl?.trim();
  if (!siteUrl) {
    return new Response(JSON.stringify({ error: 'siteUrl is required' }), { status: 400 });
  }

  // Check user connected sites count (Free tier limit = 1 site)
  const existingSitesCountRes = await db.prepare('SELECT COUNT(*) as count FROM sites WHERE user_id = ?').bind(user.id).first();
  const connectedCount = existingSitesCountRes?.count || 0;

  if (user.plan === 'free' && connectedCount >= 1) {
    return new Response(JSON.stringify({
      error: 'Free plan limit reached',
      message: 'Free tier allows connecting only 1 site. Upgrade to Premium for unlimited sites.',
      requiresPremium: true
    }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }

  // Verify ownership in GSC API
  const accessToken = await getValidAccessToken(user.id, context.env);
  let permissionLevel = 'siteOwner';

  if (accessToken) {
    try {
      const gscRes = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (gscRes.ok) {
        const gscData: any = await gscRes.json();
        const found = (gscData.siteEntry || []).find((s: any) => s.siteUrl === siteUrl);
        if (!found) {
          return new Response(JSON.stringify({
            error: 'Site ownership not verified in Google Search Console',
            message: 'You must verify ownership of this website in your Google Search Console account before adding it.'
          }), { status: 400 });
        }
        permissionLevel = found.permissionLevel;
      }
    } catch (err) {
      console.warn('GSC verification check fallback');
    }
  }

  const siteId = `site_${Math.random().toString(36).substring(2, 10)}`;
  const now = Math.floor(Date.now() / 1000);

  await db.prepare('INSERT INTO sites (id, user_id, site_url, permission_level, added_at) VALUES (?, ?, ?, ?, ?)')
    .bind(siteId, user.id, siteUrl, permissionLevel, now)
    .run();

  return new Response(JSON.stringify({
    success: true,
    site: {
      id: siteId,
      user_id: user.id,
      site_url: siteUrl,
      permission_level: permissionLevel,
      added_at: now
    }
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}
