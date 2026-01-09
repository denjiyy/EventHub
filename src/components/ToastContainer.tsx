import React from 'react';
import { Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ToastContainer() {
  const { toasts } = useApp();
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-6 py-4 rounded-xl shadow-2xl backdrop-blur-xl border transform transition-all duration-300 animate-slide-in max-w-md ${
            toast.type === 'success' 
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900' 
              : toast.type === 'error'
              ? 'bg-rose-50/90 border-rose-200 text-rose-900'
              : 'bg-blue-50/90 border-blue-200 text-blue-900'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && <Check className="w-5 h-5 text-emerald-600" />}
            <p className="font-medium">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
