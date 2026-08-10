import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Crown, LogOut, ShieldAlert, Wrench, BarChart2, Globe, User } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, handleLogout, openUpgradeModal } = useAuth();

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

        {/* Navigation Links with URLs */}
        <nav className="hidden md:flex items-center gap-1 glass-card p-1.5 rounded-2xl">
          <button
            onClick={() => navigate('/dashboard')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              currentPath === '/dashboard' || currentPath === '/'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/tools')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              currentPath.startsWith('/tools')
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>SEO Tools</span>
          </button>

          {user && (
            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                currentPath === '/profile'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>
          )}

          {user?.isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                currentPath === '/admin'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-purple-700 hover:bg-purple-50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Plan Badge */}
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

              {/* User Avatar & Profile Link */}
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
                <span className="hidden lg:inline-block text-xs font-semibold text-slate-700 group-hover:text-emerald-600 transition truncate max-w-[100px]">
                  {user.name || user.email}
                </span>
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
