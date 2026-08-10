export type UserPlan = 'free' | 'premium';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
  plan: UserPlan;
  isAdmin?: boolean;
}

export interface ConnectedSite {
  id: string;
  site_url: string;
  permission_level: string;
  added_at: number;
}

export interface GscVerifiedSite {
  siteUrl: string;
  permissionLevel: string;
}

export interface SearchQueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface TrendRow {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface PageRow {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SiteAnalyticsResponse {
  siteUrl: string;
  daysRequested: number;
  effectiveDays: number;
  isDateRangeTruncated: boolean;
  isQueryListTruncated: boolean;
  userPlan: UserPlan;
  summary: {
    totalClicks: number;
    totalImpressions: number;
    avgCtr: number;
    avgPosition: number;
    queriesCount: number;
  };
  queries: SearchQueryRow[];
  trend: TrendRow[];
  pages: PageRow[];
  isRealData: boolean;
  demoNotice?: string;
}

export interface AdminStats {
  totalUsers: number;
  freeUsers: number;
  premiumUsers: number;
  activeSites: number;
  gscApiQuotaUsedToday: number;
  gscApiQuotaTotal: number;
  adminEmail: string;
}
