import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Crown, LogOut, ShieldAlert, Wrench, BarChart2, Globe } from 'lucide-react';

interface NavbarProps {
  activeTab: 'landing' | 'dashboard' | 'tools' | 'admin';
  setActiveTab: (tab: 'landing' | 'dashboard' | 'tools' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, handleLogout, openUpgradeModal } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f19]/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => setActiveTab(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
              <Search className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-white tracking-tight">seo</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">.aktechstudio</span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium -mt-0.5">Free GSC Analytics & Rank Tracker</p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-900/60 p-1.5 rounded-xl border border-gray-800">
          <button
            onClick={() => setActiveTab(user ? 'dashboard' : 'landing')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'dashboard' || activeTab === 'landing'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'tools'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Standalone Tools</span>
          </button>

          {user?.isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'admin'
                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                  : 'text-purple-400 hover:text-purple-300 hover:bg-purple-950/30'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          )}
        </nav>

        {/* Right Auth Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Plan Badge */}
              <div 
                onClick={openUpgradeModal}
                className={`cursor-pointer px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition hover:scale-105 ${
                  user.plan === 'premium'
                    ? 'bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10'
                    : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-emerald-500/50'
                }`}
              >
                <Crown className={`w-3.5 h-3.5 ${user.plan === 'premium' ? 'text-amber-400 fill-amber-400' : 'text-gray-400'}`} />
                <span className="capitalize">{user.plan} Plan</span>
                {user.plan === 'free' && <span className="text-[10px] text-emerald-400 underline font-normal ml-0.5">Upgrade</span>}
              </div>

              {/* User Avatar */}
              <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-emerald-500/40" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    {user.email[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden lg:inline-block text-xs font-medium text-gray-300 truncate max-w-[110px]">{user.name || user.email}</span>
                
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-gray-800 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="/api/auth/login"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Sign In with Google</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
