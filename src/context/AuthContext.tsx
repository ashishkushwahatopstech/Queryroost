import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { fetchCurrentUser, logoutUser, upgradePlan } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isUpgradeModalOpen: boolean;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
  handleLogout: () => Promise<void>;
  triggerPlanUpgrade: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);

  const refreshUser = async () => {
    try {
      const data = await fetchCurrentUser();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const openUpgradeModal = () => setIsUpgradeModalOpen(true);
  const closeUpgradeModal = () => setIsUpgradeModalOpen(false);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    window.location.href = '/';
  };

  const triggerPlanUpgrade = async () => {
    try {
      const res = await upgradePlan();
      if (res.success) {
        await refreshUser();
        closeUpgradeModal();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isUpgradeModalOpen,
      openUpgradeModal,
      closeUpgradeModal,
      handleLogout,
      triggerPlanUpgrade,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
