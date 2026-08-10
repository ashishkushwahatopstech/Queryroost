import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Crown, ShieldAlert, Wrench, BarChart2, Globe, User, ChevronDown, BookOpen, HelpCircle, Activity, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, openUpgradeModal } = useAuth();
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => navigate(user ? '/dashboard' : '/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Search className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">seo</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/80">.aktechstudio</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium -mt-0.5">Free GSC Analytics & Rank Tracker</p>
          </div>
        </div>

        {/* Center Navigation Links & Tools Dropdown */}
        <nav className="hidden lg:flex items-center gap-1 glass-card p-1.5 rounded-2xl">
          <button
            onClick={() => navigate('/dashboard')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              currentPath === '/dashboard' || currentPath === '/'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          {/* Tools Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                currentPath.startsWith('/tools')
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>SEO Tools</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {toolsMenuOpen && (
              <div 
                className="absolute top-full left-0 mt-2 w-64 glass-modal rounded-2xl p-2 shadow-2xl z-50 border border-slate-200"
                onMouseLeave={() => setToolsMenuOpen(false)}
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">Standalone Public Tools</div>
                {[
                  { name: 'SERP Snippet Previewer', path: '/tools/meta-preview' },
                  { name: 'Keyword Density Checker', path: '/tools/keyword-density' },
                  { name: 'Sitemap.xml Validator', path: '/tools/sitemap-validator' },
                  { name: 'Robots.txt Tester', path: '/tools/robots-tester' },
                  { name: 'OpenGraph Social Preview', path: '/tools/og-preview' },
                  { name: 'Readability Score Grade', path: '/tools/readability-checker' },
                  { name: 'Word Count & Content Analyzer', path: '/tools/word-counter' },
                  { name: 'URL Slug Analyzer', path: '/tools/slug-analyzer' },
                  { name: 'Title Pixel-Width Checker', path: '/tools/title-pixel-checker' },
                  { name: 'Canonical Tag Checker', path: '/tools/canonical-checker' },
                ].map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      navigate(t.path);
                      setToolsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/blog')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              currentPath.startsWith('/blog') ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Blog</span>
          </button>

          <button
            onClick={() => navigate('/pricing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              currentPath === '/pricing' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pricing</span>
          </button>

          <button
            onClick={() => navigate('/help')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              currentPath === '/help' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </button>

          {user && (
            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                currentPath === '/profile' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>
          )}

          {user?.isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                currentPath === '/admin' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-700 hover:bg-purple-50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Right Auth & Profile Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div 
                onClick={openUpgradeModal}
                className={`cursor-pointer px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition hover:scale-105 ${
                  user.plan === 'premium'
                    ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-sm'
                    : 'glass-button text-slate-700 hover:border-emerald-500'
                }`}
              >
                <Crown className={`w-3.5 h-3.5 ${user.plan === 'premium' ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                <span className="capitalize">{user.plan} Plan</span>
                {user.plan === 'free' && <span className="text-[10px] text-emerald-600 font-semibold underline ml-0.5">Upgrade</span>}
              </div>

              <div 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 pl-2 border-l border-slate-200/80 cursor-pointer group"
                title="View Profile"
              >
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-emerald-500/40 group-hover:scale-105 transition" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {user.email[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <a
              href="/api/auth/login"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center gap-2"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Sign In with Google</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
