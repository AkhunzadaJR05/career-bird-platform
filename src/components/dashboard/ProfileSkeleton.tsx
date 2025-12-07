"use client";

import React from "react";

export default function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-48 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-700/50"></div>

      {/* Profile Card Skeleton */}
      <div className="relative -mt-24 mb-8">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-start gap-6">
            {/* Avatar Skeleton */}
            <div className="w-32 h-32 rounded-full bg-slate-700/50 border-4 border-white/10"></div>

            {/* Name and Headline Skeleton */}
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-slate-700/50 rounded w-64"></div>
              <div className="h-6 bg-slate-700/50 rounded w-80"></div>
            </div>

            {/* Button Skeleton */}
            <div className="h-10 bg-slate-700/50 rounded-lg w-40"></div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
        {/* Tab Buttons Skeleton */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          <div className="h-10 bg-slate-700/50 rounded w-20"></div>
          <div className="h-10 bg-slate-700/50 rounded w-24"></div>
          <div className="h-10 bg-slate-700/50 rounded w-20"></div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-slate-700/50 rounded w-24"></div>
          <div className="h-32 bg-slate-700/50 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

