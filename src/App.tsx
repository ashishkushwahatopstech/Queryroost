import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { UpgradeModal } from './components/common/UpgradeModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { ProfilePage } from './pages/ProfilePage';
import { PricingPage } from './pages/PricingPage';
import { BlogPage } from './pages/BlogPage';
import { HelpPage } from './pages/HelpPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { StatusPage } from './pages/StatusPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [activeSiteParam, setActiveSiteParam] = useState<string>('');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      const searchParams = new URLSearchParams(window.location.search);
      const site = searchParams.get('site');
      if (site) setActiveSiteParam(site);
    };

    const searchParams = new URLSearchParams(window.location.search);
    const site = searchParams.get('site');
    if (site) setActiveSiteParam(site);

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);

    if (path.includes('site=')) {
      const searchParams = new URLSearchParams(path.split('?')[1]);
      const site = searchParams.get('site');
      if (site) setActiveSiteParam(site);
    }
  };

  if (currentPath.includes('/auth/callback')) {
    return <AuthCallbackPage />;
  }

  const isLandingPath = currentPath === '/' || currentPath === '';
  const isDashboardPath = currentPath === '/dashboard' || currentPath === '/site';
  const isProfilePath = currentPath === '/profile';
  const isAdminPath = currentPath === '/admin';
  const isPricingPath = currentPath === '/pricing';
  const isBlogPath = currentPath.startsWith('/blog');
  const isHelpPath = currentPath === '/help';
  const isChangelogPath = currentPath === '/changelog';
  const isHowItWorksPath = currentPath === '/how-it-works';
  const isStatusPath = currentPath === '/status';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      <Navbar currentPath={currentPath} navigate={navigate} />
      
      <main className="flex-1">
        {/* Landing Page */}
        {(isLandingPath && !user) && (
          <LandingPage onGoToDashboard={(siteUrl) => {
            if (siteUrl) setActiveSiteParam(siteUrl);
            navigate(siteUrl ? `/dashboard?site=${encodeURIComponent(siteUrl)}` : '/dashboard');
          }} />
        )}

        {/* Dashboard Page */}
        {(isDashboardPath || (isLandingPath && user)) && (
          <DashboardPage initialSiteUrl={activeSiteParam} />
        )}

        {/* Profile Page */}
        {isProfilePath && (
          <ProfilePage />
        )}

        {/* Admin Page */}
        {isAdminPath && (
          <AdminPage />
        )}

        {/* Pricing Page */}
        {isPricingPath && (
          <PricingPage />
        )}

        {/* Blog Page */}
        {isBlogPath && (
          <BlogPage currentPath={currentPath} navigate={navigate} />
        )}

        {/* Help Page */}
        {isHelpPath && (
          <HelpPage />
        )}

        {/* Changelog Page */}
        {isChangelogPath && (
          <ChangelogPage />
        )}

        {/* How It Works Page */}
        {isHowItWorksPath && (
          <HowItWorksPage />
        )}

        {/* Status Page */}
        {isStatusPath && (
          <StatusPage />
        )}
      </main>

      <Footer />
      <UpgradeModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};
