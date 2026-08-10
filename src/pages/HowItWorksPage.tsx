import React from 'react';
import { Globe, BarChart2, ShieldCheck, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Sign In & Authenticate Search Console',
      desc: 'Log in with your Google account via secure OAuth 2.0. We request read-only access (webmasters.readonly) to your Search Console API properties.'
    },
    {
      step: '02',
      title: 'Select Your Verified Domain',
      desc: 'Our backend queries Google Search Console to confirm your website ownership. Select your site from the verified domain property list.'
    },
    {
      step: '03',
      title: 'View Real Keyword Rankings & CTR',
      desc: 'Instantly view your search queries, average rank position (#1-#100), total clicks, impressions, and daily trend line charts.'
    },
    {
      step: '04',
      title: 'Run Technical Audits & Fix Issues',
      desc: 'Run technical site audits, Core Web Vitals checks, schema shape audits, and fix broken 404 links to boost rankings.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <Globe className="w-3.5 h-3.5" />
          <span>Interactive Case Study & Workflow</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">How It Works</h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          See how seo.aktechstudio.com transforms raw Google Search Console API data into actionable rank insights.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {steps.map((s, idx) => (
          <div key={idx} className="glass-card p-6 rounded-3xl space-y-3 relative overflow-hidden">
            <span className="text-4xl font-extrabold text-emerald-600/20 font-mono absolute top-4 right-6">{s.step}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-xs">
              {s.step}
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">{s.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Case Study Box */}
      <div className="glass-card p-8 rounded-3xl space-y-4 border-emerald-200 bg-gradient-to-r from-emerald-50/40 via-white to-white">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
          <TrendingUp className="w-4 h-4" />
          <span>REALISTIC CASE STUDY WALKTHROUGH</span>
        </div>
        <h3 className="text-xl font-extrabold text-slate-900">How Example Domain Improved Rankings by +3.4 Positions in 30 Days</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          In this example walkthrough, a blog owner connected their site, identified 5 "striking distance" keywords ranking between position #11-#14, updated their title tags to include primary search terms, fixed 2 broken internal links, and moved into top 5 positions!
        </p>

        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          <span>Try It Now on Your Site</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
