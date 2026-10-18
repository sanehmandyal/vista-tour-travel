import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-xl ${className}`}
      {...props}
    />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 shadow-soft border border-slate-100 flex flex-col gap-3">
    <Skeleton className="h-48 w-full rounded-xl" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-8 w-1/4 rounded-lg" />
    </div>
  </div>
);

export default Skeleton;
