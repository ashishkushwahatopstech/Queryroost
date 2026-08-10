import React, { useState } from 'react';
import { Eye, Globe, RefreshCw, Share2 } from 'lucide-react';

export const OgPreviewer: React.FC = () => {
  const [url, setUrl] = useState<string>('https://aktechstudio.com');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  const handleFetchOg = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cors-proxy?url=${encodeURIComponent(url)}`);
      const json = await res.json();

      if (json.html) {
        const html = json.html;
        const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
                        html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '';
        const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
                       html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1] || '';
        const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)?.[1] || '';
        const siteName = html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i)?.[1] || new URL(url).hostname;

        setData({
          title: ogTitle,
          description: ogDesc,
          image: ogImage,
          siteName,
          url
        });
      }
    } catch (e) {
      setData({
        title: 'Sample OpenGraph Title | AK Tech Studio',
        description: 'Sample description snippet showing how this page link renders when shared on Facebook, X, and LinkedIn.',
        image: '',
        siteName: 'aktechstudio.com',
        url
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-emerald-600" />
          <span>Open Graph & Social Card Inspector</span>
        </h3>

        <div>
          <label className="text-xs text-slate-500 font-semibold mb-1 block">Target Page URL:</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full glass-input text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
          />
        </div>

        <button
          onClick={handleFetchOg}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Fetch OpenGraph Tags & Preview'}
        </button>
      </div>

      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900">Facebook / LinkedIn / Twitter Social Preview</h3>

        {data ? (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md text-xs">
              <div className="h-44 bg-slate-100 flex items-center justify-center overflow-hidden">
                {data.image ? (
                  <img src={data.image} alt="OG" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-400 font-semibold text-xs text-center p-4">No og:image tag found</div>
                )}
              </div>
              <div className="p-4 space-y-1">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">{data.siteName}</div>
                <div className="font-extrabold text-slate-900 text-sm line-clamp-1">{data.title || 'No Title Found'}</div>
                <p className="text-slate-500 text-xs line-clamp-2">{data.description || 'No Description Found'}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-2xl">
            Enter URL and click fetch to render social card previews.
          </div>
        )}
      </div>
    </div>
  );
};
