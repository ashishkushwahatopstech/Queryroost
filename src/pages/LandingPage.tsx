import React, { useState } from 'react';
import { Search, Globe, ShieldCheck, Zap, ArrowRight, Sparkles, CheckCircle2, Crown, Lock, BarChart2 } from 'lucide-react';

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
    <div className="space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Hero Section with Instant Site URL Bar */}
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Site-Centric SEO & Rank Analytics Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Instant Site SEO Audit, Core Web Vitals & Google Rank Tracker
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
          Enter any website URL below to run technical SEO audits, Core Web Vitals performance checks, SERP snippet optimization, and Search Console keyword tracking.
        </p>

        {/* Hero Instant Site URL Input Bar */}
        <form onSubmit={handleAnalyze} className="max-w-xl mx-auto flex items-center gap-2 p-2 glass-card rounded-2xl shadow-xl border border-slate-200/90">
          <div className="flex items-center gap-2 pl-3 flex-1">
            <Globe className="w-5 h-5 text-emerald-600 shrink-0" />
            <input
              type="text"
              placeholder="Enter site URL (e.g. aktechstudio.com)..."
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full text-slate-900 text-sm font-semibold focus:outline-none bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
          >
            <span>Analyze Site</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-500 pt-2">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Free Data Sources</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Google Search Console API</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Google PageSpeed Insights API</span>
        </div>
      </div>

      {/* 5 Site-Focused Tools Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl space-y-3 glass-card-hover">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">1. Full-Site Technical SEO Auditor</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Crawls site HTML for 404 broken links, title/meta tag issues, H1 hierarchy, and image alt attributes with step-by-step code fix guides.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-3 glass-card-hover">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">2. Core Web Vitals & PageSpeed</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Live LCP, CLS, INP, and FCP performance diagnostics powered directly by Google PageSpeed Insights API for Mobile and Desktop.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-3 glass-card-hover">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
            <BarChart2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">3. Search Console Keyword Tracker</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Track real Google keyword rankings (#1-#100), total search clicks, impressions, CTR %, and daily historical trend line charts.
          </p>
        </div>
      </div>

    </div>
  );
};
