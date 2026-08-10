import React, { useState } from 'react';
import { fetchPageSpeed } from '../../services/api';
import { Zap, Smartphone, Monitor, RefreshCw } from 'lucide-react';

export const PageSpeedView: React.FC<{ siteUrl: string }> = ({ siteUrl }) => {
  const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('mobile');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const runCheck = async () => {
    setLoading(true);
    try {
      const res = await fetchPageSpeed(siteUrl || 'https://aktechstudio.com', strategy);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Google PageSpeed & Core Web Vitals</h3>
          <p className="text-xs text-slate-500">Live test powered by Google PageSpeed Insights API</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setStrategy('mobile')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 ${
                strategy === 'mobile' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
            <button
              onClick={() => setStrategy('desktop')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 ${
                strategy === 'desktop' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </button>
          </div>

          <button
            onClick={runCheck}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Run Vitals Audit'}
          </button>
        </div>
      </div>

      {data ? (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
            <div className="text-[11px] text-slate-500 font-bold uppercase">Performance Score</div>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1 font-mono">{data.score} / 100</div>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
            <div className="text-[11px] text-slate-500 font-bold uppercase">LCP (Largest Contentful)</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">{data.metrics.lcp}</div>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
            <div className="text-[11px] text-slate-500 font-bold uppercase">CLS (Layout Shift)</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">{data.metrics.cls}</div>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
            <div className="text-[11px] text-slate-500 font-bold uppercase">INP / FID Latency</div>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1 font-mono">{data.metrics.inp}</div>
          </div>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-2xl">
          Click "Run Vitals Audit" to fetch live Core Web Vitals scores from Google.
        </div>
      )}
    </div>
  );
};
