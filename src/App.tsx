import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { UpgradeModal } from './components/common/UpgradeModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ToolsPage } from './pages/ToolsPage';
import { AdminPage } from './pages/AdminPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'landing' | 'dashboard' | 'tools' | 'admin'>('landing');

  // Handle URL path client routing
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/dashboard')) {
      setActiveTab('dashboard');
    } else if (path.includes('/tools')) {
      setActiveTab('tools');
    } else if (path.includes('/admin')) {
      setActiveTab('admin');
    } else if (user) {
      setActiveTab('dashboard');
    }
  }, [user]);

  if (window.location.pathname.includes('/auth/callback')) {
    return <AuthCallbackPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 selection:bg-emerald-500 selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1">
        {activeTab === 'landing' && !user && (
          <LandingPage onGoToDashboard={() => setActiveTab('dashboard')} />
        )}

        {(activeTab === 'dashboard' || (activeTab === 'landing' && user)) && (
          <DashboardPage />
        )}

        {activeTab === 'tools' && (
          <ToolsPage />
        )}

        {activeTab === 'admin' && (
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
