import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Zap, ArrowRight, Sparkles, Layers, Globe, MousePointerClick, TrendingUp, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onGoToDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToDashboard }) => {
  const { user, openUpgradeModal } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-cyan-400/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real Google Search Console Analytics • Free Tier Included</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Track Real Search Rankings <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Directly From Google Search Console
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Turn your raw Google Search Console data into actionable rank tracking dashboards. View search query positions, click trends, CTR, and indexing health — completely free with zero API costs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            {user ? (
              <button
                onClick={onGoToDashboard}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-base shadow-xl shadow-emerald-500/25 transition flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>Go to Rank Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <a
                href="/api/auth/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-base shadow-xl shadow-emerald-500/25 transition flex items-center justify-center gap-3 transform hover:-translate-y-0.5"
              >
                <Globe className="w-5 h-5" />
                <span>Connect Google Search Console</span>
              </a>
            )}

            <button
              onClick={openUpgradeModal}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl glass-button text-slate-700 font-semibold text-base transition flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 text-emerald-600 fill-emerald-600" />
              <span>Explore Premium Features</span>
            </button>
          </div>

          {/* Feature Badge Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-200/80 text-left">
            <div className="glass-card p-3.5 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">OAuth Verified</div>
                <div className="text-[11px] text-slate-500">Owner-only access</div>
              </div>
            </div>

            <div className="glass-card p-3.5 rounded-2xl flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">16-Mo History</div>
                <div className="text-[11px] text-slate-500">Position trends</div>
              </div>
            </div>

            <div className="glass-card p-3.5 rounded-2xl flex items-center gap-3">
              <MousePointerClick className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">CTR & Clicks</div>
                <div className="text-[11px] text-slate-500">Query-level metrics</div>
              </div>
            </div>

            <div className="glass-card p-3.5 rounded-2xl flex items-center gap-3">
              <Layers className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">Serverless Speed</div>
                <div className="text-[11px] text-slate-500">Cloudflare D1 backend</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Demo Dashboard Preview Card */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="glass-card rounded-3xl p-6 shadow-xl overflow-hidden group">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs text-slate-500 font-mono ml-2">seo.aktechstudio.com/dashboard/demo</span>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">Live Preview</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-white/90 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="text-xs text-slate-500 font-medium">Total Clicks</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">1,248</div>
              <div className="text-[11px] text-emerald-600 mt-1 font-semibold">↑ +14.2% vs last period</div>
            </div>
            <div className="p-4 bg-white/90 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="text-xs text-slate-500 font-medium">Total Impressions</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">18,420</div>
              <div className="text-[11px] text-emerald-600 mt-1 font-semibold">↑ +8.5% vs last period</div>
            </div>
            <div className="p-4 bg-white/90 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="text-xs text-slate-500 font-medium">Average CTR</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">6.77%</div>
              <div className="text-[11px] text-emerald-600 mt-1 font-semibold">↑ +0.6% vs last period</div>
            </div>
            <div className="p-4 bg-white/90 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="text-xs text-slate-500 font-medium">Avg Position</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">#3.4</div>
              <div className="text-[11px] text-slate-500 mt-1">Top 3 Rankings</div>
            </div>
          </div>

          <div className="bg-white/90 rounded-2xl border border-slate-200/80 p-4 shadow-sm">
            <div className="text-xs font-bold text-slate-800 mb-3 flex justify-between">
              <span>Top Tracked Search Queries</span>
              <span className="text-emerald-600 font-mono text-[11px]">Realtime Google Search Console Sync</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-12 font-semibold text-slate-500 px-3 py-1.5 bg-slate-100/60 rounded-xl">
                <span className="col-span-5">Query</span>
                <span className="col-span-2 text-right">Clicks</span>
                <span className="col-span-2 text-right">Impressions</span>
                <span className="col-span-1 text-right">CTR</span>
                <span className="col-span-2 text-right">Position</span>
              </div>
              {[
                { q: 'seo rank tracker free', c: 245, i: 3420, ctr: '7.16%', pos: '#2.3' },
                { q: 'google search console analytics tool', c: 189, i: 2150, ctr: '8.79%', pos: '#1.8' },
                { q: 'aktechstudio tools', c: 142, i: 1890, ctr: '7.51%', pos: '#1.2' },
                { q: 'free keyword position tracking', c: 98, i: 1650, ctr: '5.94%', pos: '#4.1' },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 px-3 py-2 bg-slate-50/50 rounded-xl text-slate-800 border border-slate-200/60">
                  <span className="col-span-5 font-bold text-emerald-700">{row.q}</span>
                  <span className="col-span-2 text-right font-mono">{row.c}</span>
                  <span className="col-span-2 text-right font-mono text-slate-500">{row.i}</span>
                  <span className="col-span-1 text-right font-mono text-slate-700">{row.ctr}</span>
                  <span className="col-span-2 text-right font-mono text-emerald-600 font-bold">{row.pos}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Free vs Premium Tiers */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Transparent Feature Plans</h2>
        <p className="text-slate-600 text-sm mb-10 max-w-xl mx-auto">
          Start with our generous free tier, or upgrade for unthrottled search console data history and multi-site analytics.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {/* Free Tier */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">Free Forever</h3>
                <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold">$0 / mo</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Perfect for personal blog owners & single site Webmasters.</p>

              <ul className="space-y-3 text-xs text-slate-700 mb-8">
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Max 1 Connected Website</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Top 10 Tracked Queries Visible</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 28-Day Data History</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 3 Daily Standalone Tool Runs</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Real Google Search Console OAuth Sync</li>
              </ul>
            </div>

            <a
              href="/api/auth/login"
              className="w-full py-3 rounded-2xl glass-button text-slate-800 text-xs font-bold text-center transition block hover:bg-slate-100"
            >
              Get Started Free
            </a>
          </div>

          {/* Premium Tier */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-xl border-emerald-300 bg-gradient-to-b from-emerald-50/40 to-white">
            <div className="absolute -top-3.5 right-6 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-extrabold uppercase rounded-full shadow">
              PRO UNLOCKED
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600 fill-emerald-600" /> Premium Pro
                </h3>
                <span className="text-sm font-bold text-emerald-700">$0 / Test Stub</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Designed for agencies, SEO consultants, and multi-domain owners.</p>

              <ul className="space-y-3 text-xs text-slate-800 mb-8">
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited Connected Websites</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Full Keyword Rankings List (500+)</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Full 16-Month Historical Analytics</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited Standalone Tool Runs</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Exportable PDF & CSV Reports</li>
              </ul>
            </div>

            <button
              onClick={openUpgradeModal}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold text-center transition shadow-md shadow-emerald-500/20"
            >
              Upgrade to Premium Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
