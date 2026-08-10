import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileSpreadsheet, FileText, Lock, Download, Sparkles } from 'lucide-react';

export const PerformanceReportView: React.FC<{ analytics: any }> = ({ analytics }) => {
  const { user, openUpgradeModal } = useAuth();
  const isFree = user?.plan === 'free';

  const handleDownloadCsv = () => {
    if (isFree) {
      openUpgradeModal();
      return;
    }
    const queries = analytics?.queries || [];
    let csvContent = "data:text/csv;charset=utf-8,Query,Clicks,Impressions,CTR,Position\n";
    queries.forEach((q: any) => {
      csvContent += `"${q.query}",${q.clicks},${q.impressions},${q.ctr}%,#${q.position}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `seo_report_${analytics?.siteUrl || 'site'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Auto-Generated Performance Reports</h3>
          <p className="text-xs text-slate-500">Weekly/Monthly Search Console summary export for {analytics?.siteUrl}</p>
        </div>

        {isFree ? (
          <button
            onClick={openUpgradeModal}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Unlock CSV & PDF Exports</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleDownloadCsv}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Report</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Executive Performance Summary</h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold">Total Clicks</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">{analytics?.summary?.totalClicks || 0}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold">Total Impressions</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">{analytics?.summary?.totalImpressions || 0}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold">Average CTR</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">{analytics?.summary?.avgCtr || 0}%</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold">Average Rank Position</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1 font-mono">#{analytics?.summary?.avgPosition || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
