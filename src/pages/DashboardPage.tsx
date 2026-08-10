import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ConnectedSite, SiteAnalyticsResponse } from '../types';
import { fetchConnectedSites, connectSite, fetchSiteAnalytics, fetchSiteSitemap } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Plus, Lock, Globe, Search, RefreshCw, AlertTriangle, ChevronDown, CheckCircle, Smartphone, Sparkles, FileText, ShieldCheck, Zap, Code, Network, Download } from 'lucide-react';
import { SiteAuditView } from '../components/dashboard/SiteAuditView';
import { PageSpeedView } from '../components/dashboard/PageSpeedView';
import { SchemaValidatorView } from '../components/dashboard/SchemaValidatorView';
import { InternalLinkMapView } from '../components/dashboard/InternalLinkMapView';
import { PerformanceReportView } from '../components/dashboard/PerformanceReportView';

export const DashboardPage: React.FC = () => {
  const { user, openUpgradeModal } = useAuth();
  
  const [sites, setSites] = useState<ConnectedSite[]>([]);
  const [gscVerifiedSites, setGscVerifiedSites] = useState<any[]>([]);
  const [selectedSite, setSelectedSite] = useState<ConnectedSite | null>(null);
  
  const [days, setDays] = useState<number>(28);
  const [analytics, setAnalytics] = useState<SiteAnalyticsResponse | null>(null);
  const [sitemapData, setSitemapData] = useState<any>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState<boolean>(false);
  const [customSiteInput, setCustomSiteInput] = useState<string>('');
  const [addSiteLoading, setAddSiteLoading] = useState<boolean>(false);
  const [addSiteError, setAddSiteError] = useState<string>('');
  
  const [searchQueryFilter, setSearchQueryFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'queries' | 'pages' | 'audit' | 'pagespeed' | 'schema' | 'links' | 'sitemap' | 'report'>('queries');

  // Load connected sites
  const loadSites = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchConnectedSites();
      setSites(data.connectedSites || []);
      setGscVerifiedSites(data.gscVerifiedSites || []);

      if (data.connectedSites && data.connectedSites.length > 0) {
        setSelectedSite(data.connectedSites[0]);
      } else if (data.gscVerifiedSites && data.gscVerifiedSites.length > 0) {
        const fallbackSite = {
          id: 'gsc_site_0',
          site_url: data.gscVerifiedSites[0].siteUrl,
          permission_level: data.gscVerifiedSites[0].permissionLevel,
          added_at: Math.floor(Date.now() / 1000)
        };
        setSelectedSite(fallbackSite);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load sites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  // Fetch site analytics when selected site or days change
  useEffect(() => {
    if (!selectedSite) return;

    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const [data, sitemap] = await Promise.all([
          fetchSiteAnalytics(selectedSite.id || selectedSite.site_url, days),
          fetchSiteSitemap(selectedSite.id || selectedSite.site_url)
        ]);
        setAnalytics(data);
        setSitemapData(sitemap);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Search Console analytics');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedSite, days]);

  const handleAddSite = async (siteUrlToAdd: string) => {
    if (!siteUrlToAdd.trim()) return;
    setAddSiteLoading(true);
    setAddSiteError('');

    const res = await connectSite(siteUrlToAdd);
    setAddSiteLoading(false);

    if (res.error) {
      setAddSiteError(res.message || res.error);
      if (res.requiresPremium) {
        setTimeout(() => openUpgradeModal(), 800);
      }
    } else {
      setIsAddSiteModalOpen(false);
      setCustomSiteInput('');
      await loadSites();
    }
  };

  const filteredQueries = (analytics?.queries || []).filter(q =>
    q.query.toLowerCase().includes(searchQueryFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header Bar */}
      <div className="glass-card p-4 sm:p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Site Selector */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-emerald-600 shadow-sm">
            <Globe className="w-6 h-6" />
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Connected Search Console Property</span>
            <div className="flex items-center gap-2 mt-0.5">
              {sites.length > 0 ? (
                <div className="relative">
                  <select
                    value={selectedSite?.site_url || ''}
                    onChange={(e) => {
                      const found = sites.find(s => s.site_url === e.target.value);
                      if (found) setSelectedSite(found);
                    }}
                    className="glass-input text-slate-900 font-bold text-base rounded-2xl px-3.5 py-1.5 pr-8 appearance-none focus:outline-none cursor-pointer"
                  >
                    {sites.map(s => (
                      <option key={s.id} value={s.site_url}>{s.site_url}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              ) : (
                <span className="text-sm font-bold text-slate-900">
                  {selectedSite?.site_url || 'No Website Connected'}
                </span>
              )}

              <button
                onClick={() => setIsAddSiteModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1 transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Site</span>
              </button>
            </div>
          </div>
        </div>

        {/* Date Filter & Refresh */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center glass-card p-1 rounded-2xl text-xs">
            {[7, 28, 90, 480].map((d) => {
              const isLocked = user?.plan === 'free' && d > 28;
              return (
                <button
                  key={d}
                  onClick={() => {
                    if (isLocked) {
                      openUpgradeModal();
                    } else {
                      setDays(d);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition ${
                    days === d
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span>{d === 480 ? '16 Months' : `${d} Days`}</span>
                  {isLocked && <Lock className="w-3 h-3 text-amber-500" />}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => selectedSite && fetchSiteAnalytics(selectedSite.id || selectedSite.site_url, days).then(setAnalytics)}
            disabled={loading}
            className="p-2.5 rounded-2xl glass-button text-slate-600 hover:text-emerald-600 transition"
            title="Refresh GSC Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>

      </div>

      {/* Free Tier Notice Banner */}
      {user?.plan === 'free' && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2.5 text-amber-900 font-medium">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Free Plan Enforced:</strong> Showing top 10 tracked queries & 28-day history for 1 site.
            </span>
          </div>
          <button
            onClick={openUpgradeModal}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-extrabold rounded-xl hover:brightness-105 transition shrink-0 flex items-center gap-1 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>Unlock Full 16-Month Rankings</span>
          </button>
        </div>
      )}

      {/* Error Notice */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analytics Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 glass-card glass-card-hover rounded-3xl relative overflow-hidden">
          <div className="text-xs text-slate-500 font-semibold">Total Clicks</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
            {loading ? '...' : analytics?.summary.totalClicks.toLocaleString() || '0'}
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-bold">Google Search Clicks</p>
        </div>

        <div className="p-5 glass-card glass-card-hover rounded-3xl relative overflow-hidden">
          <div className="text-xs text-slate-500 font-semibold">Total Impressions</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
            {loading ? '...' : analytics?.summary.totalImpressions.toLocaleString() || '0'}
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-bold">SERP Impressions</p>
        </div>

        <div className="p-5 glass-card glass-card-hover rounded-3xl relative overflow-hidden">
          <div className="text-xs text-slate-500 font-semibold">Average CTR</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
            {loading ? '...' : `${analytics?.summary.avgCtr || '0'}%`}
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-bold">Click-Through Rate</p>
        </div>

        <div className="p-5 glass-card glass-card-hover rounded-3xl relative overflow-hidden">
          <div className="text-xs text-slate-500 font-semibold">Average Rank Position</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2 font-mono">
            {loading ? '...' : `#${analytics?.summary.avgPosition || '0'}`}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-semibold">Google Search Position</p>
        </div>
      </div>

      {/* Recharts Historical Trend Line */}
      <div className="p-6 glass-card rounded-3xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900">Search Performance Over Time</h3>
            <p className="text-xs text-slate-500">Daily clicks and impression trends from Google Search Console</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-mono font-bold">
            {analytics?.trend.length || 0} Data Points
          </span>
        </div>

        <div className="h-64 w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading trend chart...</div>
          ) : analytics?.trend && analytics.trend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="clicksGradLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '14px', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  labelStyle={{ color: '#475569', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="clicks" name="Clicks" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#clicksGradLight)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">No daily trend data available for this range.</div>
          )}
        </div>
      </div>

      {/* Main Breakdown Section (Queries / Pages / Technical Audit / PageSpeed / Schema / Links / Reports) */}
      <div className="p-6 glass-card rounded-3xl space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 overflow-x-auto">
            <button
              onClick={() => setActiveTab('queries')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'queries' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-emerald-600" />
              <span>Queries ({analytics?.queries.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('pages')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'pages' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Top Pages</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'audit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Site Audit</span>
            </button>

            <button
              onClick={() => setActiveTab('pagespeed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'pagespeed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>PageSpeed Vitals</span>
            </button>

            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'schema' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-emerald-600" />
              <span>Schema</span>
            </button>

            <button
              onClick={() => setActiveTab('links')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'links' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5 text-emerald-600" />
              <span>Link Map</span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'report' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Reports</span>
            </button>
          </div>

          {activeTab === 'queries' && (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter search queries..."
                value={searchQueryFilter}
                onChange={(e) => setSearchQueryFilter(e.target.value)}
                className="glass-input text-slate-900 text-xs rounded-xl pl-9 pr-4 py-2 w-full sm:w-64 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Queries Table */}
        {activeTab === 'queries' && (
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
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <span>{row.query}</span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">{row.clicks}</td>
                    <td className="p-3 text-right font-mono text-slate-500">{row.impressions}</td>
                    <td className="p-3 text-right font-mono text-slate-700">{row.ctr}%</td>
                    <td className="p-3 text-right font-mono text-emerald-600 font-extrabold">#{row.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Truncated Notice for Free Users */}
            {user?.plan === 'free' && analytics?.isQueryListTruncated && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-50/60 border border-dashed border-amber-200 text-center flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Remaining 490+ Ranked Queries Truncated by Free Plan</span>
                </div>
                <button
                  onClick={openUpgradeModal}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  Upgrade to Premium to View All Keywords
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Pages Table */}
        {activeTab === 'pages' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/70 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Landing Page URL</th>
                  <th className="p-3 text-right">Clicks</th>
                  <th className="p-3 text-right">Impressions</th>
                  <th className="p-3 text-right">CTR</th>
                  <th className="p-3 text-right rounded-r-xl">Avg Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60">
                {(analytics?.pages || []).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-100/50 transition">
                    <td className="p-3 font-mono text-slate-900 truncate max-w-md">{row.page}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">{row.clicks}</td>
                    <td className="p-3 text-right font-mono text-slate-500">{row.impressions}</td>
                    <td className="p-3 text-right font-mono text-slate-700">{row.ctr}%</td>
                    <td className="p-3 text-right font-mono text-emerald-600 font-extrabold">#{row.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Site Audit */}
        {activeTab === 'audit' && (
          <SiteAuditView siteId={selectedSite?.id || selectedSite?.site_url || 'site_0'} />
        )}

        {/* Tab 4: PageSpeed & Vitals */}
        {activeTab === 'pagespeed' && (
          <PageSpeedView siteUrl={selectedSite?.site_url || 'https://aktechstudio.com'} />
        )}

        {/* Tab 5: Schema Validator */}
        {activeTab === 'schema' && (
          <SchemaValidatorView siteUrl={selectedSite?.site_url || 'https://aktechstudio.com'} />
        )}

        {/* Tab 6: Link Map */}
        {activeTab === 'links' && (
          <InternalLinkMapView siteId={selectedSite?.id || selectedSite?.site_url || 'site_0'} />
        )}

        {/* Tab 7: Reports */}
        {activeTab === 'report' && (
          <PerformanceReportView analytics={analytics} />
        )}

      </div>

      {/* Add Connected Site Modal */}
      {isAddSiteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="w-full max-w-lg glass-modal rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Connect Website Property</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select a verified domain from your Google Search Console account or enter your site URL.
            </p>

            {addSiteError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{addSiteError}</span>
              </div>
            )}

            {/* List GSC Verified Sites */}
            {gscVerifiedSites.length > 0 && (
              <div className="mb-4">
                <label className="text-xs text-slate-500 font-semibold mb-2 block">Verified Google Search Console Properties:</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {gscVerifiedSites.map((s, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleAddSite(s.siteUrl)}
                      className="p-2.5 rounded-xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 cursor-pointer flex justify-between items-center transition"
                    >
                      <span className="text-xs font-bold text-slate-800">{s.siteUrl}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-mono">{s.permissionLevel}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Or enter exact site URL:</label>
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                value={customSiteInput}
                onChange={(e) => setCustomSiteInput(e.target.value)}
                className="w-full glass-input text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddSiteModalOpen(false)}
                className="px-4 py-2 rounded-xl glass-button text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddSite(customSiteInput)}
                disabled={addSiteLoading || !customSiteInput.trim()}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
              >
                {addSiteLoading ? 'Verifying...' : 'Connect Site'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
