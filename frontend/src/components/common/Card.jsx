import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'medium',
  onClick,
  ...props
}) => {
  const paddings = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  const baseClasses = 'bg-white rounded-2xl shadow-soft border border-slate-100';
  const hoverClasses = hover 
    ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer' 
    : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${paddings[padding]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`border-b border-slate-100 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-slate-900 ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-slate-500 mt-1 ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`border-t border-slate-100 pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

export default Card;

