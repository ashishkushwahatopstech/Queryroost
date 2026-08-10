import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAdminStats, updateAdminUserPlan, updateAdminSetting } from '../services/api';
import { ShieldAlert, Users, Globe, Activity, ToggleLeft, ToggleRight, Crown, AlertOctagon, CheckCircle2, RefreshCw } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string>('');

  const loadAdminData = async () => {
    setLoading(true);
    setError('');
    const res = await fetchAdminStats();

    if (!res.authorized) {
      setUnauthorized(true);
      setError(res.message || 'Access Denied. Admin console is restricted to ashishkushwaha88643@gmail.com');
    } else {
      setUnauthorized(false);
      setData(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleTogglePlan = async (userId: string, currentPlan: string) => {
    const targetPlan = currentPlan === 'free' ? 'premium' : 'free';
    const res = await updateAdminUserPlan(userId, targetPlan);
    if (res.success) {
      setActionSuccess(`Plan updated to ${targetPlan}`);
      await loadAdminData();
      setTimeout(() => setActionSuccess(''), 2500);
    }
  };

  const handleToggleSetting = async (key: string, currentValue: string) => {
    const newValue = currentValue === 'true' ? 'false' : 'true';
    const res = await updateAdminSetting(key, newValue);
    if (res.success) {
      setActionSuccess(`Setting ${key} updated`);
      await loadAdminData();
      setTimeout(() => setActionSuccess(''), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400 gap-3">
        <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
        <span className="text-sm font-medium">Verifying admin credentials server-side...</span>
      </div>
    );
  }

  if (unauthorized || !user?.isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-rose-950/30 border border-rose-500/40 rounded-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white">403 Unauthorized Access</h2>
        <p className="text-xs text-rose-200 leading-relaxed">
          {error || 'Access to /admin is strictly restricted to ashishkushwaha88643@gmail.com via server-side Google OAuth token verification.'}
        </p>
        <div className="p-3 bg-rose-900/40 rounded-xl text-[11px] font-mono text-rose-300">
          Your current email: {user?.email || 'Not logged in'}
        </div>
        <a
          href="/dashboard"
          className="inline-block px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs rounded-xl transition"
        >
          Return to User Dashboard
        </a>
      </div>
    );
  }

  const stats = data?.stats;
  const usersList = data?.users || [];
  const adminSettings = data?.adminSettings || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950/40 via-gray-900 to-gray-900 p-6 rounded-2xl border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">Superadmin Access</span>
              <span className="text-xs text-gray-400 font-mono">ashishkushwaha88643@gmail.com</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">Platform Admin Console</h1>
          </div>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh System Stats</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl">
          <div className="text-xs text-gray-400 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-purple-400" /> Registered Users</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">{stats?.totalUsers || 0}</div>
          <div className="text-[11px] text-gray-400 mt-1">{stats?.freeUsers} Free / {stats?.premiumUsers} Premium</div>
        </div>

        <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl">
          <div className="text-xs text-gray-400 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-emerald-400" /> Active Connected Sites</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">{stats?.activeSites || 0}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Verified GSC domains</div>
        </div>

        <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl">
          <div className="text-xs text-gray-400 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-cyan-400" /> GSC API Daily Quota</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1 font-mono">{stats?.gscApiQuotaUsedToday} / {stats?.gscApiQuotaTotal}</div>
          <div className="text-[11px] text-gray-400 mt-1">~1,158 queries remaining today</div>
        </div>

        <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl">
          <div className="text-xs text-gray-400 flex items-center gap-1.5"><Crown className="w-3.5 h-3.5 text-amber-400" /> Premium Ratio</div>
          <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">
            {stats?.totalUsers ? `${Math.round((stats.premiumUsers / stats.totalUsers) * 100)}%` : '0%'}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Conversion rate</div>
        </div>
      </div>

      {/* Global Tool Gating Controls */}
      <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-white">Global Premium Tool Gating Switches</h3>
        <p className="text-xs text-gray-400">Toggle whether standalone tools require a Premium tier subscription globally.</p>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { key: 'require_premium_meta_preview', label: 'Meta / SERP Snippet Previewer' },
            { key: 'require_premium_keyword_density', label: 'Keyword Density Analyzer' },
            { key: 'require_premium_sitemap_validator', label: 'Sitemap XML Validator' }
          ].map((item) => {
            const isRequired = adminSettings[item.key] === 'true';
            return (
              <div key={item.key} className="p-4 bg-gray-950/70 border border-gray-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">{item.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {isRequired ? <span className="text-amber-400 font-bold">Premium Required</span> : <span className="text-emerald-400 font-bold">Open to Free</span>}
                  </div>
                </div>

                <button
                  onClick={() => handleToggleSetting(item.key, adminSettings[item.key] || 'false')}
                  className="text-purple-400 hover:text-purple-300 transition"
                >
                  {isRequired ? <ToggleRight className="w-7 h-7 text-amber-400" /> : <ToggleLeft className="w-7 h-7 text-gray-600" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Users Management Table */}
      <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-white">Registered Users & Tier Controls</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0b0f19] text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Plan Tier</th>
                <th className="p-3">Joined Date</th>
                <th className="p-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {usersList.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-800/40 transition">
                  <td className="p-3 font-semibold text-white flex items-center gap-2">
                    {u.picture ? (
                      <img src={u.picture} alt="" className="w-6 h-6 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
                        {u.email[0].toUpperCase()}
                      </div>
                    )}
                    <span>{u.name || 'User'}</span>
                  </td>
                  <td className="p-3 font-mono text-gray-300">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      u.plan === 'premium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400">{new Date(u.created_at * 1000).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleTogglePlan(u.id, u.plan)}
                      className="px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-semibold transition"
                    >
                      Toggle to {u.plan === 'free' ? 'Premium' : 'Free'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
