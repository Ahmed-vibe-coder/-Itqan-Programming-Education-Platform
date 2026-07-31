import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

export const SetupGuard: React.FC = () => {
  const { hasOwner, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-txt-muted font-medium">جاري فحص إعداد المنصة...</span>
        </div>
      </div>
    );
  }

  // If system already has an owner, /setup is permanently unavailable
  if (hasOwner) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
