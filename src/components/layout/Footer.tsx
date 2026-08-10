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
            Free Google Search Console rank tracker and SEO analytics platform. Built with Cloudflare Pages, Workers, D1 database & Google Search Console API.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <a href="https://aktechstudio.com" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition">aktechstudio.com</a>
          <span>•</span>
          <a href="https://tool.aktechstudio.com" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition">tool.aktechstudio.com</a>
          <span>•</span>
          <a href="https://gallery.aktechstudio.com" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition">gallery.aktechstudio.com</a>
        </div>
      </div>
    </footer>
  );
};
