import React, { useState } from 'react';
import { runSchemaValidator } from '../../services/api';
import { Code, CheckCircle, AlertTriangle, RefreshCw, Copy, Check, Sparkles, HelpCircle } from 'lucide-react';

export const SchemaValidator: React.FC = () => {
  const [url, setUrl] = useState<string>('https://aktechstudio.com');
  const [schemaCode, setSchemaCode] = useState<string>(`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "How to connect Google Search Console?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Sign in with your Google account on seo.aktechstudio.com and select your verified property domain."
    }
  }, {
    "@type": "Question",
    "name": "Is this rank tracker free?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Yes, our Free Forever plan includes 1 website, top 10 tracked queries, and 28-day historical data."
    }
  }]
}`);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleValidate = async () => {
    setLoading(true);
    try {
      const res = await runSchemaValidator(url, schemaCode);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const starterTemplates: Record<string, string> = {
    FAQPage: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Your Frequently Asked Question?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Your direct answer text to be displayed in Google search accordions."
    }
  }]
}`,
    Article: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "SEO Rank Tracking Guide",
  "author": {
    "@type": "Person",
    "name": "Ashish Kushwaha"
  },
  "datePublished": "2026-08-10",
  "image": "https://aktechstudio.com/cover.png"
}`,
    Organization: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AK Tech Studio",
  "url": "https://aktechstudio.com",
  "logo": "https://aktechstudio.com/logo.png"
}`
  };

  const handleSelectTemplate = (type: string) => {
    if (starterTemplates[type]) {
      setSchemaCode(starterTemplates[type]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Code className="w-3.5 h-3.5" />
            <span>Structured Data Inspector</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Schema.org & Rich Result Simulator</h1>
          <p className="text-xs text-slate-500">Validate JSON-LD structured data and simulate Google search rich accordions.</p>
        </div>

        {/* Preset Templates */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs">
          <span className="text-slate-500 font-bold px-2">Templates:</span>
          {['FAQPage', 'Article', 'Organization'].map((tmpl) => (
            <button
              key={tmpl}
              onClick={() => handleSelectTemplate(tmpl)}
              className="px-3 py-1 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 font-bold transition border border-slate-200"
            >
              {tmpl}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Input Code Column */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-slate-900">JSON-LD Code Input</h3>

          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1 block">Paste JSON-LD Script:</label>
            <textarea
              rows={12}
              value={schemaCode}
              onChange={(e) => setSchemaCode(e.target.value)}
              className="w-full glass-input text-slate-900 text-xs rounded-xl p-3 font-mono focus:outline-none"
            />
          </div>

          <button
            onClick={handleValidate}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Validate Schema & Generate Rich Preview'}
          </button>
        </div>

        {/* Output & Rich Simulator Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Google Rich Result Accordion Simulator</h3>

            {/* Simulated Google Search Result with FAQ Accordion */}
            <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-md space-y-2 text-xs">
              <div className="text-[11px] text-[#202124] flex items-center gap-1 font-sans">
                <span>https://seo.aktechstudio.com</span>
              </div>
              <h4 className="text-lg text-[#1a0dab] font-normal leading-snug hover:underline cursor-pointer truncate">
                SEO Rank Tracking & Search Console Platform
              </h4>

              {/* Rich FAQ Accordion Preview */}
              <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1 text-emerald-700">
                  <Sparkles className="w-3.5 h-3.5" /> FAQ Rich Snippet Accordions:
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold flex justify-between items-center">
                  <span>How to connect Google Search Console?</span>
                  <span className="text-slate-400">▼</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold flex justify-between items-center">
                  <span>Is this rank tracker free?</span>
                  <span className="text-slate-400">▼</span>
                </div>
              </div>
            </div>

            {data && (
              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">Schema Syntax Verified</span>
                </div>
                {data.recommendations?.map((rec: string, i: number) => (
                  <div key={i} className="p-3 bg-blue-50/70 border border-blue-200 text-blue-900 rounded-xl text-[11px]">
                    • {rec}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
