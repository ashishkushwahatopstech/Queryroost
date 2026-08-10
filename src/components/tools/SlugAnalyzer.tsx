import { useState } from 'react';
import { Link2, AlertTriangle, CheckCircle } from 'lucide-react';

export const SlugAnalyzer: React.FC = () => {
  const [slug, setSlug] = useState<string>('https://aktechstudio.com/blog/How-To_Connect_Google_Search_Console_and_Get_Started!');
  const [result, setResult] = useState<any>(null);

  const handleAnalyzeSlug = () => {
    if (!slug.trim()) return;

    let path = slug;
    try {
      path = new URL(slug).pathname;
    } catch (e) {
      path = slug;
    }

    const cleanSlug = path.split('/').filter(Boolean).pop() || path;
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (/[A-Z]/.test(cleanSlug)) {
      issues.push('Contains uppercase letters (Google treats URLs case-sensitively)');
    }
    if (/_/.test(cleanSlug)) {
      issues.push('Uses underscores (_) instead of hyphens (-) (Google recommends hyphens for word separation)');
    }
    if (cleanSlug.length > 70) {
      issues.push(`Slug is too long (${cleanSlug.length} chars, ideal max: 50-60 chars)`);
    }
    if (/[^a-z0-9-]/i.test(cleanSlug.replace(/_/g, ''))) {
      issues.push('Contains special or non-ASCII characters');
    }

    const stopWords = ['and', 'the', 'in', 'on', 'at', 'to', 'for', 'a', 'an', 'of'];
    const foundStopWords = stopWords.filter(sw => new RegExp(`\\b${sw}\\b`, 'i').test(cleanSlug.replace(/[-_]/g, ' ')));
    if (foundStopWords.length > 0) {
      recommendations.push(`Consider removing stop words (${foundStopWords.join(', ')}) to keep slug concise`);
    }

    const suggestedSlug = cleanSlug.toLowerCase()
      .replace(/_/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');

    setResult({
      cleanSlug,
      suggestedSlug,
      issues,
      recommendations
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-emerald-600" />
          <span>URL Slug Structure Analyzer</span>
        </h3>

        <div>
          <label className="text-xs text-slate-500 font-semibold mb-1 block">URL Slug or Full URL:</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full glass-input text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
          />
        </div>

        <button
          onClick={handleAnalyzeSlug}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          Analyze Slug Best Practices
        </button>
      </div>

      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900">Slug Audit Results</h3>

        {result ? (
          <div className="space-y-4 text-xs">
            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
              result.issues.length === 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {result.issues.length === 0 ? <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />}
              <div>
                <div className="font-extrabold text-sm">{result.issues.length === 0 ? 'Optimal Slug Structure' : `${result.issues.length} Optimization Issues Found`}</div>
                <div className="text-[11px] opacity-90">Inspected slug: <code className="font-mono font-bold">{result.cleanSlug}</code></div>
              </div>
            </div>

            {result.issues.length > 0 && (
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-rose-700 space-y-1">
                <strong className="block text-slate-900">Issues Detected:</strong>
                {result.issues.map((iss: string, i: number) => (
                  <div key={i}>• {iss}</div>
                ))}
              </div>
            )}

            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
              <strong className="block text-slate-900">Recommended SEO Slug:</strong>
              <code className="font-mono font-extrabold text-emerald-700 text-sm block">{result.suggestedSlug}</code>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-2xl">
            Enter a URL slug to inspect for stop words, uppercase letters, and hyphens.
          </div>
        )}
      </div>
    </div>
  );
};
