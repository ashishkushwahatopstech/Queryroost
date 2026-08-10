import React, { useState } from 'react';
import { Eye, Smartphone, Monitor, Sparkles, Copy, Check, AlertTriangle, Share2, ArrowRight } from 'lucide-react';

export const MetaOptimizer: React.FC = () => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [url, setUrl] = useState<string>('https://aktechstudio.com/seo-tracker');
  const [title, setTitle] = useState<string>('SEO Rank Tracking Platform | Google Search Console Analytics');
  const [description, setDescription] = useState<string>('Track real search query rankings, average positions, clicks, and CTR directly from Google Search Console with zero API costs.');
  const [copied, setCopied] = useState<boolean>(false);

  // Pixel width & character count metrics
  const charCount = title.length;
  const pixelWidth = Math.round(charCount * 9.5);
  const maxPixels = device === 'desktop' ? 600 : 540;
  const isTitleTruncated = pixelWidth > maxPixels;

  const descCharCount = description.length;
  const isDescTruncated = descCharCount > 160;

  // CTR Opportunity Score Algorithm
  let ctrScore = 70;
  const ctrTips: string[] = [];

  if (/\d+/.test(title)) ctrScore += 10;
  else ctrTips.push('Add a specific number (e.g. "Top 10", "2026") to increase click-through rate by up to +15%');

  if (/(free|best|platform|tool|guide|fast|easy|ultimate)/i.test(title)) ctrScore += 10;
  else ctrTips.push('Include a search intent modifier (e.g. "Free", "Best", "Guide")');

  if (/\||-|:/.test(title)) ctrScore += 10;
  else ctrTips.push('Add your brand name at the end separated by a pipe (|) or dash (-)');

  if (charCount >= 50 && charCount <= 60) ctrScore += 10;
  else ctrTips.push('Keep title tag length between 50 and 60 characters for optimal visibility');

  const finalCtrScore = Math.min(100, ctrScore);

  const generatedHtml = `<title>${title}</title>
<meta name="description" content="${description}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${url}" />
<meta name="twitter:card" content="summary_large_image" />`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deep-Dive SEO Optimizer</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Google SERP & Meta Snippet Optimizer</h1>
          <p className="text-xs text-slate-500">Live visual SERP simulator with pixel truncation gauge, CTR scoring, and 1-click HTML tag generator.</p>
        </div>

        {/* Desktop vs Mobile Toggle */}
        <div className="flex bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 text-xs self-start md:self-auto">
          <button
            onClick={() => setDevice('desktop')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${
              device === 'desktop' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-4 h-4 text-emerald-600" /> Desktop SERP
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${
              device === 'mobile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" /> Mobile SERP
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Inputs & Gauges (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-600" />
            <span>Snippet Content & Parameters</span>
          </h3>

          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1 block">Target Web Page URL:</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full glass-input text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-slate-500 font-semibold">Page Meta Title Tag:</label>
              <span className={`text-[11px] font-mono font-bold ${isTitleTruncated ? 'text-rose-600' : 'text-emerald-600'}`}>
                {charCount} / 60 chars ({pixelWidth}px / {maxPixels}px)
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full glass-input text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
            />
            {/* Visual Pixel-Width Gauge Progress Bar */}
            <div className="w-full bg-slate-200/80 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isTitleTruncated ? 'bg-rose-500' : pixelWidth > maxPixels * 0.85 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (pixelWidth / maxPixels) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-slate-500 font-semibold">Page Meta Description Tag:</label>
              <span className={`text-[11px] font-mono font-bold ${isDescTruncated ? 'text-rose-600' : 'text-emerald-600'}`}>
                {descCharCount} / 160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full glass-input text-slate-900 text-xs rounded-xl p-3 focus:outline-none"
            />
          </div>

          {/* CTR Opportunity Advisor */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Estimated SERP CTR Score
              </span>
              <span className="text-base font-extrabold text-emerald-700 font-mono">{finalCtrScore} / 100</span>
            </div>
            {ctrTips.length > 0 && (
              <div className="space-y-1 text-slate-700 pt-1 border-t border-emerald-200/80">
                <strong className="block text-[11px] uppercase tracking-wider text-emerald-800">CTR Optimization Suggestions:</strong>
                {ctrTips.map((tip, i) => (
                  <div key={i} className="text-[11px]">• {tip}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right SERP Visual Simulator & Generator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Visual SERP Simulator Box */}
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Live Google SERP Render</h3>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {device} Mode
              </span>
            </div>

            <div className={`p-4 bg-white border border-slate-200/90 rounded-2xl shadow-md space-y-1 ${
              device === 'mobile' ? 'max-w-xs mx-auto border-emerald-300' : ''
            }`}>
              <div className="text-[11px] text-[#202124] flex items-center gap-1.5 font-sans truncate">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">S</span>
                <span>{url.replace(/^https?:\/\//, '')}</span>
              </div>
              <h4 className="text-lg text-[#1a0dab] font-normal leading-snug truncate hover:underline cursor-pointer">
                {title || 'Your Page Title Here'}
              </h4>
              <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                {description || 'Your page description snippet will appear here in Google search results.'}
              </p>
            </div>

            {isTitleTruncated && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Title tag exceeds Google's {maxPixels}px visual container limit. Google will truncate this with <strong>...</strong></span>
              </div>
            )}
          </div>

          {/* Copyable HTML Tags Block */}
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Ready-to-Paste HTML Meta Tags</h3>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
              {generatedHtml}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};
