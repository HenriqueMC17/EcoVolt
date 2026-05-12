import React from 'react';
import './StatusBadge.css';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost' | 'glass';
  pulse?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  label, 
  size = 'md', 
  variant = 'outline',
  pulse = false
}) => {
  return (
    <span className={`status-badge status-${status} size-${size} variant-${variant} ${pulse ? 'pulse-badge' : ''}`}>
      <span className="status-dot"></span>
      {label}
    </span>
  );
};


export default StatusBadge;
