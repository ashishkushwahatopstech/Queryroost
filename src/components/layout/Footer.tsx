import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#ffffff] border-t border-[#ebebeb] py-8 px-4 sm:px-6 lg:px-8 mt-auto font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#171717] text-sm tracking-tight">Queryroost</span>
            <span className="text-xs text-[#888888] font-mono">• https://seo.aktechstudio.com/</span>
          </div>
          <p className="text-xs text-[#888888] mt-1">
            First-party Google Search Console rank tracker, Core Web Vitals diagnostics, & technical SEO auditor.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#4d4d4d]">
          <a href="/pricing" className="hover:text-[#171717] transition">Pricing</a>
          <span>•</span>
          <a href="/blog" className="hover:text-[#171717] transition">Blog</a>
          <span>•</span>
          <a href="/how-it-works" className="hover:text-[#171717] transition">How It Works</a>
          <span>•</span>
          <a href="/help" className="hover:text-[#171717] transition">Help & FAQ</a>
          <span>•</span>
          <a href="/changelog" className="hover:text-[#171717] transition">Changelog</a>
          <span>•</span>
          <a href="/status" className="hover:text-[#171717] transition">Status</a>
        </div>
      </div>
    </footer>
  );
};
