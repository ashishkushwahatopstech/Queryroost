export async function onRequestGet(context: { request: Request; env: any }) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error || !code) {
    return new Response(`<html><body><h2>Authentication Error</h2><p>${error || 'No authorization code provided'}</p><a href="/">Return to Home</a></body></html>`, {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;
  const redirectUri = env.REDIRECT_URI || `${url.origin}/api/auth/callback`;

  try {
    // 1. Exchange code for access & refresh token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokenData: any = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      return new Response(JSON.stringify({ error: 'Failed to exchange OAuth token', details: tokenData }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Fetch User Profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const profile: any = await profileRes.json();

    if (!profile.email) {
      return new Response(JSON.stringify({ error: 'Failed to fetch user email' }), { status: 400 });
    }

    const email = profile.email;
    const name = profile.name || profile.email.split('@')[0];
    const picture = profile.picture || '';
    const adminEmail = env.ADMIN_EMAIL || 'ashishkushwaha88643@gmail.com';
    const isAdmin = email.toLowerCase() === adminEmail.toLowerCase();
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + (tokenData.expires_in || 3600);

    let effectiveUserId = profile.id || `usr_${Math.random().toString(36).substring(2, 10)}`;

    const db = env.DB;
    if (db) {
      // Check if user already exists in D1 (e.g. seeded admin or previous signup)
      const existingUser = await db.prepare('SELECT id, plan FROM users WHERE email = ?').bind(email).first();
      if (existingUser?.id) {
        effectiveUserId = existingUser.id as string;
      }
      const plan = isAdmin ? 'premium' : (existingUser?.plan || 'free');

      await db.prepare(`
        INSERT INTO users (id, email, name, picture, plan, google_id, access_token, refresh_token, token_expires_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
          name = excluded.name,
          picture = excluded.picture,
          google_id = excluded.google_id,
          access_token = excluded.access_token,
          refresh_token = COALESCE(excluded.refresh_token, users.refresh_token),
          token_expires_at = excluded.token_expires_at,
          updated_at = excluded.updated_at
      `).bind(
        effectiveUserId,
        email,
        name,
        picture,
        plan,
        profile.id || '',
        tokenData.access_token,
        tokenData.refresh_token || null,
        expiresAt,
        now,
        now
      ).run();
    }

    // Set Session Cookie & Redirect to Dashboard
    const headers = new Headers();
    headers.append('Set-Cookie', `seo_session=${effectiveUserId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`);
    headers.append('Location', '/dashboard');

    return new Response(null, {
      status: 302,
      headers
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'OAuth callback internal error', message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
