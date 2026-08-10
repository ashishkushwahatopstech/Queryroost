import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const ChangelogPage: React.FC = () => {
  const releases = [
    {
      version: 'v2.0.0 — Platform Expansion',
      date: 'August 10, 2026',
      badge: 'LATEST RELEASE',
      features: [
        'Added Minimalist Light Theme with Glassmorphism frosted UI design system.',
        'Added dedicated User Profile Page (/profile) with subscription quota meters.',
        'Added 7 GSC site-level tools: Technical Site Audit Crawler, Google PageSpeed Insights Vitals, Schema Validator, Internal Link Map, and PDF/CSV Exporter.',
        'Added 7 Standalone Public SEO Tools: Robots.txt Tester, Open Graph Previewer, Readability Score Checker, Word Counter, Slug Analyzer, Title Pixel-Width Checker, and Canonical Inspector.',
        'Added Markdown Resource Blog (/blog), Pricing Page (/pricing), Help Base (/help), Changelog (/changelog), Case Study (/how-it-works), and Status Page (/status).',
        'Implemented automatic background Google OAuth token refresh.'
      ]
    },
    {
      version: 'v1.0.0 — Initial Launch',
      date: 'August 8, 2026',
      badge: 'MAJOR LAUNCH',
      features: [
        'Google OAuth 2.0 Single Sign-On and Search Console read-only API integration.',
        'Connected Website Rank Tracking Dashboard (Clicks, Impressions, CTR %, Avg Position).',
        'Interactive Recharts daily search performance trend graphs.',
        'Free Forever vs Premium Pro plan enforcement in Cloudflare D1.',
        'Strict server-side Admin Console (/admin) restricted to ashishkushwaha88643@gmail.com.'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Product Updates & Releases</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Platform Changelog & Roadmap</h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Track reverse-chronological feature updates, improvements, and new tools added to seo.aktechstudio.com.
        </p>
      </div>

      <div className="space-y-6">
        {releases.map((rel, idx) => (
          <div key={idx} className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {rel.badge}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">{rel.version}</h3>
              </div>
              <span className="text-xs text-slate-500 font-semibold">{rel.date}</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700">
              {rel.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
