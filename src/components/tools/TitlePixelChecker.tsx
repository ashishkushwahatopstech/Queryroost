import React, { useState } from 'react';
import { Eye, AlertTriangle, CheckCircle } from 'lucide-react';

export const TitlePixelChecker: React.FC = () => {
  const [title, setTitle] = useState<string>('SEO Rank Tracking Platform | Google Search Console Analytics Tool by aktechstudio');

  // Approximate pixel width calculation (avg ~9-11px per char for Arial/Roboto 20px SERP font)
  const estimatedPixelWidth = Math.round(title.length * 9.5);
  const maxPixelLimit = 600;
  const isTruncated = estimatedPixelWidth > maxPixelLimit;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Eye className="w-5 h-5 text-emerald-600" />
          <span>Title Tag SERP Pixel-Width Truncation Checker</span>
        </h3>

        <div>
          <label className="text-xs text-slate-500 font-semibold mb-1 block">Meta Title Tag Text:</label>
          <textarea
            rows={4}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full glass-input text-slate-900 text-xs rounded-xl p-3 focus:outline-none"
          />
        </div>

        <div className="p-3 bg-slate-100 rounded-xl border border-slate-200/80 text-xs flex justify-between items-center">
          <span className="text-slate-600">Character Count: <strong>{title.length} chars</strong></span>
          <span className="text-slate-600">Est. Pixel Width: <strong className={isTruncated ? 'text-rose-600 font-extrabold' : 'text-emerald-600 font-extrabold'}>{estimatedPixelWidth}px / 600px</strong></span>
        </div>
      </div>

      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900">Google SERP Desktop Visual Render</h3>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-md space-y-2">
          <div className="text-xs text-[#202124] flex items-center gap-1 font-sans">
            <span>https://seo.aktechstudio.com</span>
          </div>

          {/* Visual SERP Title container capped at 600px */}
          <div className="max-w-[600px] overflow-hidden">
            <h4 className="text-xl text-[#1a0dab] font-normal leading-snug truncate hover:underline cursor-pointer">
              {title}
            </h4>
          </div>

          <p className="text-xs text-[#4d5156] leading-relaxed">
            Google truncates title tags based on total pixel width (approx 600px on desktop, ~540px on mobile). Characters like 'W' or 'M' take up more pixel space than 'i' or 'l'.
          </p>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs ${
          isTruncated ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          {isTruncated ? <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" /> : <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
          <div>
            <div className="font-extrabold">{isTruncated ? 'Title will be truncated by Google (...)' : 'Optimal Title Tag Length'}</div>
            <div className="text-[11px] opacity-90">
              {isTruncated ? `Exceeds 600px container width by approx ${estimatedPixelWidth - maxPixelLimit}px.` : 'Fits comfortably within Google desktop SERP containers.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
