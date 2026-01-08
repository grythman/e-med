import React from 'react';

const Loading = ({ 
  size = 'medium', 
  text = 'Ачааллаж байна...', 
  fullScreen = false,
  variant = 'spinner' 
}) => {
  const sizes = {
    small: 'w-5 h-5',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  const Spinner = () => (
    <div className="relative">
      <div
        className={`${sizes[size]} border-4 border-primary-100 rounded-full`}
      />
      <div
        className={`${sizes[size]} border-4 border-transparent border-t-primary-600 rounded-full animate-spin absolute top-0 left-0`}
      />
    </div>
  );

  const Dots = () => (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`w-3 h-3 bg-primary-600 rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );

  const Pulse = () => (
    <div className="relative">
      <div className={`${sizes[size]} bg-primary-600 rounded-full animate-ping absolute opacity-75`} />
      <div className={`${sizes[size]} bg-primary-600 rounded-full`} />
    </div>
  );

  const Medical = () => (
    <div className="relative">
      <div className={`${sizes[size]} flex items-center justify-center`}>
        <svg 
          className="w-full h-full text-primary-600 animate-pulse" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      </div>
    </div>
  );

  const variants = {
    spinner: <Spinner />,
    dots: <Dots />,
    pulse: <Pulse />,
    medical: <Medical />,
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {variants[variant]}
      {text && (
        <p className="text-slate-600 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 min-h-[200px]">
      {content}
    </div>
  );
};

// Page Loading Skeleton
export const PageLoading = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="h-40 bg-slate-200 rounded-xl mb-4" />
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Loading;
