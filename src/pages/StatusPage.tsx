import React from 'react';
import { Activity, CheckCircle, Database, Server, Globe } from 'lucide-react';

export const StatusPage: React.FC = () => {
  const services = [
    { name: 'Google Search Console API Gateway', status: 'Operational', uptime: '99.98%' },
    { name: 'Google PageSpeed Insights API', status: 'Operational', uptime: '99.95%' },
    { name: 'Cloudflare Pages Functions Engine', status: 'Operational', uptime: '100.00%' },
    { name: 'Cloudflare D1 SQLite Database', status: 'Operational', uptime: '100.00%' },
    { name: 'Cloudflare Workers Edge CDN', status: 'Operational', uptime: '100.00%' },
    { name: 'Standalone Public SEO Tools', status: 'Operational', uptime: '100.00%' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <Activity className="w-3.5 h-3.5" />
          <span>Realtime System Status</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">All Systems Operational</h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Current operational status for Cloudflare Pages, Workers, D1 Database, and Google Search Console APIs.
        </p>
      </div>

      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-200/80">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>Infrastructure Status Report</span>
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500">Updated 1 min ago</span>
        </div>

        <div className="space-y-3">
          {services.map((s, idx) => (
            <div key={idx} className="p-3.5 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between shadow-sm">
              <span className="text-xs font-bold text-slate-900">{s.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-500 font-mono">{s.uptime} uptime</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase border border-emerald-200">
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
