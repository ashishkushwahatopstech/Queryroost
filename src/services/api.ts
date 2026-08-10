import { UserProfile, ConnectedSite, GscVerifiedSite, SiteAnalyticsResponse, AdminStats } from '../types';

export async function fetchCurrentUser(): Promise<{ authenticated: boolean; user?: UserProfile }> {
  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) return { authenticated: false };
    return await res.json();
  } catch (err) {
    console.error('Fetch me error:', err);
    return { authenticated: false };
  }
}

export async function logoutUser(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    return res.ok;
  } catch (err) {
    return false;
  }
}

export async function fetchConnectedSites(): Promise<{ connectedSites: ConnectedSite[]; gscVerifiedSites: GscVerifiedSite[]; userPlan: string }> {
  try {
    const res = await fetch('/api/sites');
    if (!res.ok) throw new Error('Failed to fetch sites');
    return await res.json();
  } catch (err) {
    return { connectedSites: [], gscVerifiedSites: [], userPlan: 'free' };
  }
}

export async function connectSite(siteUrl: string): Promise<{ success?: boolean; error?: string; message?: string; requiresPremium?: boolean; site?: ConnectedSite }> {
  try {
    const res = await fetch('/api/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteUrl })
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || 'Failed to connect site', message: data.message, requiresPremium: data.requiresPremium };
    }
    return data;
  } catch (err: any) {
    return { error: err.message || 'Network error' };
  }
}

export async function fetchSiteAnalytics(siteId: string, days: number = 28): Promise<SiteAnalyticsResponse> {
  const res = await fetch(`/api/sites/${encodeURIComponent(siteId)}/analytics?days=${days}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || errData.error || 'Failed to load site analytics');
  }
  return await res.json();
}

export async function fetchSiteSitemap(siteId: string): Promise<any> {
  const res = await fetch(`/api/sites/${encodeURIComponent(siteId)}/sitemap`);
  if (!res.ok) return { sitemaps: [], mobileUsability: { status: 'UNKNOWN' } };
  return await res.json();
}

export async function fetchSiteAudit(siteId: string): Promise<any> {
  const res = await fetch(`/api/sites/${encodeURIComponent(siteId)}/audit`);
  if (!res.ok) throw new Error('Failed to fetch site audit');
  return await res.json();
}

export async function fetchInternalLinks(siteId: string): Promise<any> {
  const res = await fetch(`/api/sites/${encodeURIComponent(siteId)}/links`);
  if (!res.ok) return { totalInternalLinks: 0, orphanPages: [], linkDistribution: [] };
  return await res.json();
}

export async function fetchPageSpeed(url: string, strategy: string = 'mobile'): Promise<any> {
  const res = await fetch(`/api/pagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || errData.error || 'PageSpeed Insights fetch failed');
  }
  return await res.json();
}

export async function runMetaPreview(url: string, title?: string, description?: string): Promise<any> {
  const res = await fetch('/api/tools/meta-preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, title, description })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to run meta preview');
  return data;
}

export async function runSchemaValidator(url?: string, schemaCode?: string): Promise<any> {
  const res = await fetch('/api/tools/schema-validator', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, schemaCode })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to validate schema');
  return data;
}

export async function upgradePlan(): Promise<any> {
  const res = await fetch('/api/upgrade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'simulate' })
  });
  return await res.json();
}

export async function fetchAdminStats(): Promise<{ authorized: boolean; stats?: AdminStats; users?: any[]; adminSettings?: Record<string, string>; error?: string; message?: string }> {
  const res = await fetch('/api/admin/stats');
  const data = await res.json();
  if (!res.ok) {
    return { authorized: false, error: data.error, message: data.message };
  }
  return data;
}

export async function updateAdminUserPlan(userId: string, targetPlan: 'free' | 'premium'): Promise<any> {
  const res = await fetch('/api/admin/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, targetPlan })
  });
  return await res.json();
}

export async function updateAdminSetting(key: string, value: string): Promise<any> {
  const res = await fetch('/api/admin/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value })
  });
  return await res.json();
}
