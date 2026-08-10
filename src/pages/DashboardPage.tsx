import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ConnectedSite, SiteAnalyticsResponse } from '../types';
import { fetchConnectedSites, connectSite, fetchSiteAnalytics } from '../services/api';
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
  const [gscVerifiedSites, setGscVerifiedSites] = useState<any[]>([]);
  const [selectedSite, setSelectedSite] = useState<ConnectedSite | null>(null);
  
  const [days, setDays] = useState<number>(28);
  const [analytics, setAnalytics] = useState<SiteAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const [activeTab, setActiveTab] = useState<'audit' | 'pagespeed' | 'ranks' | 'opportunities' | 'serp'>('audit');
  const [searchQueryFilter, setSearchQueryFilter] = useState<string>('');

  // Sync initial site URL if prop changes
  useEffect(() => {
    if (initialSiteUrl) {
      setActiveSiteUrl(initialSiteUrl);
      setSiteInputText(initialSiteUrl.replace(/^https?:\/\//, ''));
    }
  }, [initialSiteUrl]);

  // Load connected GSC sites
  const loadSites = async () => {
    try {
      const data = await fetchConnectedSites();
      setSites(data.connectedSites || []);
      setGscVerifiedSites(data.gscVerifiedSites || []);

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

  // Fetch GSC Analytics when user is logged in
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Site Workspace Sticky Header */}
      <div className="glass-card p-4 sm:p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Active Site URL Bar */}
        <form onSubmit={handleSiteSearchSubmit} className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-emerald-600 shadow-sm shrink-0">
            <Globe className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Target Site Workspace</span>
            <div className="flex items-center gap-2 mt-0.5">
              <input
                type="text"
                value={siteInputText}
                onChange={(e) => setSiteInputText(e.target.value)}
                placeholder="Enter website URL..."
                className="w-full glass-input text-slate-900 font-extrabold text-sm sm:text-base rounded-2xl px-3.5 py-1.5 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition shrink-0"
              >
                Analyze
              </button>
            </div>
          </div>
        </form>

        {/* GSC Property Picker or Login Prompt */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Search Console:</span>
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
                className="glass-input text-slate-900 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none"
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
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Connect GSC Rank Data</span>
            </a>
          )}
        </div>

      </div>

      {/* 5 Unified Site Tools Navigation Bar */}
      <div className="glass-card p-2 rounded-3xl flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition shrink-0 ${
            activeTab === 'audit'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>1. Technical Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('pagespeed')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition shrink-0 ${
            activeTab === 'pagespeed'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>2. PageSpeed & Vitals</span>
        </button>

        <button
          onClick={() => setActiveTab('ranks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition shrink-0 ${
            activeTab === 'ranks'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>3. Search Ranks & Keywords</span>
        </button>

        <button
          onClick={() => setActiveTab('opportunities')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition shrink-0 ${
            activeTab === 'opportunities'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>4. Striking Opportunities</span>
        </button>

        <button
          onClick={() => setActiveTab('serp')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition shrink-0 ${
            activeTab === 'serp'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          <Eye className="w-4 h-4" />
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

      {/* Tab 3: Search Ranks & Keywords (Google Search Console) */}
      {activeTab === 'ranks' && (
        <div className="space-y-6">
          {!user ? (
            <div className="p-8 glass-card rounded-3xl text-center space-y-4 max-w-xl mx-auto">
              <Globe className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-extrabold text-slate-900">Connect Google Search Console</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sign in with Google to view first-party search query rankings, total clicks, impressions, and CTR % for {activeSiteUrl}.
              </p>
              <a
                href="/api/auth/login"
                className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Sign In with Google
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 glass-card rounded-3xl">
                  <div className="text-xs text-slate-500 font-semibold">Total Clicks</div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">{analytics?.summary?.totalClicks || 0}</div>
                </div>
                <div className="p-5 glass-card rounded-3xl">
                  <div className="text-xs text-slate-500 font-semibold">Total Impressions</div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">{analytics?.summary?.totalImpressions || 0}</div>
                </div>
                <div className="p-5 glass-card rounded-3xl">
                  <div className="text-xs text-slate-500 font-semibold">Average CTR</div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">{analytics?.summary?.avgCtr || 0}%</div>
                </div>
                <div className="p-5 glass-card rounded-3xl">
                  <div className="text-xs text-slate-500 font-semibold">Average Rank Position</div>
                  <div className="text-3xl font-extrabold text-emerald-600 mt-2 font-mono">#{analytics?.summary?.avgPosition || 0}</div>
                </div>
              </div>

              {/* Queries Table */}
              <div className="glass-card p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-base">Top Ranked Search Queries</h3>
                  <input
                    type="text"
                    placeholder="Filter keywords..."
                    value={searchQueryFilter}
                    onChange={(e) => setSearchQueryFilter(e.target.value)}
                    className="glass-input text-slate-900 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100/70 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3 rounded-l-xl">Query Keyword</th>
                        <th className="p-3 text-right">Clicks</th>
                        <th className="p-3 text-right">Impressions</th>
                        <th className="p-3 text-right">CTR</th>
                        <th className="p-3 text-right rounded-r-xl">Avg Position</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60">
                      {filteredQueries.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-100/50 transition">
                          <td className="p-3 font-bold text-slate-900">{row.query}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">{row.clicks}</td>
                          <td className="p-3 text-right font-mono text-slate-500">{row.impressions}</td>
                          <td className="p-3 text-right font-mono text-slate-700">{row.ctr}%</td>
                          <td className="p-3 text-right font-mono text-emerald-600 font-extrabold">#{row.position}</td>
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
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                <span>Page 2 Striking-Distance Keywords (Pos #11–#20)</span>
              </h3>
              <p className="text-xs text-slate-500">Keywords ranking on Page 2 with high impression potential. Updating page titles and adding internal links moves these onto Page 1!</p>
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
                <div key={idx} className="p-4 bg-white border border-slate-200/90 rounded-2xl space-y-2 shadow-sm">
                  <div className="font-bold text-slate-900 text-xs truncate">{q.query}</div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">{q.impressions} impressions</span>
                    <span className="text-emerald-700 font-extrabold font-mono">Rank #{q.position}</span>
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
