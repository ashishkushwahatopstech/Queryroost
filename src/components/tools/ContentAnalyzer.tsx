import { useState } from 'react';
import { BarChart3, CheckCircle, Info } from 'lucide-react';

export const ContentAnalyzer: React.FC = () => {
  const [text, setText] = useState<string>(`Search engine optimization (SEO) is the process of improving the quality and quantity of website traffic to a website or a web page from search engines. SEO targets unpaid traffic rather than direct traffic or paid traffic.`);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
  const avgSentenceLength = sentences > 0 ? +(words / sentences).toFixed(1) : 0;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          <span>Word Count & Content Length Analyzer</span>
        </h3>

        <div>
          <label className="text-xs text-slate-500 font-semibold mb-1 block">Article / Body Text:</label>
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full glass-input text-slate-900 text-xs rounded-xl p-3 focus:outline-none font-mono"
            placeholder="Paste text here to inspect word count, sentence length, and competitive benchmarks..."
          />
        </div>
      </div>

      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900">Content Metrics & SERP Benchmarks</h3>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="text-[11px] text-slate-500 font-semibold">Total Word Count</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">{words}</div>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="text-[11px] text-slate-500 font-semibold">Character Count</div>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1 font-mono">{chars}</div>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="text-[11px] text-slate-500 font-semibold">Sentence Count</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">{sentences}</div>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="text-[11px] text-slate-500 font-semibold">Avg Words / Sentence</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">{avgSentenceLength}</div>
          </div>
        </div>

        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2 text-xs text-emerald-900">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>SERP Competitive Benchmarks:</span>
          </div>
          <ul className="space-y-1 text-slate-700">
            <li>• <strong>Short Guides / Product Pages:</strong> 500 – 1,000 words</li>
            <li>• <strong>Standard Blog Posts:</strong> 1,200 – 1,800 words</li>
            <li>• <strong>Pillar / Long-Form Articles:</strong> 2,200+ words</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
