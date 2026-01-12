import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    active:scale-[0.98]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
  `;
  
  const variants = {
    primary: `
      bg-gradient-to-r from-primary-600 to-primary-700
      text-white shadow-md shadow-primary-500/25
      hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-500/30
      focus:ring-primary-500
    `,
    secondary: `
      bg-slate-100 text-slate-700
      hover:bg-slate-200
      focus:ring-slate-500
    `,
    danger: `
      bg-gradient-to-r from-error-500 to-error-600
      text-white shadow-md shadow-error-500/25
      hover:from-error-600 hover:to-error-700
      focus:ring-error-500
    `,
    success: `
      bg-gradient-to-r from-success-500 to-success-600
      text-white shadow-md shadow-success-500/25
      hover:from-success-600 hover:to-success-700
      focus:ring-success-500
    `,
    outline: `
      border-2 border-slate-200 text-slate-700 bg-white
      hover:bg-slate-50 hover:border-slate-300
      focus:ring-slate-500
    `,
    ghost: `
      text-slate-600 bg-transparent
      hover:bg-slate-100
      focus:ring-slate-500
    `,
    link: `
      text-primary-600 bg-transparent underline-offset-4
      hover:underline
      focus:ring-primary-500
    `,
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2.5 text-sm',
    large: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const LoadingSpinner = () => (
    <svg 
      className="animate-spin h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
};

export default Button;
