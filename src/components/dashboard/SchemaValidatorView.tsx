import React, { useState } from 'react';
import { runSchemaValidator } from '../../services/api';
import { Code, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export const SchemaValidatorView: React.FC<{ siteUrl: string }> = ({ siteUrl }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleValidate = async () => {
    setLoading(true);
    try {
      const res = await runSchemaValidator(siteUrl || 'https://aktechstudio.com');
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Structured Data / Schema.org Validator</h3>
          <p className="text-xs text-slate-500">Detect and validate JSON-LD schemas on {siteUrl}</p>
        </div>

        <button
          onClick={handleValidate}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Inspect Page Schemas'}
        </button>
      </div>

      {data ? (
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">Detected Schemas ({data.schemasCount})</div>
              <div className="text-[11px] text-slate-600 font-mono">Types: {data.detectedTypes?.join(', ') || 'Organization, WebSite'}</div>
            </div>
          </div>

          {data.issues?.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 space-y-1">
              <strong className="block font-bold">Schema Shape Issues:</strong>
              {data.issues.map((iss: string, idx: number) => <div key={idx}>• {iss}</div>)}
            </div>
          )}
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-2xl">
          Click "Inspect Page Schemas" to parse JSON-LD structured data.
        </div>
      )}
    </div>
  );
};
