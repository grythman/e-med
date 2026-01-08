import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  dot = false,
  className = '',
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-primary-100 text-primary-700',
    secondary: 'bg-secondary-100 text-secondary-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700',
    outline: 'bg-transparent border border-slate-200 text-slate-600',
  };

  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-xs',
    large: 'px-3 py-1.5 text-sm',
  };

  const dotColors = {
    default: 'bg-slate-500',
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    outline: 'bg-slate-400',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
};

// Status Badge
export const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: { variant: 'success', label: 'Идэвхтэй' },
    inactive: { variant: 'error', label: 'Идэвхгүй' },
    pending: { variant: 'warning', label: 'Хүлээгдэж байна' },
    completed: { variant: 'success', label: 'Дууссан' },
    draft: { variant: 'default', label: 'Ноорог' },
    published: { variant: 'primary', label: 'Нийтлэгдсэн' },
  };

  const config = statusConfig[status] || { variant: 'default', label: status };

  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
};

// Level Badge
export const LevelBadge = ({ level }) => {
  const levelConfig = {
    beginner: { variant: 'success', label: 'Анхан шат' },
    intermediate: { variant: 'warning', label: 'Дунд шат' },
    advanced: { variant: 'error', label: 'Ахисан шат' },
  };

  const config = levelConfig[level] || { variant: 'default', label: level };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// Role Badge
export const RoleBadge = ({ role }) => {
  const roleConfig = {
    admin: { variant: 'error', label: 'Админ' },
    instructor: { variant: 'primary', label: 'Багш' },
    student: { variant: 'secondary', label: 'Оюутан' },
    user: { variant: 'default', label: 'Хэрэглэгч' },
  };

  const config = roleConfig[role] || { variant: 'default', label: role };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default Badge;

