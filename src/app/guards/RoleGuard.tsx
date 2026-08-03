import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { UserRole } from '@/types/database';

interface RoleGuardProps {
  allowedRoles: UserRole[];
}

export const isRoleAllowed = (role: string | null | undefined, allowedRoles: UserRole[]): boolean => {
  if (!role) return false;
  return allowedRoles.includes(role as UserRole);
};

export const getRedirectPathForRole = (role: string | null | undefined, allowedRoles: UserRole[]): string => {
  if (!role) return '/login';
  if (isRoleAllowed(role, allowedRoles)) return '';
  if (role === 'student') return '/app';
  if (role === 'teacher' || role === 'owner') return '/teacher';
  return '/login';
};

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-txt-muted font-medium">جاري التحقق من الجلسة...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    const redirectPath = getRedirectPathForRole(role, allowedRoles);
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
