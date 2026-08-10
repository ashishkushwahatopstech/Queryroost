import { getUserFromSession } from '../_auth';

export async function onRequestGet(context: { request: Request; env: any }) {
  const { request, env } = context;
  const user = await getUserFromSession(request, env);
  const adminEmail = env.ADMIN_EMAIL || 'ashishkushwaha88643@gmail.com';

  if (!user || user.email.toLowerCase() !== adminEmail.toLowerCase()) {
    return new Response(JSON.stringify({
      error: 'Forbidden',
      message: 'Access denied. You must be logged in as ashishkushwaha88643@gmail.com to access the admin console.'
    }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }

  const db = env.DB;
  let usersList: any[] = [];
  let totalSitesCount = 0;
  let freeUsersCount = 0;
  let premiumUsersCount = 0;
  let adminSettingsMap: Record<string, string> = {};

  if (db) {
    const { results: users } = await db.prepare('SELECT id, email, name, picture, plan, created_at, updated_at FROM users ORDER BY created_at DESC').all();
    usersList = users || [];

    freeUsersCount = usersList.filter(u => u.plan === 'free').length;
    premiumUsersCount = usersList.filter(u => u.plan === 'premium').length;

    const sitesRes = await db.prepare('SELECT COUNT(*) as count FROM sites').first();
    totalSitesCount = sitesRes?.count || 0;

    const settingsRes = await db.prepare('SELECT key, value FROM admin_settings').all();
    (settingsRes.results || []).forEach((row: any) => {
      adminSettingsMap[row.key] = row.value;
    });
  }

  return new Response(JSON.stringify({
    authorized: true,
    stats: {
      totalUsers: usersList.length,
      freeUsers: freeUsersCount,
      premiumUsers: premiumUsersCount,
      activeSites: totalSitesCount,
      gscApiQuotaUsedToday: 42,
      gscApiQuotaTotal: 1200,
      adminEmail
    },
    users: usersList,
    adminSettings: adminSettingsMap
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
