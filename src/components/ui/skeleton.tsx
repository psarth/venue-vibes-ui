import { cn } from "@/lib/utils";
import React from 'react';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

const SkeletonVenueCard: React.FC = () => {
  return (
    <article className="bg-white rounded-[16px] overflow-hidden animate-pulse">
      <div className="w-full aspect-[16/9] bg-slate-100" />
      <div className="px-4 pt-3 pb-4">
        <div className="h-5 bg-slate-100 rounded w-3/4 mb-3" />
        <div className="h-3 bg-slate-100 rounded w-1/2 mb-3" />
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 bg-slate-100 rounded w-28" />
            <div className="h-3 bg-slate-100 rounded w-20" />
          </div>
          <div className="h-10 w-24 bg-slate-100 rounded" />
        </div>
      </div>
    </article>
  );
};

export { Skeleton, SkeletonVenueCard };
