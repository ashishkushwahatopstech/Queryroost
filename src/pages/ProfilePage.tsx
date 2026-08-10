import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Crown, Shield, Globe, Calendar, Mail, CheckCircle2, Zap, LogOut, ArrowRight, Sparkles, KeyRound } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, handleLogout, openUpgradeModal } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 glass-card rounded-3xl text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign In Required</h2>
        <p className="text-xs text-slate-500">Please sign in with your Google account to access your SEO profile and connected sites.</p>
        <a
          href="/api/auth/login"
          className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition"
        >
          <Globe className="w-4 h-4" />
          <span>Sign In with Google</span>
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Profile Banner Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          {user.picture ? (
            <img src={user.picture} alt={user.name} className="w-20 h-20 rounded-2xl border-2 border-emerald-500/30 shadow-md object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center text-2xl shadow-md">
              {user.email[0].toUpperCase()}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{user.name || user.email.split('@')[0]}</h1>
              
              {/* Plan Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm border ${
                user.plan === 'premium'
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}>
                <Crown className={`w-3.5 h-3.5 ${user.plan === 'premium' ? 'text-amber-500 fill-amber-500' : 'text-emerald-600'}`} />
                <span className="capitalize">{user.plan} Tier</span>
              </span>

              {user.isAdmin && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 border border-purple-200 text-purple-700 uppercase">
                  Superadmin
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
          {user.plan === 'free' && (
            <button
              onClick={openUpgradeModal}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Upgrade to Premium</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl glass-button text-slate-600 hover:text-rose-600 text-xs font-semibold transition flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>

      {/* Grid Overview Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Card 1: Account Information */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            <span>Account Details</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-100/60 rounded-xl border border-slate-200/80 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Account ID</span>
              <code className="font-mono text-slate-700 font-semibold truncate max-w-[180px]">{user.id}</code>
            </div>

            <div className="p-3 bg-slate-100/60 rounded-xl border border-slate-200/80 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Authentication Source</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google OAuth 2.0 Verified</span>
              </span>
            </div>

            <div className="p-3 bg-slate-100/60 rounded-xl border border-slate-200/80 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Google Search Console API Scope</span>
              <span className="font-semibold text-slate-800">webmasters.readonly</span>
            </div>

            <div className="p-3 bg-slate-100/60 rounded-xl border border-slate-200/80 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Session Status</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Card 2: Tier Features & Usage Limits */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span>Subscription Quota Limits</span>
            </h3>

            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{user.plan} PLAN</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-100/60 rounded-xl border border-slate-200/80 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Connected Sites Cap</span>
              <span className="font-bold text-slate-900">{user.plan === 'premium' ? 'Unlimited' : '1 Website'}</span>
            </div>

            <div className="p-3 bg-slate-100/60 rounded-xl border border-slate-200/80 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Ranked Queries Visible</span>
              <span className="font-bold text-slate-900">{user.plan === 'premium' ? 'Up to 500+ Keywords' : 'Top 10 Keywords'}</span>
            </div>

            <div className="p-3 bg-slate-100/60 rounded-xl border border-slate-200/80 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Data History Range</span>
              <span className="font-bold text-slate-900">{user.plan === 'premium' ? 'Full 16 Months' : '28 Days'}</span>
            </div>

            <div className="p-3 bg-slate-100/60 rounded-xl border border-slate-200/80 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Daily Standalone Tool Runs</span>
              <span className="font-bold text-slate-900">{user.plan === 'premium' ? 'Unlimited Runs' : '3 Runs / Day'}</span>
            </div>
          </div>

          {user.plan === 'free' && (
            <div className="pt-2">
              <button
                onClick={openUpgradeModal}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:brightness-105 text-slate-950 font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Unlock Premium Limits Now</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Navigation Quick Links */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-slate-900">Platform Navigation Shortcuts</h3>

        <div className="grid sm:grid-cols-3 gap-4">
          <a
            href="/dashboard"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/50 hover:shadow-md transition flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition">Rank Dashboard</div>
              <div className="text-[11px] text-slate-500">View Search Console metrics</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
          </a>

          <a
            href="/tools"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/50 hover:shadow-md transition flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition">SEO Tools Suite</div>
              <div className="text-[11px] text-slate-500">SERP, Density, Sitemap</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
          </a>

          {user.isAdmin ? (
            <a
              href="/admin"
              className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 hover:border-purple-400 hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-purple-900">Admin Console</div>
                <div className="text-[11px] text-purple-600">Platform controls & users</div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-400 group-hover:text-purple-600 transition" />
            </a>
          ) : (
            <div
              onClick={openUpgradeModal}
              className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 hover:border-emerald-400 cursor-pointer transition flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-emerald-900">Upgrade Account</div>
                <div className="text-[11px] text-emerald-600">Get unthrottled access</div>
              </div>
              <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
