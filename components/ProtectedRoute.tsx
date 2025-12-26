
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User, Role } from '../types';

interface ProtectedRouteProps {
  user: User | null;
  allowedRoles?: Role[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, allowedRoles, children }) => {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/portal" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect unauthorized staff to member dashboard or home
    return <Navigate to={user.role === 'member' ? '/dashboard' : '/'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
