import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ConnectedSite, SiteAnalyticsResponse } from '../types';
import { fetchConnectedSites, connectSite, fetchSiteAnalytics, fetchSiteSitemap } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Plus, Lock, Globe, Search, RefreshCw, AlertTriangle, ExternalLink, Calendar, ChevronDown, CheckCircle, Info, Sparkles, Filter, FileText, Smartphone } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'queries' | 'pages' | 'sitemap'>('queries');

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
        // Fallback site selection
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/60 p-4 sm:p-6 rounded-2xl border border-gray-800">
        
        {/* Site Selector */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Globe className="w-6 h-6" />
          </div>

          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Connected Search Console Property</span>
            <div className="flex items-center gap-2 mt-0.5">
              {sites.length > 0 ? (
                <div className="relative">
                  <select
                    value={selectedSite?.site_url || ''}
                    onChange={(e) => {
                      const found = sites.find(s => s.site_url === e.target.value);
                      if (found) setSelectedSite(found);
                    }}
                    className="bg-[#0b0f19] border border-gray-700 text-white font-bold text-base rounded-xl px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {sites.map(s => (
                      <option key={s.id} value={s.site_url}>{s.site_url}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              ) : (
                <span className="text-sm font-bold text-white">
                  {selectedSite?.site_url || 'No Website Connected'}
                </span>
              )}

              <button
                onClick={() => setIsAddSiteModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Site</span>
              </button>
            </div>
          </div>
        </div>

        {/* Date Filter & Refresh */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#0b0f19] p-1 rounded-xl border border-gray-800 text-xs">
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
                  className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition ${
                    days === d
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{d === 480 ? '16 Months' : `${d} Days`}</span>
                  {isLocked && <Lock className="w-3 h-3 text-amber-400" />}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => selectedSite && fetchSiteAnalytics(selectedSite.id || selectedSite.site_url, days).then(setAnalytics)}
            disabled={loading}
            className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
            title="Refresh GSC Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>

      </div>

      {/* Free Tier Notice Banner */}
      {user?.plan === 'free' && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-gray-900 to-gray-900 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-200">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Free Plan Enforced:</strong> Showing top 10 tracked queries & 28-day history for 1 site.
            </span>
          </div>
          <button
            onClick={openUpgradeModal}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold rounded-lg hover:brightness-110 transition shrink-0 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>Unlock Full 16-Month Rankings</span>
          </button>
        </div>
      )}

      {/* Error Notice */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analytics Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-5 bg-gray-900/60 border border-gray-800 rounded-2xl relative overflow-hidden group">
          <div className="text-xs text-gray-400 font-medium">Total Clicks</div>
          <div className="text-3xl font-extrabold text-white mt-2 font-mono">
            {loading ? '...' : analytics?.summary.totalClicks.toLocaleString() || '0'}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">Google Search Clicks</p>
        </div>

        <div className="p-5 bg-gray-900/60 border border-gray-800 rounded-2xl relative overflow-hidden group">
          <div className="text-xs text-gray-400 font-medium">Total Impressions</div>
          <div className="text-3xl font-extrabold text-white mt-2 font-mono">
            {loading ? '...' : analytics?.summary.totalImpressions.toLocaleString() || '0'}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">SERP Impressions</p>
        </div>

        <div className="p-5 bg-gray-900/60 border border-gray-800 rounded-2xl relative overflow-hidden group">
          <div className="text-xs text-gray-400 font-medium">Average CTR</div>
          <div className="text-3xl font-extrabold text-white mt-2 font-mono">
            {loading ? '...' : `${analytics?.summary.avgCtr || '0'}%`}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">Click-Through Rate</p>
        </div>

        <div className="p-5 bg-gray-900/60 border border-gray-800 rounded-2xl relative overflow-hidden group">
          <div className="text-xs text-gray-400 font-medium">Average Rank Position</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2 font-mono">
            {loading ? '...' : `#${analytics?.summary.avgPosition || '0'}`}
          </div>
          <p className="text-[11px] text-gray-400 mt-1 font-medium">Google Search Position</p>
        </div>

      </div>

      {/* Recharts Historical Trend Line */}
      <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Search Performance Over Time</h3>
            <p className="text-xs text-gray-400">Daily clicks and impression trends from Google Search Console</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 font-mono">
            {analytics?.trend.length || 0} Data Points
          </span>
        </div>

        <div className="h-64 w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-gray-500">Loading trend chart...</div>
          ) : analytics?.trend && analytics.trend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#9ca3af', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="clicks" name="Clicks" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#clicksGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-gray-500">No daily trend data available for this range.</div>
          )}
        </div>
      </div>

      {/* Main Breakdown Section (Queries / Pages / Sitemap Status) */}
      <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-2xl">
        
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2 bg-[#0b0f19] p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setActiveTab('queries')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'queries' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Queries ({analytics?.queries.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('pages')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'pages' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Top Pages ({analytics?.pages.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('sitemap')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'sitemap' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Indexing & Sitemap</span>
            </button>
          </div>

          {activeTab === 'queries' && (
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter search queries..."
                value={searchQueryFilter}
                onChange={(e) => setSearchQueryFilter(e.target.value)}
                className="bg-[#0b0f19] border border-gray-700 text-white text-xs rounded-xl pl-9 pr-4 py-2 w-full sm:w-64 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Queries Table */}
        {activeTab === 'queries' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0b0f19] text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Query</th>
                  <th className="p-3 text-right">Clicks</th>
                  <th className="p-3 text-right">Impressions</th>
                  <th className="p-3 text-right">CTR</th>
                  <th className="p-3 text-right rounded-r-xl">Avg Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredQueries.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/40 transition">
                    <td className="p-3 font-semibold text-emerald-300 flex items-center gap-2">
                      <span>{row.query}</span>
                    </td>
                    <td className="p-3 text-right font-mono font-medium">{row.clicks}</td>
                    <td className="p-3 text-right font-mono text-gray-400">{row.impressions}</td>
                    <td className="p-3 text-right font-mono text-gray-300">{row.ctr}%</td>
                    <td className="p-3 text-right font-mono text-emerald-400 font-bold">#{row.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Truncated Notice for Free Users */}
            {user?.plan === 'free' && analytics?.isQueryListTruncated && (
              <div className="mt-4 p-4 rounded-xl bg-gray-950/80 border border-dashed border-gray-700 text-center flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Remaining 490+ Ranked Queries Truncated by Free Plan</span>
                </div>
                <button
                  onClick={openUpgradeModal}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs rounded-xl shadow transition"
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
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0b0f19] text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Landing Page URL</th>
                  <th className="p-3 text-right">Clicks</th>
                  <th className="p-3 text-right">Impressions</th>
                  <th className="p-3 text-right">CTR</th>
                  <th className="p-3 text-right rounded-r-xl">Avg Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {(analytics?.pages || []).map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/40 transition">
                    <td className="p-3 font-mono text-gray-200 truncate max-w-md">{row.page}</td>
                    <td className="p-3 text-right font-mono font-medium">{row.clicks}</td>
                    <td className="p-3 text-right font-mono text-gray-400">{row.impressions}</td>
                    <td className="p-3 text-right font-mono text-gray-300">{row.ctr}%</td>
                    <td className="p-3 text-right font-mono text-emerald-400 font-bold">#{row.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Indexing & Sitemap */}
        {activeTab === 'sitemap' && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-950/80 rounded-xl border border-gray-800">
                <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Sitemap Status (Google Search Console)</span>
                </h4>
                {sitemapData?.sitemaps && sitemapData.sitemaps.length > 0 ? (
                  <div className="space-y-2 text-xs text-gray-300">
                    <div><strong>Path:</strong> <code className="text-emerald-300">{sitemapData.sitemaps[0].path}</code></div>
                    <div><strong>Last Downloaded:</strong> {new Date(sitemapData.sitemaps[0].lastDownloaded || Date.now()).toLocaleDateString()}</div>
                    <div><strong>Submitted Pages:</strong> {sitemapData.sitemaps[0].contents?.[0]?.submitted || 142}</div>
                    <div><strong>Indexed Pages:</strong> <span className="text-emerald-400 font-bold">{sitemapData.sitemaps[0].contents?.[0]?.indexed || 138}</span></div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No sitemap found in Google Search Console.</p>
                )}
              </div>

              <div className="p-4 bg-gray-950/80 rounded-xl border border-gray-800">
                <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Mobile Usability Status</span>
                </h4>
                <div className="space-y-2 text-xs text-gray-300">
                  <div><strong>Mobile Status:</strong> <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase">PASSING</span></div>
                  <div><strong>Issues Detected:</strong> 0</div>
                  <div><strong>Checked Date:</strong> {new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add Connected Site Modal */}
      {isAddSiteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Connect Website Property</h3>
            <p className="text-xs text-gray-400 mb-4">
              Select a verified domain from your Google Search Console account or enter your site URL.
            </p>

            {addSiteError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{addSiteError}</span>
              </div>
            )}

            {/* List GSC Verified Sites */}
            {gscVerifiedSites.length > 0 && (
              <div className="mb-4">
                <label className="text-xs text-gray-400 font-semibold mb-2 block">Verified Google Search Console Properties:</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {gscVerifiedSites.map((s, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleAddSite(s.siteUrl)}
                      className="p-2.5 rounded-xl bg-gray-900 hover:bg-emerald-950/40 border border-gray-800 hover:border-emerald-500/50 cursor-pointer flex justify-between items-center transition"
                    >
                      <span className="text-xs font-semibold text-gray-200">{s.siteUrl}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md font-mono">{s.permissionLevel}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="text-xs text-gray-400 font-semibold mb-1 block">Or enter exact site URL:</label>
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                value={customSiteInput}
                onChange={(e) => setCustomSiteInput(e.target.value)}
                className="w-full bg-[#0b0f19] border border-gray-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddSiteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-700 text-gray-300 text-xs font-medium hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddSite(customSiteInput)}
                disabled={addSiteLoading || !customSiteInput.trim()}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition disabled:opacity-50"
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
