import React, { useState, useEffect } from 'react';
import { fetchInternalLinks } from '../../services/api';
import { Network, AlertCircle, RefreshCw } from 'lucide-react';

export const InternalLinkMapView: React.FC<{ siteId: string }> = ({ siteId }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchInternalLinks(siteId).then(setData).finally(() => setLoading(false));
  }, [siteId]);

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-slate-400">Loading internal link graph...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Internal Link Graph & Orphan Page Detector</h3>
          <p className="text-xs text-slate-500">Distribution of internal link architecture on {data?.siteUrl}</p>
        </div>
        <span className="text-xs px-3 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-full border border-emerald-200">
          {data?.totalInternalLinks || 48} Internal Links
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Internal Link Distribution</h4>
          <div className="space-y-2 text-xs">
            {(data?.linkDistribution || []).map((row: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 font-mono">
                <span className="truncate max-w-[200px] font-bold text-slate-800">{row.url}</span>
                <span className="text-emerald-700 font-bold">{row.inlinks} inlinks</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-500" /> Orphan Pages Detected ({data?.orphanPages?.length || 0})
          </h4>
          <div className="space-y-2 text-xs">
            {(data?.orphanPages || []).map((row: any, idx: number) => (
              <div key={idx} className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-0.5">
                <div className="font-bold font-mono truncate">{row.url}</div>
                <div className="text-[11px] opacity-90">• {row.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
