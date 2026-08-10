import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { UpgradeModal } from './components/common/UpgradeModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ToolsPage } from './pages/ToolsPage';
import { AdminPage } from './pages/AdminPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  // Sync state with browser location changes & history popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  if (currentPath.includes('/auth/callback')) {
    return <AuthCallbackPage />;
  }

  const isLandingPath = currentPath === '/' || currentPath === '';
  const isDashboardPath = currentPath === '/dashboard';
  const isToolsPath = currentPath.startsWith('/tools');
  const isProfilePath = currentPath === '/profile';
  const isAdminPath = currentPath === '/admin';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      <Navbar currentPath={currentPath} navigate={navigate} />
      
      <main className="flex-1">
        {/* Landing Page */}
        {(isLandingPath && !user) && (
          <LandingPage onGoToDashboard={() => navigate('/dashboard')} />
        )}

        {/* Dashboard Page */}
        {(isDashboardPath || (isLandingPath && user)) && (
          <DashboardPage />
        )}

        {/* Tools Page */}
        {isToolsPath && (
          <ToolsPage currentPath={currentPath} navigate={navigate} />
        )}

        {/* Profile Page */}
        {isProfilePath && (
          <ProfilePage />
        )}

        {/* Admin Page */}
        {isAdminPath && (
          <AdminPage />
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
