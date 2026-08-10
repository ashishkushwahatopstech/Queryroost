import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, Zap, X, Shield, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl glass-modal rounded-3xl overflow-hidden p-6 sm:p-8">
        <button
          onClick={closeUpgradeModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">AK TECH STUDIO</span>
            <h2 className="text-2xl font-extrabold text-slate-900">Upgrade to Premium</h2>
          </div>
        </div>

        <p className="text-slate-600 text-xs sm:text-sm mb-6">
          Unlock full 16-month historical search console analytics, unlimited connected sites, full keyword rank lists, and un-gated SEO tools.
        </p>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {/* Free Card */}
          <div className="p-5 bg-slate-100/60 border border-slate-200/80 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-700">Free Tier</h3>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">Current Default</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-400" /> Max 1 Connected Website</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-400" /> Top 10 Tracked Queries</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-400" /> 28-Day Data History</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-slate-400" /> 3 Daily Standalone Tool Uses</li>
            </ul>
          </div>

          {/* Premium Card */}
          <div className="p-5 bg-gradient-to-b from-emerald-50/80 to-teal-50/50 border border-emerald-300 rounded-2xl shadow-lg relative">
            <div className="absolute -top-3 right-4 px-3 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-extrabold uppercase rounded-full tracking-wider shadow">
              Recommended
            </div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-600" /> Premium Tier
              </h3>
              <span className="text-xs font-bold text-emerald-700">$0 / Testing Stub</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 font-bold" /> Unlimited Connected Sites</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 font-bold" /> Full Keyword Rankings (500+)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 font-bold" /> Full 16-Month History Trends</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 font-bold" /> Unlimited Standalone Tool Uses</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 font-bold" /> Export PDF / CSV Reports</li>
            </ul>
          </div>
        </div>

        <div className="p-3 bg-slate-100/80 border border-slate-200 rounded-2xl text-xs text-slate-600 mb-6 flex items-start gap-2">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Integration Note:</strong> Payment endpoint <code className="text-emerald-700 font-mono">/api/upgrade</code> is stubbed cleanly for Stripe / Razorpay checkout integration. Clicking upgrade below simulates instant activation.
          </span>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={closeUpgradeModal}
            className="px-4 py-2.5 rounded-xl glass-button text-slate-700 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleUpgradeClick}
            disabled={upgrading || user?.plan === 'premium'}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 disabled:opacity-50"
          >
            {upgrading ? 'Processing Upgrade...' : user?.plan === 'premium' ? 'Already Premium' : 'Activate Premium Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
