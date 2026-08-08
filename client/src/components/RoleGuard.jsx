import React from 'react';
import { useAuth } from '../context/AuthContext';

const RoleGuard = ({ roles = [], children, fallback = null }) => {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return fallback || (
      <div className="p-6 bg-rose-950/30 border border-rose-800/40 rounded-xl text-center">
        <h4 className="text-rose-400 font-semibold mb-1">Access Restricted</h4>
        <p className="text-sm text-slate-400">
          Your role (<span className="text-slate-200 font-medium">{user?.role}</span>) does not have permission to view or edit this section.
        </p>
      </div>
    );
  }

  return children;
};

export default RoleGuard;
