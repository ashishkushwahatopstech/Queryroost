import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full glass-nav border-t border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">seo.aktechstudio.com</span>
            <span className="text-xs text-slate-500">• Part of the AK Tech Studio Ecosystem</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Free Google Search Console rank tracker, PageSpeed Insights auditor, & technical SEO analytics platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
          <a href="/pricing" className="hover:text-emerald-600 transition">Pricing</a>
          <span>•</span>
          <a href="/blog" className="hover:text-emerald-600 transition">Blog</a>
          <span>•</span>
          <a href="/how-it-works" className="hover:text-emerald-600 transition">How It Works</a>
          <span>•</span>
          <a href="/help" className="hover:text-emerald-600 transition">Help & FAQ</a>
          <span>•</span>
          <a href="/changelog" className="hover:text-emerald-600 transition">Changelog</a>
          <span>•</span>
          <a href="/status" className="hover:text-emerald-600 transition">Status</a>
        </div>
      </div>
    </footer>
  );
};
