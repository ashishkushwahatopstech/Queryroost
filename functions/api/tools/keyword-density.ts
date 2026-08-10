import { getUserFromSession } from '../_auth';

export async function onRequestPost(context: { request: Request; env: any }) {
  const { request, env } = context;
  const user = await getUserFromSession(request, env);
  const db = env.DB;

  const todayStr = new Date().toISOString().split('T')[0];
  const toolName = 'keyword_density';
  const userIdOrIp = user?.id || request.headers.get('CF-Connecting-IP') || 'anon_ip';

  if (db) {
    // Check admin setting
    const adminSetting = await db.prepare('SELECT value FROM admin_settings WHERE key = ?').bind('require_premium_keyword_density').first();
    if (adminSetting?.value === 'true' && user?.plan !== 'premium') {
      return new Response(JSON.stringify({
        error: 'Premium feature',
        message: 'Keyword Density Checker is locked to Premium tier by administrator.',
        requiresPremium: true
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    if (user?.plan !== 'premium') {
      const usageRow = await db.prepare('SELECT used_count FROM tool_usage WHERE (user_id = ? OR ip_address = ?) AND tool_name = ? AND date_str = ?')
        .bind(userIdOrIp, userIdOrIp, toolName, todayStr).first();
      
      const usedCount = usageRow?.used_count || 0;
      if (usedCount >= 3) {
        return new Response(JSON.stringify({
          error: 'Daily limit reached',
          message: 'Free tier includes 3 tool checks per day. Upgrade to Premium for unlimited access.',
          requiresPremium: true,
          usedCount
        }), { status: 429, headers: { 'Content-Type': 'application/json' } });
      }

      await db.prepare(`
        INSERT INTO tool_usage (id, user_id, ip_address, tool_name, used_count, date_str)
        VALUES (?, ?, ?, ?, 1, ?)
        ON CONFLICT(id) DO UPDATE SET used_count = used_count + 1
      `).bind(`tu_${userIdOrIp}_${toolName}_${todayStr}`, user?.id || null, userIdOrIp, toolName, todayStr).run();
    }
  }

  const body: any = await request.json().catch(() => ({}));
  const text: string = body.text || '';

  if (!text.trim()) {
    return new Response(JSON.stringify({ error: 'Text content is required' }), { status: 400 });
  }

  // Calculate Keyword Density
  const stopWords = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'is', 'are', 'was', 'were']);

  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);

  const totalWords = words.length;
  const frequencyMap: Record<string, number> = {};

  for (const w of words) {
    frequencyMap[w] = (frequencyMap[w] || 0) + 1;
  }

  const singleKeywords = Object.entries(frequencyMap)
    .map(([word, count]) => ({
      keyword: word,
      count,
      density: +((count / totalWords) * 100).toFixed(2),
      isStopWord: stopWords.has(word)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  return new Response(JSON.stringify({
    success: true,
    stats: {
      totalWords,
      uniqueWords: Object.keys(frequencyMap).length,
      characters: text.length
    },
    topKeywords: singleKeywords
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
