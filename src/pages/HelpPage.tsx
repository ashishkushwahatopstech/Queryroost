import React from 'react';
import { HelpCircle, ShieldCheck, Key, RefreshCw, Layers } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const faqs = [
    {
      q: 'How does Google Search Console OAuth verification work?',
      a: 'When you click "Sign In with Google", our platform requests the read-only consent scope (https://www.googleapis.com/auth/webmasters.readonly). Google generates an encrypted access token that grants our backend access to fetch your ranking data directly from Google Search Console.'
    },
    {
      q: 'Why can I only track websites that I own?',
      a: 'Google Search Console data is private first-party data protected by Google. To ensure our platform remains 100% free, accurate, and compliant, we restrict tracking to websites where your Google account has verified ownership.'
    },
    {
      q: 'What happens if my Google access token expires?',
      a: 'Google access tokens expire after 1 hour. We automatically store an offline refresh_token so our backend automatically renews your access token in the background without requiring you to log in again.'
    },
    {
      q: 'How does the Site Audit Crawler work?',
      a: 'Our serverless Crawler fetches your website pages (respecting robots.txt rules) and checks for technical SEO issues like 404 broken links, duplicate title tags, missing meta descriptions, multiple H1 tags, and missing image alt attributes.'
    },
    {
      q: 'What is the difference between Free and Premium tiers?',
      a: 'Free Forever allows 1 connected website, top 10 tracked queries, 28-day history range, and 3 daily standalone tool checks. Premium Pro unlocks unlimited connected websites, 500+ tracked keywords, full 16-month history trends, and downloadable PDF/CSV reports.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base & Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Frequently Asked Questions</h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Everything you need to know about Search Console authentication, ranking metrics, and technical site audits.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="glass-card p-6 rounded-3xl space-y-2">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed pl-7">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
