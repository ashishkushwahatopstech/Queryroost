export interface UserSession {
  id: string;
  email: string;
  name: string;
  picture: string;
  plan: 'free' | 'premium';
}

export function parseCookies(cookieHeader: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  const items = cookieHeader.split(';');
  for (const item of items) {
    const [key, ...value] = item.trim().split('=');
    if (key) {
      cookies[key] = decodeURIComponent(value.join('='));
    }
  }
  return cookies;
}

export async function getUserFromSession(request: Request, env: any): Promise<UserSession | null> {
  const cookieHeader = request.headers.get('Cookie');
  const cookies = parseCookies(cookieHeader);
  const sessionToken = cookies['seo_session'] || request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!sessionToken) return null;

  try {
    const db = env.DB;
    if (!db) return null;
    
    // Match session token against user.id OR user.email OR user.google_id
    const result = await db.prepare('SELECT id, email, name, picture, plan FROM users WHERE id = ? OR email = ? OR google_id = ?').bind(sessionToken, sessionToken, sessionToken).first();
    if (!result) return null;

    // Strict admin override rule
    const adminEmail = env.ADMIN_EMAIL || 'ashishkushwaha88643@gmail.com';
    const isOwnerAdmin = (result.email as string).toLowerCase() === adminEmail.toLowerCase();
    const effectivePlan = isOwnerAdmin ? 'premium' : result.plan;

    return {
      id: result.id as string,
      email: result.email as string,
      name: (result.name as string) || '',
      picture: (result.picture as string) || '',
      plan: effectivePlan as 'free' | 'premium',
    };
  } catch (err) {
    console.error('Session error:', err);
    return null;
  }
}

export async function getValidAccessToken(userId: string, env: any): Promise<string | null> {
  const db = env.DB;
  if (!db) return null;

  const userRow = await db.prepare('SELECT access_token, refresh_token, token_expires_at FROM users WHERE id = ? OR email = ?').bind(userId, userId).first();
  if (!userRow) return null;

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = (userRow.token_expires_at as number) || 0;

  // If token is still valid (has at least 2 mins left), return it
  if (userRow.access_token && expiresAt > now + 120) {
    return userRow.access_token as string;
  }

  // If token expired but refresh_token exists, request fresh access_token
  if (userRow.refresh_token) {
    try {
      const clientId = env.GOOGLE_CLIENT_ID;
      const clientSecret = env.GOOGLE_CLIENT_SECRET;

      const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId || '',
          client_secret: clientSecret || '',
          refresh_token: userRow.refresh_token as string,
          grant_type: 'refresh_token'
        })
      });

      if (refreshRes.ok) {
        const tokenData: any = await refreshRes.json();
        const newAccessToken = tokenData.access_token;
        const newExpiresAt = now + (tokenData.expires_in || 3600);

        await db.prepare('UPDATE users SET access_token = ?, token_expires_at = ?, updated_at = ? WHERE id = ? OR email = ?')
          .bind(newAccessToken, newExpiresAt, now, userId, userId)
          .run();

        return newAccessToken;
      }
    } catch (err) {
      console.error('Failed to refresh Google access token:', err);
    }
  }

  return (userRow.access_token as string) || null;
}
