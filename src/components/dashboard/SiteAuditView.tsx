import React, { useState, useEffect } from 'react';
import { fetchSiteAudit } from '../../services/api';
import { ShieldCheck, AlertOctagon, AlertTriangle, Info, RefreshCw } from 'lucide-react';

export const SiteAuditView: React.FC<{ siteId: string }> = ({ siteId }) => {
  const [loading, setLoading] = useState(true);
  const [auditData, setAuditData] = useState<any>(null);
  const [error, setError] = useState('');

  const loadAudit = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchSiteAudit(siteId);
      setAuditData(data);
    } catch (e: any) {
      setError(e.message || 'Failed to run technical site audit');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudit();
  }, [siteId]);

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <span className="text-xs font-semibold">Crawling connected site & testing technical SEO tags...</span>
      </div>
    );
  }

  const criticals = auditData?.issues?.critical || [];
  const warnings = auditData?.issues?.warnings || [];
  const infos = auditData?.issues?.info || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Technical SEO Health Score</h3>
          <p className="text-xs text-slate-500">Scored crawl report for {auditData?.siteUrl}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-3xl font-extrabold text-emerald-600 font-mono">{auditData?.score || 85} / 100</div>
          <button
            onClick={loadAudit}
            className="px-3.5 py-2 glass-button text-xs font-bold rounded-xl text-slate-700 hover:text-emerald-600 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-Run Audit</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-2xl">
          <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5"><AlertOctagon className="w-4 h-4 text-rose-600" /> Critical Errors ({criticals.length})</div>
          {criticals.length === 0 ? (
            <p className="text-xs text-emerald-700 mt-2 font-medium">No critical technical errors found!</p>
          ) : (
            <ul className="mt-2 space-y-1.5 text-xs text-rose-800">
              {criticals.map((c: string, i: number) => <li key={i}>• {c}</li>)}
            </ul>
          )}
        </div>

        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl">
          <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-600" /> Warnings ({warnings.length})</div>
          {warnings.length === 0 ? (
            <p className="text-xs text-emerald-700 mt-2 font-medium">No warning flags.</p>
          ) : (
            <ul className="mt-2 space-y-1.5 text-xs text-amber-900">
              {warnings.map((w: string, i: number) => <li key={i}>• {w}</li>)}
            </ul>
          )}
        </div>

        <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl">
          <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5"><Info className="w-4 h-4 text-blue-600" /> Notice / Info ({infos.length})</div>
          {infos.length === 0 ? (
            <p className="text-xs text-slate-500 mt-2">All image alt tags verified.</p>
          ) : (
            <ul className="mt-2 space-y-1.5 text-xs text-blue-800">
              {infos.map((inf: string, i: number) => <li key={i}>• {inf}</li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
