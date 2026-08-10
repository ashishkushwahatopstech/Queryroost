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
    
    // sessionToken is stored as user.id or a token map in users table
    const result = await db.prepare('SELECT id, email, name, picture, plan FROM users WHERE id = ?').bind(sessionToken).first();
    if (!result) return null;

    // Strict admin override rule
    const adminEmail = env.ADMIN_EMAIL || 'ashishkushwaha88643@gmail.com';
    const isOwnerAdmin = result.email.toLowerCase() === adminEmail.toLowerCase();
    const effectivePlan = isOwnerAdmin ? 'premium' : result.plan;

    return {
      id: result.id,
      email: result.email,
      name: result.name || '',
      picture: result.picture || '',
      plan: effectivePlan as 'free' | 'premium',
    };
  } catch (err) {
    console.error('Session error:', err);
    return null;
  }
}
