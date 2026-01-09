import React from 'react';

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
          <div className="w-full h-56 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
          <div className="p-6 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
