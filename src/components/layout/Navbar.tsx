import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Crown, ShieldAlert, BarChart2, Globe, User, BookOpen, HelpCircle, Sparkles, ArrowRight } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, openUpgradeModal } = useAuth();
  const [navSearchUrl, setNavSearchUrl] = useState<string>('');

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!navSearchUrl.trim()) return;
    let formatted = navSearchUrl.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = `https://${formatted}`;
    }
    navigate(`/dashboard?site=${encodeURIComponent(formatted)}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => navigate(user ? '/dashboard' : '/')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Search className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">seo</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/80">.aktechstudio</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium -mt-0.5">Site-Centric SEO & Speed Platform</p>
          </div>
        </div>

        {/* Center Quick Site Search Bar */}
        <form onSubmit={handleNavSearchSubmit} className="flex items-center gap-1.5 glass-card px-3 py-1.5 rounded-2xl max-w-xs sm:max-w-md w-full">
          <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
          <input
            type="text"
            placeholder="Analyze site URL (e.g. aktechstudio.com)..."
            value={navSearchUrl}
            onChange={(e) => setNavSearchUrl(e.target.value)}
            className="w-full text-xs font-semibold text-slate-900 focus:outline-none bg-transparent"
          />
          <button type="submit" className="p-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Right Navigation Links & Auth */}
        <nav className="hidden lg:flex items-center gap-1 glass-card p-1.5 rounded-2xl shrink-0">
          <button
            onClick={() => navigate('/dashboard')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              currentPath === '/dashboard' || currentPath === '/'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Site Dashboard</span>
          </button>

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

        {/* Right Auth Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <div 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-emerald-500/40 group-hover:scale-105 transition" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {user.email[0].toUpperCase()}
                </div>
              )}
            </div>
          ) : (
            <a
              href="/api/auth/login"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
