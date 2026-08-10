import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { runMetaPreview, runKeywordDensity, runSitemapValidator } from '../services/api';
import { Eye, Hash, FileCode, AlertTriangle, CheckCircle, RefreshCw, FileText, Share2, BookOpen, BarChart3, Link2 } from 'lucide-react';
import { RobotsTester } from '../components/tools/RobotsTester';
import { OgPreviewer } from '../components/tools/OgPreviewer';
import { ReadabilityChecker } from '../components/tools/ReadabilityChecker';
import { ContentAnalyzer } from '../components/tools/ContentAnalyzer';
import { SlugAnalyzer } from '../components/tools/SlugAnalyzer';
import { TitlePixelChecker } from '../components/tools/TitlePixelChecker';
import { CanonicalChecker } from '../components/tools/CanonicalChecker';

interface ToolsPageProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const ToolsPage: React.FC<ToolsPageProps> = ({ currentPath, navigate }) => {
  const { openUpgradeModal } = useAuth();
  
  const [activeTool, setActiveTool] = useState<string>('meta');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requiresPremiumError, setRequiresPremiumError] = useState(false);

  // Sync URL sub-route to active tool state
  useEffect(() => {
    if (currentPath.includes('/tools/keyword-density')) setActiveTool('keyword');
    else if (currentPath.includes('/tools/sitemap-validator')) setActiveTool('sitemap');
    else if (currentPath.includes('/tools/robots-tester')) setActiveTool('robots');
    else if (currentPath.includes('/tools/og-preview')) setActiveTool('og');
    else if (currentPath.includes('/tools/readability-checker')) setActiveTool('readability');
    else if (currentPath.includes('/tools/word-counter')) setActiveTool('wordcount');
    else if (currentPath.includes('/tools/slug-analyzer')) setActiveTool('slug');
    else if (currentPath.includes('/tools/title-pixel-checker')) setActiveTool('pixel');
    else if (currentPath.includes('/tools/canonical-checker')) setActiveTool('canonical');
    else setActiveTool('meta');
  }, [currentPath]);

  const selectTool = (toolKey: string, path: string) => {
    setActiveTool(toolKey);
    navigate(path);
  };

  // Tool 1 State: Meta SERP Preview
  const [metaUrl, setMetaUrl] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [metaResult, setMetaResult] = useState<any>(null);

  // Tool 2 State: Keyword Density
  const [keywordText, setKeywordText] = useState('');
  const [keywordResult, setKeywordResult] = useState<any>(null);

  // Tool 3 State: Sitemap Validator
  const [sitemapUrlInput, setSitemapUrlInput] = useState('');
  const [sitemapResult, setSitemapResult] = useState<any>(null);

  const handleRunMetaPreview = async () => {
    setLoading(true);
    setError('');
    setRequiresPremiumError(false);
    try {
      const data = await runMetaPreview(metaUrl, metaTitle, metaDesc);
      setMetaResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate meta preview');
      if (err.message?.includes('Premium') || err.message?.includes('limit')) {
        setRequiresPremiumError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRunKeywordDensity = async () => {
    if (!keywordText.trim()) return;
    setLoading(true);
    setError('');
    setRequiresPremiumError(false);
    try {
      const data = await runKeywordDensity(keywordText);
      setKeywordResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to check keyword density');
      if (err.message?.includes('Premium') || err.message?.includes('limit')) {
        setRequiresPremiumError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRunSitemapValidator = async () => {
    if (!sitemapUrlInput.trim()) return;
    setLoading(true);
    setError('');
    setRequiresPremiumError(false);
    try {
      const data = await runSitemapValidator(sitemapUrlInput);
      setSitemapResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to validate sitemap');
      if (err.message?.includes('Premium') || err.message?.includes('limit')) {
        setRequiresPremiumError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const toolTabs = [
    { key: 'meta', label: 'SERP Previewer', path: '/tools/meta-preview', icon: Eye },
    { key: 'keyword', label: 'Keyword Density', path: '/tools/keyword-density', icon: Hash },
    { key: 'sitemap', label: 'Sitemap XML', path: '/tools/sitemap-validator', icon: FileCode },
    { key: 'robots', label: 'Robots.txt Tester', path: '/tools/robots-tester', icon: FileText },
    { key: 'og', label: 'OpenGraph Preview', path: '/tools/og-preview', icon: Share2 },
    { key: 'readability', label: 'Readability Grade', path: '/tools/readability-checker', icon: BookOpen },
    { key: 'wordcount', label: 'Word Counter', path: '/tools/word-counter', icon: BarChart3 },
    { key: 'slug', label: 'Slug Analyzer', path: '/tools/slug-analyzer', icon: Link2 },
    { key: 'pixel', label: 'Title Pixel Width', path: '/tools/title-pixel-checker', icon: Eye },
    { key: 'canonical', label: 'Canonical Checker', path: '/tools/canonical-checker', icon: Link2 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">Standalone Utilities</span>
            <span className="text-xs text-slate-500">• Free Tier: 3 Uses / Day</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">SEO Utility Suite</h1>
          <p className="text-xs text-slate-500">10 high-performance tools for meta preview, Core Web Vitals, readability, robots.txt, schema & canonical checking.</p>
        </div>

        {/* 10 Tool selector sub-route buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 overflow-x-auto">
          {toolTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTool === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => selectTool(tab.key, tab.path)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                  isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-emerald-600" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          {requiresPremiumError && (
            <button
              onClick={openUpgradeModal}
              className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-xl text-xs shrink-0 shadow-sm"
            >
              Upgrade to Premium
            </button>
          )}
        </div>
      )}

      {/* Tool Views */}
      {activeTool === 'meta' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600" />
              <span>SERP & Meta Snippet Simulator</span>
            </h3>

            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Target Website URL:</label>
              <input
                type="url"
                placeholder="https://aktechstudio.com"
                value={metaUrl}
                onChange={(e) => setMetaUrl(e.target.value)}
                className="w-full glass-input text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Custom Meta Title (Optimal: 50-60 chars):</label>
              <input
                type="text"
                placeholder="SEO Rank Tracking Platform | aktechstudio"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full glass-input text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
              />
              <div className="text-[10px] text-slate-400 mt-1 text-right">{metaTitle.length} / 60 chars</div>
            </div>

            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Custom Meta Description (Optimal: 120-160 chars):</label>
              <textarea
                rows={3}
                placeholder="Track real Google Search Console rankings, positions, CTR, and search queries with zero API costs."
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                className="w-full glass-input text-slate-900 text-xs rounded-xl p-3 focus:outline-none"
              />
              <div className="text-[10px] text-slate-400 mt-1 text-right">{metaDesc.length} / 160 chars</div>
            </div>

            <button
              onClick={handleRunMetaPreview}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Generate SERP Snippet Preview'}
            </button>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Google Search Snippet Preview</h3>
            
            <div className="p-4 bg-white rounded-2xl text-slate-900 border border-slate-200/80 shadow-md">
              <div className="text-xs text-[#202124] flex items-center gap-1.5 font-sans mb-1 truncate">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">S</span>
                <span>{metaResult?.serp?.displayUrl || 'seo.aktechstudio.com'}</span>
              </div>
              <h4 className="text-lg text-[#1a0dab] hover:underline font-medium leading-snug cursor-pointer truncate">
                {metaResult?.serp?.title || metaTitle || 'SEO Rank Tracking Platform | aktechstudio'}
              </h4>
              <p className="text-xs text-[#4d5156] mt-1 line-clamp-2 leading-relaxed">
                {metaResult?.serp?.description || metaDesc || 'Connect your Google Search Console to track real search query rankings, average positions, clicks, and CTR.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTool === 'keyword' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Hash className="w-5 h-5 text-emerald-600" />
              <span>Keyword Density & Frequency Checker</span>
            </h3>

            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Paste Article / Page Text Content:</label>
              <textarea
                rows={10}
                placeholder="Paste your blog post or page body text here to analyze keyword frequency and density percentage..."
                value={keywordText}
                onChange={(e) => setKeywordText(e.target.value)}
                className="w-full glass-input text-slate-900 text-xs rounded-xl p-3 focus:outline-none font-mono"
              />
            </div>

            <button
              onClick={handleRunKeywordDensity}
              disabled={loading || !keywordText.trim()}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Analyze Keyword Density'}
            </button>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Keyword Frequency Table</h3>

            {keywordResult ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-100/70 rounded-2xl border border-slate-200/80 text-xs text-center">
                  <div><div className="text-slate-500 text-[10px]">Total Words</div><div className="font-bold text-slate-900 mt-0.5">{keywordResult.stats.totalWords}</div></div>
                  <div><div className="text-slate-500 text-[10px]">Unique Words</div><div className="font-bold text-slate-900 mt-0.5">{keywordResult.stats.uniqueWords}</div></div>
                  <div><div className="text-slate-500 text-[10px]">Characters</div><div className="font-bold text-emerald-600 mt-0.5">{keywordResult.stats.characters}</div></div>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                  {keywordResult.topKeywords.map((row: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-white border border-slate-200/80 text-xs shadow-sm">
                      <span className="font-bold text-slate-900 font-mono">{row.keyword}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500">{row.count} count</span>
                        <span className="font-extrabold text-emerald-600 font-mono w-14 text-right">{row.density}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-2xl">
                Paste content and click analyze to calculate keyword density.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTool === 'sitemap' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-emerald-600" />
              <span>Sitemap.xml URL Validator</span>
            </h3>

            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Full Sitemap XML URL:</label>
              <input
                type="url"
                placeholder="https://aktechstudio.com/sitemap.xml"
                value={sitemapUrlInput}
                onChange={(e) => setSitemapUrlInput(e.target.value)}
                className="w-full glass-input text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
              />
            </div>

            <button
              onClick={handleRunSitemapValidator}
              disabled={loading || !sitemapUrlInput.trim()}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Fetch & Validate Sitemap XML'}
            </button>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Validation Audit Report</h3>

            {sitemapResult ? (
              <div className="space-y-3 text-xs">
                <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
                  sitemapResult.valid ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {sitemapResult.valid ? <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />}
                  <div>
                    <div className="font-bold text-sm">{sitemapResult.valid ? 'Valid Sitemap XML' : 'Sitemap Validation Issues Found'}</div>
                    <div className="text-[11px] opacity-80">{sitemapResult.url}</div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-1.5 text-slate-700 shadow-sm">
                  <div><strong>Total Extracted URLs:</strong> <span className="font-mono text-emerald-600 font-extrabold">{sitemapResult.urlCount || 0}</span></div>
                  <div><strong>Contains &lt;lastmod&gt;:</strong> {sitemapResult.hasLastmod ? 'Yes' : 'No'}</div>
                  <div><strong>Contains &lt;priority&gt;:</strong> {sitemapResult.hasPriority ? 'Yes' : 'No'}</div>
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-2xl">
                Enter a sitemap.xml URL to run the live XML schema audit.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTool === 'robots' && <RobotsTester />}
      {activeTool === 'og' && <OgPreviewer />}
      {activeTool === 'readability' && <ReadabilityChecker />}
      {activeTool === 'wordcount' && <ContentAnalyzer />}
      {activeTool === 'slug' && <SlugAnalyzer />}
      {activeTool === 'pixel' && <TitlePixelChecker />}
      {activeTool === 'canonical' && <CanonicalChecker />}

    </div>
  );
};
