import { getUserFromSession } from '../../_auth';

export async function onRequestGet(context: { request: Request; env: any; params: any }) {
  const { request, env, params } = context;
  const user = await getUserFromSession(request, env);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const db = env.DB;
  const siteId = params.siteId;
  const url = new URL(request.url);

  // Parse days filter (7, 28, 90, 480)
  let daysRequested = parseInt(url.searchParams.get('days') || '28', 10);
  if (isNaN(daysRequested)) daysRequested = 28;

  // Server-side enforcement: Free tier capped at max 28 days history
  let effectiveDays = daysRequested;
  let isDateRangeTruncated = false;

  if (user.plan === 'free' && daysRequested > 28) {
    effectiveDays = 28;
    isDateRangeTruncated = true;
  }

  let siteUrl = '';
  if (db) {
    const siteRow = await db.prepare('SELECT site_url FROM sites WHERE id = ? AND user_id = ?').bind(siteId, user.id).first();
    if (siteRow) {
      siteUrl = siteRow.site_url as string;
    }
  }

  if (!siteUrl && siteId.startsWith('http')) {
    siteUrl = decodeURIComponent(siteId);
  }

  // Fetch access_token for Google Search Console API
  let accessToken = '';
  if (db) {
    const userRow = await db.prepare('SELECT access_token FROM users WHERE id = ?').bind(user.id).first();
    accessToken = userRow?.access_token || '';
  }

  // Calculate start & end date for GSC API
  const endDateObj = new Date();
  endDateObj.setDate(endDateObj.getDate() - 2); // GSC data has ~2 day lag
  const endDateStr = endDateObj.toISOString().split('T')[0];

  const startDateObj = new Date();
  startDateObj.setDate(endDateObj.getDate() - effectiveDays);
  const startDateStr = startDateObj.toISOString().split('T')[0];

  // Free plan returns max 10 queries, Premium returns 200
  const maxQueriesLimit = user.plan === 'free' ? 10 : 200;

  if (accessToken && siteUrl) {
    try {
      // 1. Query dimension performance (search queries)
      const queryGscRes = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate: startDateStr,
          endDate: endDateStr,
          dimensions: ['query'],
          rowLimit: user.plan === 'free' ? 10 : 200
        })
      });

      // 2. Daily trend dimension performance
      const trendGscRes = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate: startDateStr,
          endDate: endDateStr,
          dimensions: ['date'],
          rowLimit: 50
        })
      });

      // 3. Top Pages dimension performance
      const pageGscRes = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate: startDateStr,
          endDate: endDateStr,
          dimensions: ['page'],
          rowLimit: user.plan === 'free' ? 5 : 20
        })
      });

      if (queryGscRes.ok && trendGscRes.ok) {
        const queryData: any = await queryGscRes.json();
        const trendData: any = await trendGscRes.json();
        const pageData: any = await pageGscRes.json().catch(() => ({ rows: [] }));

        const rawQueries = (queryData.rows || []).map((r: any) => ({
          query: r.keys[0],
          clicks: r.clicks,
          impressions: r.impressions,
          ctr: +(r.ctr * 100).toFixed(2),
          position: +(r.position).toFixed(1),
        }));

        const totalClicks = rawQueries.reduce((sum: number, q: any) => sum + q.clicks, 0);
        const totalImpressions = rawQueries.reduce((sum: number, q: any) => sum + q.impressions, 0);
        const avgCtr = totalImpressions > 0 ? +((totalClicks / totalImpressions) * 100).toFixed(2) : 0;
        const avgPosition = rawQueries.length > 0
          ? +(rawQueries.reduce((sum: number, q: any) => sum + q.position, 0) / rawQueries.length).toFixed(1)
          : 0;

        const trendRows = (trendData.rows || []).map((r: any) => ({
          date: r.keys[0],
          clicks: r.clicks,
          impressions: r.impressions,
          ctr: +(r.ctr * 100).toFixed(2),
          position: +(r.position).toFixed(1)
        })).sort((a: any, b: any) => a.date.localeCompare(b.date));

        const pagesRows = (pageData.rows || []).map((r: any) => ({
          page: r.keys[0],
          clicks: r.clicks,
          impressions: r.impressions,
          ctr: +(r.ctr * 100).toFixed(2),
          position: +(r.position).toFixed(1)
        }));

        return new Response(JSON.stringify({
          siteUrl,
          daysRequested,
          effectiveDays,
          isDateRangeTruncated,
          isQueryListTruncated: user.plan === 'free' && (queryData.rows || []).length >= 10,
          userPlan: user.plan,
          summary: {
            totalClicks,
            totalImpressions,
            avgCtr,
            avgPosition,
            queriesCount: rawQueries.length,
          },
          queries: rawQueries.slice(0, maxQueriesLimit),
          trend: trendRows,
          pages: pagesRows,
          isRealData: true
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (err) {
      console.warn('GSC API fetch exception, returning structured mock data for fallback/demo');
    }
  }

  // Fallback / Demonstration Data Generator (Used when GSC API has zero data or pending connection)
  const mockQueries = [
    { query: 'seo rank tracker free', clicks: 245, impressions: 3420, ctr: 7.16, position: 2.3 },
    { query: 'google search console analytics tool', clicks: 189, impressions: 2150, ctr: 8.79, position: 1.8 },
    { query: 'aktechstudio tools', clicks: 142, impressions: 1890, ctr: 7.51, position: 1.2 },
    { query: 'free keyword position tracking', clicks: 98, impressions: 1650, ctr: 5.94, position: 4.1 },
    { query: 'serp snippet previewer online', clicks: 84, impressions: 1200, ctr: 7.00, position: 3.5 },
    { query: 'sitemap xml validator online', clicks: 65, impressions: 980, ctr: 6.63, position: 5.2 },
    { query: 'keyword density analyzer', clicks: 54, impressions: 840, ctr: 6.43, position: 4.8 },
    { query: 'cloudflare pages seo analytics', clicks: 42, impressions: 720, ctr: 5.83, position: 6.1 },
    { query: 'search console API report generator', clicks: 38, impressions: 610, ctr: 6.23, position: 3.9 },
    { query: 'realtime GSC rank tracker', clicks: 29, impressions: 530, ctr: 5.47, position: 7.2 },
    { query: 'premium seo tools bundle free', clicks: 24, impressions: 480, ctr: 5.00, position: 8.4 },
    { query: 'website search audit dashboard', clicks: 19, impressions: 390, ctr: 4.87, position: 9.1 },
  ];

  const filteredQueries = user.plan === 'free' ? mockQueries.slice(0, 10) : mockQueries;

  const dates = Array.from({ length: Math.min(effectiveDays, 14) }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (14 - i));
    return d.toISOString().split('T')[0];
  });

  const mockTrend = dates.map(date => ({
    date,
    clicks: Math.floor(Math.random() * 40) + 20,
    impressions: Math.floor(Math.random() * 500) + 300,
    ctr: +((Math.random() * 3) + 5).toFixed(2),
    position: +((Math.random() * 2) + 2.5).toFixed(1)
  }));

  const mockPages = [
    { page: `${siteUrl || 'https://example.com'}/`, clicks: 420, impressions: 5800, ctr: 7.24, position: 2.1 },
    { page: `${siteUrl || 'https://example.com'}/tools/meta-preview`, clicks: 180, impressions: 2400, ctr: 7.50, position: 3.4 },
    { page: `${siteUrl || 'https://example.com'}/blog/seo-rank-tracking`, clicks: 110, impressions: 1600, ctr: 6.88, position: 4.2 },
  ];

  return new Response(JSON.stringify({
    siteUrl: siteUrl || 'https://demo.aktechstudio.com',
    daysRequested,
    effectiveDays,
    isDateRangeTruncated,
    isQueryListTruncated: user.plan === 'free',
    userPlan: user.plan,
    summary: {
      totalClicks: filteredQueries.reduce((s, q) => s + q.clicks, 0),
      totalImpressions: filteredQueries.reduce((s, q) => s + q.impressions, 0),
      avgCtr: 6.84,
      avgPosition: 3.8,
      queriesCount: filteredQueries.length
    },
    queries: filteredQueries,
    trend: mockTrend,
    pages: mockPages,
    isRealData: false,
    demoNotice: 'Showing simulated GSC performance data until Search Console ownership is linked.'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
