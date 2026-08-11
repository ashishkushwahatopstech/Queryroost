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
    <header className="sticky top-0 z-40 w-full vercel-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Queryroost Brand Logo */}
        <div 
          onClick={() => navigate(user ? '/dashboard' : '/')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(user ? '/dashboard' : '/'); }}
          aria-label="Queryroost Homepage"
        >
          <div className="w-8 h-8 rounded-xl bg-[#171717] text-white flex items-center justify-center font-extrabold text-sm shadow-sm group-hover:scale-105 transition-transform">
            Q
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-[#171717]">Queryroost</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fafafa] text-[#171717] font-mono border border-[#ebebeb] font-semibold">
                v2.0
              </span>
            </div>
          </div>
        </div>

        {/* Center Quick Site Search Bar */}
        <form onSubmit={handleNavSearchSubmit} className="flex items-center gap-1.5 bg-[#fafafa] border border-[#ebebeb] px-3 py-1.5 rounded-[10px] max-w-xs sm:max-w-md w-full focus-within:border-[#171717] transition-all">
          <Globe className="w-3.5 h-3.5 text-[#888888] shrink-0" aria-hidden="true" />
          <input
            type="text"
            placeholder="Analyze website (e.g. aktechstudio.com)…"
            value={navSearchUrl}
            onChange={(e) => setNavSearchUrl(e.target.value)}
            className="w-full text-xs font-medium text-[#171717] focus:outline-none bg-transparent"
            aria-label="Website URL Analyzer"
          />
          <button 
            type="submit" 
            className="p-1 rounded-md bg-[#171717] hover:bg-[#333333] text-white transition focus-visible:ring-2 focus-visible:ring-[#171717]"
            aria-label="Run Site Audit"
          >
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </button>
        </form>

        {/* Right Navigation Links & Auth */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => navigate('/dashboard')}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition focus-visible:ring-2 focus-visible:ring-[#171717] ${
              currentPath === '/dashboard' || currentPath === '/'
                ? 'bg-[#171717] text-white font-semibold'
                : 'text-[#4d4d4d] hover:text-[#171717] hover:bg-[#fafafa]'
            }`}
          >
            Site Dashboard
          </button>

          <button
            onClick={() => navigate('/blog')}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition focus-visible:ring-2 focus-visible:ring-[#171717] ${
              currentPath.startsWith('/blog') ? 'bg-[#171717] text-white font-semibold' : 'text-[#4d4d4d] hover:text-[#171717] hover:bg-[#fafafa]'
            }`}
          >
            Blog
          </button>

          <button
            onClick={() => navigate('/pricing')}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition focus-visible:ring-2 focus-visible:ring-[#171717] ${
              currentPath === '/pricing' ? 'bg-[#171717] text-white font-semibold' : 'text-[#4d4d4d] hover:text-[#171717] hover:bg-[#fafafa]'
            }`}
          >
            Pricing
          </button>

          <button
            onClick={() => navigate('/help')}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition focus-visible:ring-2 focus-visible:ring-[#171717] ${
              currentPath === '/help' ? 'bg-[#171717] text-white font-semibold' : 'text-[#4d4d4d] hover:text-[#171717] hover:bg-[#fafafa]'
            }`}
          >
            Help
          </button>

          {user && (
            <button
              onClick={() => navigate('/profile')}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition focus-visible:ring-2 focus-visible:ring-[#171717] ${
                currentPath === '/profile' ? 'bg-[#171717] text-white font-semibold' : 'text-[#4d4d4d] hover:text-[#171717] hover:bg-[#fafafa]'
              }`}
            >
              Profile
            </button>
          )}

          {user?.isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition text-[#7928ca] hover:bg-[#7928ca]/10`}
            >
              Admin
            </button>
          )}
        </nav>

        {/* Auth Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <div 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 cursor-pointer group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/profile'); }}
              aria-label="User Profile"
            >
              {user.picture ? (
                <img src={user.picture} alt="" className="w-7 h-7 rounded-full border border-[#ebebeb] group-hover:border-[#171717] transition" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#171717] text-white font-semibold flex items-center justify-center text-xs">
                  {user.email[0].toUpperCase()}
                </div>
              )}
            </div>
          ) : (
            <a
              href="/api/auth/login"
              className="px-3.5 py-1.5 rounded-[8px] bg-[#171717] hover:bg-[#333333] text-white font-medium text-xs transition shadow-sm flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#171717]"
            >
              <Globe className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sign In</span>
            </a>
          )}
        </div>

      </div>
    </header>
  );
};
