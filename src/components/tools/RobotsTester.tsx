import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, RefreshCw, FileText } from 'lucide-react';

export const RobotsTester: React.FC = () => {
  const [robotsText, setRobotsText] = useState<string>(`User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /
Sitemap: https://aktechstudio.com/sitemap.xml`);
  const [testUrl, setTestUrl] = useState<string>('https://aktechstudio.com/admin/settings');
  const [result, setResult] = useState<any>(null);

  const handleTestRobots = () => {
    if (!robotsText.trim() || !testUrl.trim()) return;

    let path = '/';
    try {
      path = new URL(testUrl).pathname;
    } catch (e) {
      path = testUrl.startsWith('/') ? testUrl : `/${testUrl}`;
    }

    const lines = robotsText.split('\n');
    let isDisallowed = false;
    let matchingRule = '';
    const syntaxErrors: string[] = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const [directive, ...valParts] = trimmed.split(':');
      const val = valParts.join(':').trim();

      if (!directive || val === undefined) {
        syntaxErrors.push(`Line ${idx + 1}: Invalid syntax "${trimmed}"`);
        return;
      }

      const d = directive.toLowerCase().trim();
      if (d === 'disallow' && val) {
        if (path.startsWith(val)) {
          isDisallowed = true;
          matchingRule = `Disallow: ${val}`;
        }
      }
    });

    setResult({
      allowed: !isDisallowed,
      path,
      matchingRule,
      syntaxErrors
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          <span>Robots.txt Rule & Syntax Tester</span>
        </h3>

        <div>
          <label className="text-xs text-slate-500 font-semibold mb-1 block">Robots.txt Content:</label>
          <textarea
            rows={8}
            value={robotsText}
            onChange={(e) => setRobotsText(e.target.value)}
            className="w-full glass-input text-slate-900 text-xs rounded-xl p-3 focus:outline-none font-mono"
          />
        </div>

        <div>
          <label className="text-xs text-slate-500 font-semibold mb-1 block">Test Path / URL:</label>
          <input
            type="text"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            className="w-full glass-input text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
          />
        </div>

        <button
          onClick={handleTestRobots}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          Test Crawl Rule Allowed / Disallowed
        </button>
      </div>

      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900">Robots Test Result</h3>

        {result ? (
          <div className="space-y-4 text-xs">
            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
              result.allowed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {result.allowed ? <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />}
              <div>
                <div className="font-extrabold text-sm">{result.allowed ? 'ALLOWED (200 OK)' : 'BLOCKED / DISALLOWED'}</div>
                <div className="text-[11px] opacity-80">Path: <code className="font-mono">{result.path}</code></div>
              </div>
            </div>

            {result.matchingRule && (
              <div className="p-3 bg-slate-100/70 rounded-xl border border-slate-200 text-slate-700">
                <strong>Matching Rule Triggered:</strong> <code className="font-mono text-rose-700 font-bold">{result.matchingRule}</code>
              </div>
            )}

            {result.syntaxErrors && result.syntaxErrors.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
                <strong className="block font-bold">Syntax Warnings Found:</strong>
                {result.syntaxErrors.map((err: string, i: number) => (
                  <div key={i} className="text-[11px]">• {err}</div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-2xl">
            Click test to evaluate if Googlebot can crawl your target path.
          </div>
        )}
      </div>
    </div>
  );
};
