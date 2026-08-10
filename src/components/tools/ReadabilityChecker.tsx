import { useState } from 'react';
import { BookOpen, CheckCircle, HelpCircle } from 'lucide-react';

export const ReadabilityChecker: React.FC = () => {
  const [text, setText] = useState<string>(`Google Search Console is a free service offered by Google that helps you monitor, maintain, and troubleshoot your site's presence in Google Search results. You don't have to sign up for Search Console to be included in Google Search results, but Search Console helps you understand and improve how Google sees your site.`);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    if (!text.trim()) return;

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
    const words = text.trim().split(/\s+/).length || 1;
    
    // Rough syllable calculation
    const syllables = text.toLowerCase().replace(/[^a-z]/g, '')
      .replace(/(?:[^laeiouy]es|ed|the|[^laeiouy]e)$/i, '')
      .replace(/^y/i, '')
      .match(/[aeiouy]{1,2}/g)?.length || Math.round(words * 1.4);

    // Flesch Reading Ease Formula
    const fleschEase = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    const roundedEase = Math.min(100, Math.max(0, +fleschEase.toFixed(1)));

    // Flesch-Kincaid Grade Level Formula
    const gradeLevel = (0.39 * (words / sentences)) + (11.8 * (syllables / words)) - 15.59;
    const roundedGrade = Math.max(1, +gradeLevel.toFixed(1));

    let easeRating = 'Easy / Conversation Level';
    if (roundedEase < 50) easeRating = 'Hard / Academic Level';
    else if (roundedEase < 70) easeRating = 'Medium / Standard Web Article';

    setResult({
      fleschEase: roundedEase,
      gradeLevel: roundedGrade,
      easeRating,
      sentences,
      words,
      syllables
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <span>Flesch-Kincaid Readability Calculator</span>
        </h3>

        <div>
          <label className="text-xs text-slate-500 font-semibold mb-1 block">Article Text Content:</label>
          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full glass-input text-slate-900 text-xs rounded-xl p-3 focus:outline-none"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          Calculate Flesch-Kincaid Grade Score
        </button>
      </div>

      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900">Readability Score Breakdown</h3>

        {result ? (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                <div className="text-[11px] text-emerald-800 font-bold uppercase">Flesch Ease Score</div>
                <div className="text-3xl font-extrabold text-emerald-700 mt-1 font-mono">{result.fleschEase} / 100</div>
              </div>
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl text-center">
                <div className="text-[11px] text-slate-600 font-bold uppercase">US Grade Level</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">Grade {result.gradeLevel}</div>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Reading Rating: {result.easeRating}</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Most top-ranking web content aims for Flesch Reading Ease scores between 60 to 70 (approx 8th grade reading level).
              </p>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-2xl">
            Paste text content to calculate readability grade levels.
          </div>
        )}
      </div>
    </div>
  );
};
