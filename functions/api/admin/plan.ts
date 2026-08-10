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
  const { userId, targetPlan } = body;

  if (!userId || !['free', 'premium'].includes(targetPlan)) {
    return new Response(JSON.stringify({ error: 'Invalid parameters. userId and targetPlan (free|premium) required.' }), { status: 400 });
  }

  await db.prepare('UPDATE users SET plan = ?, updated_at = ? WHERE id = ?')
    .bind(targetPlan, Math.floor(Date.now() / 1000), userId)
    .run();

  return new Response(JSON.stringify({
    success: true,
    message: `User ${userId} plan updated to ${targetPlan}`
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
