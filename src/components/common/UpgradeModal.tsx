import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, Zap, X, Shield, Sparkles, AlertCircle } from 'lucide-react';

export const UpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, closeUpgradeModal, triggerPlanUpgrade, user } = useAuth();
  const [upgrading, setUpgrading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isUpgradeModalOpen) return null;

  const handleUpgradeClick = async () => {
    setUpgrading(true);
    const success = await triggerPlanUpgrade();
    setUpgrading(false);
    if (success) {
      setSuccessMsg('Successfully upgraded to Premium plan!');
      setTimeout(() => {
        setSuccessMsg('');
        closeUpgradeModal();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        <button
          onClick={closeUpgradeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl text-white shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">AK TECH STUDIO</span>
            <h2 className="text-2xl font-bold text-white">Upgrade to Premium</h2>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-6">
          Unlock full 16-month historical search console analytics, unlimited connected sites, full keyword rank lists, and un-gated SEO tools.
        </p>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-sm flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {/* Free Card */}
          <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-400">Free Tier</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">Current Default</span>
            </div>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gray-500" /> Max 1 Connected Website</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gray-500" /> Top 10 Tracked Queries</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gray-500" /> 28-Day Data History</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gray-500" /> 3 Daily Standalone Tool Uses</li>
            </ul>
          </div>

          {/* Premium Card */}
          <div className="p-4 bg-gradient-to-b from-emerald-950/40 to-gray-900 border border-emerald-500/40 rounded-xl shadow-lg relative">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-[#0b0f19] text-[10px] font-extrabold uppercase rounded-full tracking-wider shadow">
              Recommended
            </div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Premium Tier
              </h3>
              <span className="text-xs font-bold text-emerald-400">$0 / Testing Stub</span>
            </div>
            <ul className="space-y-2 text-xs text-gray-200">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited Connected Sites</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Full Keyword Rankings (Up to 500+)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Full 16-Month History Trends</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited Standalone Tool Uses</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Export PDF / CSV Analytics Reports</li>
            </ul>
          </div>
        </div>

        <div className="p-3 bg-gray-900/80 border border-gray-800 rounded-xl text-xs text-gray-400 mb-6 flex items-start gap-2">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Integration Note:</strong> Payment endpoint <code className="text-emerald-300 font-mono">/api/upgrade</code> is stubbed cleanly for Stripe / Razorpay checkout integration. Clicking upgrade below simulates instant activation.
          </span>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={closeUpgradeModal}
            className="px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpgradeClick}
            disabled={upgrading || user?.plan === 'premium'}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition flex items-center gap-2 disabled:opacity-50"
          >
            {upgrading ? 'Processing Upgrade...' : user?.plan === 'premium' ? 'Already Premium' : 'Activate Premium Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
