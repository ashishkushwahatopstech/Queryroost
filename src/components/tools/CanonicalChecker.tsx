import { useState } from 'react';
import { runCanonicalChecker } from '../../services/api';
import { Link2, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export const CanonicalChecker: React.FC = () => {
  const [url, setUrl] = useState<string>('https://aktechstudio.com');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleCheckCanonical = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await runCanonicalChecker(url);
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Failed to inspect canonical tag');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-emerald-600" />
          <span>Canonical Tag Live Inspector</span>
        </h3>

        <div>
          <label className="text-xs text-slate-500 font-semibold mb-1 block">Target Website URL:</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full glass-input text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
          />
        </div>

        <button
          onClick={handleCheckCanonical}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Fetch & Check Canonical Tag'}
        </button>
      </div>

      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900">Canonical Tag Inspection Report</h3>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result ? (
          <div className="space-y-4 text-xs">
            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
              result.valid ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {result.valid ? <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />}
              <div>
                <div className="font-extrabold text-sm">{result.valid ? 'Valid Canonical Tag' : 'Canonical Issues Found'}</div>
                <div className="text-[11px] opacity-90">{result.url}</div>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 font-mono text-slate-800 shadow-sm">
              <div><strong>Detected Canonical URL:</strong></div>
              <code className="text-emerald-700 font-bold block break-all">{result.canonicalUrl || 'None (Missing Canonical Tag)'}</code>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-2xl">
            Enter a URL to fetch its HTML header and inspect canonical tags.
          </div>
        )}
      </div>
    </div>
  );
};
