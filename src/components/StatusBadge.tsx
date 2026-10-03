import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'success' | 'warning' | 'danger' | 'info' | 'purple';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'info' }) => {
  const getClassName = () => {
    switch (type) {
      case 'success': return 'badge badge-success';
      case 'warning': return 'badge badge-warning';
      case 'danger': return 'badge badge-danger';
      case 'purple': return 'badge badge-purple';
      default: return 'badge badge-info';
    }
  };

  return <span className={getClassName()}>{status}</span>;
};
