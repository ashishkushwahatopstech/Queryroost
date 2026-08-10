import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, Zap, Sparkles, Shield, HelpCircle } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { openUpgradeModal, user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple & Transparent Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Choose the Perfect Plan for Your Business
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Start free with 1 website and 28-day Search Console history, or upgrade for unthrottled search analytics and unlimited tools.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="glass-card p-8 rounded-3xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-slate-900">Free Forever</h3>
              <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">$0 / month</span>
            </div>
            <p className="text-xs text-slate-500 mb-6">Designed for personal blogs, portfolio sites, and single site webmasters.</p>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" /> Max 1 Connected Website</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" /> Top 10 Tracked Queries Visible</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" /> 28-Day Data History Range</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" /> 20-Page Max Technical Site Audit</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" /> 3 Daily Standalone Tool Runs</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" /> In-Dashboard Summary View</li>
            </ul>
          </div>

          <a
            href="/api/auth/login"
            className="w-full py-3 rounded-2xl glass-button text-slate-900 text-xs font-bold text-center block transition hover:bg-slate-100"
          >
            Get Started Free
          </a>
        </div>

        {/* Premium Plan */}
        <div className="glass-card p-8 rounded-3xl flex flex-col justify-between space-y-6 border-emerald-300 bg-gradient-to-b from-emerald-50/50 to-white shadow-xl relative">
          <div className="absolute -top-3.5 right-6 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-extrabold uppercase rounded-full shadow">
            MOST POPULAR
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600 fill-emerald-600" /> Premium Pro
              </h3>
              <span className="text-sm font-extrabold text-emerald-700">$0 / Test Stub</span>
            </div>
            <p className="text-xs text-slate-500 mb-6">Designed for agencies, SEO consultants, and multi-domain owners.</p>

            <ul className="space-y-3 text-xs text-slate-800 font-medium">
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" /> Unlimited Connected Websites</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" /> Full Keyword Rankings (500+)</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" /> Full 16-Month Historical Trends</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" /> 100-Page Technical Site Audits</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" /> Unlimited Standalone Tool Runs</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" /> Exportable PDF & CSV Reports</li>
            </ul>
          </div>

          <button
            onClick={openUpgradeModal}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white text-xs font-bold text-center transition shadow-md shadow-emerald-500/20"
          >
            {user?.plan === 'premium' ? 'Already Active' : 'Activate Premium Pro'}
          </button>
        </div>
      </div>

    </div>
  );
};
