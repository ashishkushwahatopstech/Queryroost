import React, { useState } from 'react';
import { Search, Globe, ShieldCheck, Zap, ArrowRight, Sparkles, CheckCircle2, Crown, Lock, BarChart2, Check, X } from 'lucide-react';

interface LandingPageProps {
  onGoToDashboard: (url?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToDashboard }) => {
  const [inputUrl, setInputUrl] = useState<string>('aktechstudio.com');

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    let formatted = inputUrl.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = `https://${formatted}`;
    }
    onGoToDashboard(formatted);
  };

  return (
    <div className="space-y-20 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Vercel-Grade Hero Section */}
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fafafa] border border-[#ebebeb] text-[#171717] text-xs font-mono font-medium shadow-sm">
          <span className="w-2 h-2 rounded-full gradient-develop inline-block"></span>
          <span>QUERYROOST v2.0 — FIRST-PARTY GOOGLE RANK ANALYTICS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#171717] tracking-tight leading-[1.08]">
          First-Party Google Rank Tracker & Technical SEO Auditor
        </h1>

        <p className="text-[#4d4d4d] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
          Zero-estimate search analytics. Queryroost connects directly to Google Search Console & PageSpeed APIs to deliver 100% accurate keyword rankings, Core Web Vitals, and technical audits.
        </p>

        {/* Hero Instant Site URL Bar */}
        <form onSubmit={handleAnalyze} className="max-w-xl mx-auto flex items-center gap-2 p-2 bg-white border border-[#ebebeb] rounded-v-lg shadow-sm hover:border-[#171717] transition-all">
          <div className="flex items-center gap-2 pl-3 flex-1">
            <Globe className="w-4 h-4 text-[#888888] shrink-0" aria-hidden="true" />
            <input
              type="text"
              placeholder="Enter domain URL (e.g. aktechstudio.com)…"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full text-[#171717] text-sm font-medium focus:outline-none bg-transparent"
              aria-label="Website Domain Input"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#171717] hover:bg-[#333333] text-white font-medium text-xs sm:text-sm rounded-v-sm shadow-sm transition flex items-center gap-2 shrink-0 focus-visible:ring-2 focus-visible:ring-[#171717]"
          >
            <span>Analyze Site</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-[#888888] pt-2">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#171717]" /> 100% Direct Google APIs</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#171717]" /> Zero Subscription Walls</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#171717]" /> Step-by-Step Code Fixes</span>
        </div>
      </div>

      {/* Queryroost vs Ahrefs & Semrush Comparison Matrix Table */}
      <div className="max-w-5xl mx-auto vercel-card p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono text-[#888888] uppercase tracking-wider font-semibold">Competitive Breakdown</span>
          <h2 className="text-2xl font-extrabold text-[#171717]">Why Queryroost Outperforms Legacy SEO Tools</h2>
          <p className="text-xs text-[#4d4d4d]">Compare Queryroost against traditional paid estimation platforms.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fafafa] border-b border-[#ebebeb] text-[#888888] uppercase font-mono font-medium text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-v-sm">Feature / Metric</th>
                <th className="p-3.5 text-center bg-[#171717]/5 text-[#171717] font-bold">Queryroost</th>
                <th className="p-3.5 text-center">Ahrefs</th>
                <th className="p-3.5 text-center rounded-r-v-sm">Semrush</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebebeb] text-[#171717]">
              <tr>
                <td className="p-3.5 font-semibold">Keyword Data Accuracy</td>
                <td className="p-3.5 text-center bg-[#171717]/5 font-bold text-[#0070f3]">100% Direct Google GSC Data</td>
                <td className="p-3.5 text-center text-[#888888]">Estimated Third-Party Scrapes</td>
                <td className="p-3.5 text-center text-[#888888]">Estimated Third-Party Scrapes</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">Monthly Subscription Barrier</td>
                <td className="p-3.5 text-center bg-[#171717]/5 font-bold text-[#0070f3]">Free Instant URL Analysis</td>
                <td className="p-3.5 text-center text-rose-600 font-mono">$129 – $499/mo</td>
                <td className="p-3.5 text-center text-rose-600 font-mono">$139 – $499/mo</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">Technical Fix Guidance</td>
                <td className="p-3.5 text-center bg-[#171717]/5 font-bold text-[#0070f3]">Copyable HTML/JSON Code Fixes</td>
                <td className="p-3.5 text-center text-[#888888]">Raw Error Counts Only</td>
                <td className="p-3.5 text-center text-[#888888]">Basic Advice Text</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">Striking-Distance Page 2 Keywords</td>
                <td className="p-3.5 text-center bg-[#171717]/5 font-bold text-[#0070f3]">Automated Pos #11–#20 Finder</td>
                <td className="p-3.5 text-center text-[#888888]">Manual Filter Setup</td>
                <td className="p-3.5 text-center text-[#888888]">Manual Filter Setup</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">Page Load Speed & DX</td>
                <td className="p-3.5 text-center bg-[#171717]/5 font-bold text-[#0070f3] font-mono">&lt; 200ms Instant Vercel DX</td>
                <td className="p-3.5 text-center text-[#888888]">Heavy Dashboard Load</td>
                <td className="p-3.5 text-center text-[#888888]">Heavy Dashboard Load</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
