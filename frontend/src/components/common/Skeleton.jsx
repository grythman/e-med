import React from 'react';

/**
 * Skeleton component for loading states
 */
const Skeleton = ({ className = '', variant = 'rectangular', animation = 'shimmer' }) => {
  const baseClasses = animation === 'shimmer' ? 'skeleton-shimmer' : 'skeleton';
  
  const variantClasses = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};

/**
 * Course Card Skeleton
 */
export const CourseCardSkeleton = () => (
  <div className="card p-0 overflow-hidden">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-5 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  </div>
);

/**
 * Lesson Card Skeleton
 */
export const LessonCardSkeleton = () => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100">
    <Skeleton className="w-12 h-12 rounded-full" variant="circular" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <Skeleton className="h-8 w-16 rounded-lg" />
  </div>
);

/**
 * User Row Skeleton
 */
export const UserRowSkeleton = () => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100">
    <Skeleton className="w-10 h-10 rounded-full" variant="circular" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-48" />
    </div>
    <Skeleton className="h-6 w-16 rounded-full" />
    <Skeleton className="h-8 w-20 rounded-lg" />
  </div>
);

/**
 * Table Row Skeleton
 */
export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="border-b border-slate-100">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

/**
 * Stats Card Skeleton
 */
export const StatsCardSkeleton = () => (
  <div className="card p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="w-14 h-14 rounded-full" variant="circular" />
    </div>
  </div>
);

/**
 * Profile Skeleton
 */
export const ProfileSkeleton = () => (
  <div className="card p-8">
    <div className="flex items-center gap-6 mb-8">
      <Skeleton className="w-24 h-24 rounded-full" variant="circular" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

/**
 * Certificate Skeleton
 */
export const CertificateSkeleton = () => (
  <div className="card overflow-hidden">
    <Skeleton className="h-32 w-full rounded-none" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  </div>
);

export default Skeleton;

