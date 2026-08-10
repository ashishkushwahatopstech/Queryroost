import React, { useState } from 'react';
import { fetchPageSpeed } from '../../services/api';
import { Zap, Smartphone, Monitor, RefreshCw, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const PageSpeedInspector: React.FC = () => {
  const [url, setUrl] = useState<string>('https://aktechstudio.com');
  const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('mobile');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  const handleRunInspector = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetchPageSpeed(url, strategy);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Zap className="w-3.5 h-3.5" />
            <span>Google PageSpeed Insights API</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Core Web Vitals & PageSpeed Inspector</h1>
          <p className="text-xs text-slate-500">Test LCP, CLS, INP, and FCP performance scores directly from Google's Lighthouse engine.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
            <button
              onClick={() => setStrategy('mobile')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 ${
                strategy === 'mobile' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
            <button
              onClick={() => setStrategy('desktop')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 ${
                strategy === 'desktop' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </button>
          </div>

          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="glass-input text-slate-900 text-xs rounded-xl px-3 py-2 w-64 focus:outline-none"
          />

          <button
            onClick={handleRunInspector}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Run Vitals Test'}
          </button>
        </div>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Main Scorecard */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-5 glass-card rounded-3xl text-center">
              <div className="text-xs text-slate-500 font-bold uppercase">Performance Score</div>
              <div className="text-4xl font-extrabold text-emerald-600 mt-2 font-mono">{data.score} / 100</div>
            </div>

            <div className="p-5 glass-card rounded-3xl text-center">
              <div className="text-xs text-slate-500 font-bold uppercase">LCP (Largest Paint)</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">{data.metrics.lcp}</div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase mt-1 inline-block">
                GOOD (&lt; 2.5s)
              </span>
            </div>

            <div className="p-5 glass-card rounded-3xl text-center">
              <div className="text-xs text-slate-500 font-bold uppercase">CLS (Layout Shift)</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">{data.metrics.cls}</div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase mt-1 inline-block">
                GOOD (&lt; 0.1)
              </span>
            </div>

            <div className="p-5 glass-card rounded-3xl text-center">
              <div className="text-xs text-slate-500 font-bold uppercase">INP / FID Responsiveness</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-2 font-mono">{data.metrics.inp}</div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase mt-1 inline-block">
                GOOD (&lt; 200ms)
              </span>
            </div>
          </div>

          {/* Actionable Core Web Vitals Fix Recommendations */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Optimization Opportunities & Action Plan</h3>

            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-sm">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Image Optimization (LCP)
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Serve images in modern WebP or AVIF formats and add explicit width/height attributes to prevent layout shifts.
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-sm">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Render-Blocking Scripts
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Defer non-critical JavaScript using <code className="font-mono bg-slate-100 px-1">defer</code> or <code className="font-mono bg-slate-100 px-1">async</code> attributes to speed up FCP rendering.
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-sm">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Font Display Swap (CLS)
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Add <code className="font-mono bg-slate-100 px-1">font-display: swap</code> in CSS to avoid Invisible Text Flash during custom font loading.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
