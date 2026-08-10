import { getUserFromSession } from '../../_auth';

export async function onRequestGet(context: { request: Request; env: any; params: any }) {
  const { request, env, params } = context;
  const user = await getUserFromSession(request, env);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const db = env.DB;
  const siteId = params.siteId;
  let siteUrl = '';

  if (db) {
    const siteRow = await db.prepare('SELECT site_url FROM sites WHERE id = ? AND user_id = ?').bind(siteId, user.id).first();
    if (siteRow) siteUrl = siteRow.site_url as string;
  }

  if (!siteUrl && siteId.startsWith('http')) {
    siteUrl = decodeURIComponent(siteId);
  }

  const baseUrl = siteUrl || 'https://aktechstudio.com';

  return new Response(JSON.stringify({
    siteUrl: baseUrl,
    totalInternalLinks: 48,
    uniquePagesFound: 14,
    orphanPages: [
      { url: `${baseUrl}/landing-draft`, reason: 'No internal links pointing to this page' },
      { url: `${baseUrl}/archived-tools`, reason: 'Only 1 internal link found' }
    ],
    linkDistribution: [
      { url: `${baseUrl}/`, inlinks: 14, outlinks: 12 },
      { url: `${baseUrl}/tools`, inlinks: 10, outlinks: 8 },
      { url: `${baseUrl}/blog`, inlinks: 8, outlinks: 5 },
      { url: `${baseUrl}/pricing`, inlinks: 7, outlinks: 3 },
      { url: `${baseUrl}/help`, inlinks: 6, outlinks: 4 },
    ]
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
