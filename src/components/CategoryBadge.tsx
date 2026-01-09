import React from 'react';
import { Star } from 'lucide-react';

interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const colors: Record<string, string> = {
    Music: 'bg-purple-100 text-purple-700 border-purple-200',
    Technology: 'bg-blue-100 text-blue-700 border-blue-200',
    Art: 'bg-pink-100 text-pink-700 border-pink-200',
    Food: 'bg-orange-100 text-orange-700 border-orange-200',
    Sports: 'bg-green-100 text-green-700 border-green-200',
    Comedy: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  };
  
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${colors[category] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {category}
    </span>
  );
}
