import { getUserFromSession } from '../_auth';

export async function onRequestPost(context: { request: Request; env: any }) {
  const { request, env } = context;
  const user = await getUserFromSession(request, env);
  const adminEmail = env.ADMIN_EMAIL || 'ashishkushwaha88643@gmail.com';

  if (!user || user.email.toLowerCase() !== adminEmail.toLowerCase()) {
    return new Response(JSON.stringify({
      error: 'Forbidden',
      message: 'Access denied. You must be logged in as ashishkushwaha88643@gmail.com to execute admin actions.'
    }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }

  const db = env.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: 'Database binding missing' }), { status: 500 });
  }

  const body: any = await request.json().catch(() => ({}));
  const { key, value } = body;

  if (!key) {
    return new Response(JSON.stringify({ error: 'Setting key is required' }), { status: 400 });
  }

  const now = Math.floor(Date.now() / 1000);
  await db.prepare(`
    INSERT INTO admin_settings (key, value, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).bind(key, String(value), now).run();

  return new Response(JSON.stringify({
    success: true,
    message: `Setting ${key} updated to ${value}`
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
