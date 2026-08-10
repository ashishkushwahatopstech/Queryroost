import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { RefreshCw } from 'lucide-react';

export const AuthCallbackPage: React.FC = () => {
  const { refreshUser } = useAuth();

  useEffect(() => {
    refreshUser().then(() => {
      window.location.href = '/dashboard';
    });
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
      <h2 className="text-xl font-bold text-white mb-1">Connecting Google Search Console...</h2>
      <p className="text-xs text-gray-400">Exchanging authorization token & initializing D1 user profile.</p>
    </div>
  );
};
