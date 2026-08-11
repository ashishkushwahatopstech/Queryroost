import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ConnectedSite, SiteAnalyticsResponse } from '../types';
import { fetchConnectedSites, fetchSiteAnalytics } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Globe, Search, RefreshCw, AlertTriangle, ChevronDown, CheckCircle, Sparkles, ShieldCheck, Zap, Code, Target, Eye, Plus, Lock } from 'lucide-react';
import { SiteAuditor } from '../components/tools/SiteAuditor';
import { PageSpeedInspector } from '../components/tools/PageSpeedInspector';
import { MetaOptimizer } from '../components/tools/MetaOptimizer';
import { SchemaValidator } from '../components/tools/SchemaValidator';

interface DashboardPageProps {
  initialSiteUrl?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ initialSiteUrl }) => {
  const { user, openUpgradeModal } = useAuth();
  
  const [activeSiteUrl, setActiveSiteUrl] = useState<string>(initialSiteUrl || 'https://aktechstudio.com');
  const [siteInputText, setSiteInputText] = useState<string>(initialSiteUrl || 'aktechstudio.com');
  
  const [sites, setSites] = useState<ConnectedSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<ConnectedSite | null>(null);
  
  const [days, setDays] = useState<number>(28);
  const [analytics, setAnalytics] = useState<SiteAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const [activeTab, setActiveTab] = useState<'audit' | 'pagespeed' | 'ranks' | 'opportunities' | 'serp'>('audit');
  const [searchQueryFilter, setSearchQueryFilter] = useState<string>('');

  useEffect(() => {
    if (initialSiteUrl) {
      setActiveSiteUrl(initialSiteUrl);
      setSiteInputText(initialSiteUrl.replace(/^https?:\/\//, ''));
    }
  }, [initialSiteUrl]);

  const loadSites = async () => {
    try {
      const data = await fetchConnectedSites();
      setSites(data.connectedSites || []);
      if (data.connectedSites && data.connectedSites.length > 0) {
        setSelectedSite(data.connectedSites[0]);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  useEffect(() => {
    const loadGsc = async () => {
      if (!selectedSite && !activeSiteUrl) return;
      setLoading(true);
      setError('');
      try {
        const targetId = selectedSite?.id || selectedSite?.site_url || activeSiteUrl;
        const data = await fetchSiteAnalytics(targetId, days);
        setAnalytics(data);
      } catch (err: any) {
        setError(err.message || 'Connect Google Search Console to load first-party ranking data');
      } finally {
        setLoading(false);
      }
    };

    loadGsc();
  }, [selectedSite, activeSiteUrl, days]);

  const handleSiteSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteInputText.trim()) return;
    let formatted = siteInputText.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = `https://${formatted}`;
    }
    setActiveSiteUrl(formatted);
  };

  const filteredQueries = (analytics?.queries || []).filter(q =>
    q.query.toLowerCase().includes(searchQueryFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      
      {/* Top Workspace Header (Vercel Style) */}
      <div className="vercel-card p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <form onSubmit={handleSiteSearchSubmit} className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="w-9 h-9 rounded-v-md bg-[#171717] text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
            Q
          </div>

          <div className="flex-1">
            <span className="text-[11px] font-mono text-[#888888] uppercase tracking-wider block font-medium">Target Site Workspace</span>
            <div className="flex items-center gap-2 mt-0.5">
              <input
                type="text"
                value={siteInputText}
                onChange={(e) => setSiteInputText(e.target.value)}
                placeholder="Enter website domain…"
                className="w-full bg-[#fafafa] border border-[#ebebeb] text-[#171717] font-semibold text-xs sm:text-sm rounded-v-sm px-3 py-1.5 focus:outline-none focus:border-[#171717]"
                aria-label="Target Site Domain"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-[#171717] hover:bg-[#333333] text-white font-medium text-xs rounded-v-sm transition shrink-0 focus-visible:ring-2 focus-visible:ring-[#171717]"
              >
                Analyze
              </button>
            </div>
          </div>
        </form>

        {/* Search Console Connection Control */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#888888] font-medium hidden sm:inline">Search Console:</span>
              <select
                value={selectedSite?.site_url || ''}
                onChange={(e) => {
                  const found = sites.find(s => s.site_url === e.target.value);
                  if (found) {
                    setSelectedSite(found);
                    setActiveSiteUrl(found.site_url);
                    setSiteInputText(found.site_url.replace(/^https?:\/\//, ''));
                  }
                }}
                className="bg-[#fafafa] border border-[#ebebeb] text-[#171717] text-xs font-semibold rounded-v-sm px-2.5 py-1.5 focus:outline-none"
                aria-label="Select Connected Property"
              >
                <option value="">{sites.length > 0 ? 'Select Property' : 'Default Target'}</option>
                {sites.map(s => (
                  <option key={s.id} value={s.site_url}>{s.site_url}</option>
                ))}
              </select>
            </div>
          ) : (
            <a
              href="/api/auth/login"
              className="px-3.5 py-1.5 bg-[#171717] hover:bg-[#333333] text-white text-xs font-medium rounded-v-sm transition flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Connect GSC Rank Data</span>
            </a>
          )}
        </div>

      </div>

      {/* 5 Unified Site Tools Navigation Tabs */}
      <div className="vercel-card-soft p-1.5 flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-v-sm text-xs font-medium transition shrink-0 focus-visible:ring-2 focus-visible:ring-[#171717] ${
            activeTab === 'audit'
              ? 'bg-[#171717] text-white font-semibold'
              : 'text-[#4d4d4d] hover:text-[#171717] hover:bg-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          <span>1. Technical Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('pagespeed')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-v-sm text-xs font-medium transition shrink-0 focus-visible:ring-2 focus-visible:ring-[#171717] ${
            activeTab === 'pagespeed'
              ? 'bg-[#171717] text-white font-semibold'
              : 'text-[#4d4d4d] hover:text-[#171717] hover:bg-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" aria-hidden="true" />
          <span>2. PageSpeed & Vitals</span>
        </button>

        <button
          onClick={() => setActiveTab('ranks')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-v-sm text-xs font-medium transition shrink-0 focus-visible:ring-2 focus-visible:ring-[#171717] ${
            activeTab === 'ranks'
              ? 'bg-[#171717] text-white font-semibold'
              : 'text-[#4d4d4d] hover:text-[#171717] hover:bg-white'
          }`}
        >
          <Search className="w-3.5 h-3.5" aria-hidden="true" />
          <span>3. Search Ranks & Keywords</span>
        </button>

        <button
          onClick={() => setActiveTab('opportunities')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-v-sm text-xs font-medium transition shrink-0 focus-visible:ring-2 focus-visible:ring-[#171717] ${
            activeTab === 'opportunities'
              ? 'bg-[#171717] text-white font-semibold'
              : 'text-[#4d4d4d] hover:text-[#171717] hover:bg-white'
          }`}
        >
          <Target className="w-3.5 h-3.5" aria-hidden="true" />
          <span>4. Striking Opportunities</span>
        </button>

        <button
          onClick={() => setActiveTab('serp')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-v-sm text-xs font-medium transition shrink-0 focus-visible:ring-2 focus-visible:ring-[#171717] ${
            activeTab === 'serp'
              ? 'bg-[#171717] text-white font-semibold'
              : 'text-[#4d4d4d] hover:text-[#171717] hover:bg-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          <span>5. SERP & Schema Preview</span>
        </button>
      </div>

      {/* Tab 1: Technical Site Audit */}
      {activeTab === 'audit' && (
        <SiteAuditor siteId={activeSiteUrl} />
      )}

      {/* Tab 2: PageSpeed & Web Vitals */}
      {activeTab === 'pagespeed' && (
        <PageSpeedInspector />
      )}

      {/* Tab 3: Search Ranks & Keywords */}
      {activeTab === 'ranks' && (
        <div className="space-y-6">
          {!user ? (
            <div className="p-8 vercel-card text-center space-y-4 max-w-xl mx-auto">
              <Globe className="w-10 h-10 text-[#171717] mx-auto" aria-hidden="true" />
              <h3 className="text-lg font-extrabold text-[#171717]">Connect Google Search Console</h3>
              <p className="text-xs text-[#4d4d4d] leading-relaxed">
                Sign in with Google to view first-party search query rankings, total clicks, impressions, and CTR % for {activeSiteUrl}.
              </p>
              <a
                href="/api/auth/login"
                className="inline-block px-5 py-2.5 bg-[#171717] hover:bg-[#333333] text-white font-medium text-xs rounded-v-sm shadow-sm"
              >
                Sign In with Google
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 vercel-card">
                  <div className="text-xs text-[#888888] font-mono uppercase tracking-wider font-medium">Total Clicks</div>
                  <div className="text-3xl font-bold text-[#171717] mt-2 font-mono tabular-nums">{analytics?.summary?.totalClicks || 0}</div>
                </div>
                <div className="p-5 vercel-card">
                  <div className="text-xs text-[#888888] font-mono uppercase tracking-wider font-medium">Total Impressions</div>
                  <div className="text-3xl font-bold text-[#171717] mt-2 font-mono tabular-nums">{analytics?.summary?.totalImpressions || 0}</div>
                </div>
                <div className="p-5 vercel-card">
                  <div className="text-xs text-[#888888] font-mono uppercase tracking-wider font-medium">Average CTR</div>
                  <div className="text-3xl font-bold text-[#171717] mt-2 font-mono tabular-nums">{analytics?.summary?.avgCtr || 0}%</div>
                </div>
                <div className="p-5 vercel-card">
                  <div className="text-xs text-[#888888] font-mono uppercase tracking-wider font-medium">Average Rank Position</div>
                  <div className="text-3xl font-bold text-[#0070f3] mt-2 font-mono tabular-nums">#{analytics?.summary?.avgPosition || 0}</div>
                </div>
              </div>

              {/* Queries Table */}
              <div className="vercel-card p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-[#171717] text-base">Ranked Search Queries</h3>
                  <input
                    type="text"
                    placeholder="Filter keywords…"
                    value={searchQueryFilter}
                    onChange={(e) => setSearchQueryFilter(e.target.value)}
                    className="bg-[#fafafa] border border-[#ebebeb] text-[#171717] text-xs font-medium rounded-v-sm px-3 py-1.5 focus:outline-none focus:border-[#171717]"
                    aria-label="Filter Search Queries"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#fafafa] border-b border-[#ebebeb] text-[#888888] uppercase font-mono text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3.5 rounded-l-v-sm">Query Keyword</th>
                        <th className="p-3.5 text-right">Clicks</th>
                        <th className="p-3.5 text-right">Impressions</th>
                        <th className="p-3.5 text-right">CTR</th>
                        <th className="p-3.5 text-right rounded-r-v-sm">Avg Position</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebebeb] text-[#171717]">
                      {filteredQueries.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#fafafa] transition">
                          <td className="p-3.5 font-semibold text-[#171717]">{row.query}</td>
                          <td className="p-3.5 text-right font-mono tabular-nums font-bold text-[#171717]">{row.clicks}</td>
                          <td className="p-3.5 text-right font-mono tabular-nums text-[#888888]">{row.impressions}</td>
                          <td className="p-3.5 text-right font-mono tabular-nums text-[#4d4d4d]">{row.ctr}%</td>
                          <td className="p-3.5 text-right font-mono tabular-nums text-[#0070f3] font-bold">#{row.position}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Striking-Distance Opportunities */}
      {activeTab === 'opportunities' && (
        <div className="vercel-card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-[#171717] text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-[#171717]" aria-hidden="true" />
                <span>Page 2 Striking-Distance Keywords (Pos #11–#20)</span>
              </h3>
              <p className="text-xs text-[#4d4d4d]">High-impression keywords sitting on Google Page 2. Optimizing page titles and internal links pushes these to Page 1!</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(analytics?.queries || [
              { query: 'gsc rank tracker free', position: 12.4, impressions: 1420 },
              { query: 'pagespeed core web vitals checker', position: 14.8, impressions: 980 },
              { query: 'technical seo auditor online', position: 11.2, impressions: 2100 }
            ])
              .filter(q => q.position >= 10.5 && q.position <= 20.5)
              .map((q, idx) => (
                <div key={idx} className="p-4 bg-white border border-[#ebebeb] rounded-v-lg space-y-2 shadow-sm">
                  <div className="font-bold text-[#171717] text-xs truncate">{q.query}</div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#888888]">{q.impressions} impressions</span>
                    <span className="text-[#0070f3] font-mono tabular-nums font-bold">Rank #{q.position}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 5: SERP & Schema Preview */}
      {activeTab === 'serp' && (
        <div className="space-y-6">
          <MetaOptimizer />
          <SchemaValidator />
        </div>
      )}

    </div>
  );
};
