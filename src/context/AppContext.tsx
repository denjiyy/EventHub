import React, { useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Toast } from '../types';
import { AuthService } from '../services/authService';
import { useProfile } from '../hooks/useAuth';
import { bookingKeys } from '../hooks/useBookings';
import { authKeys } from '../hooks/useAuth';

interface AppContextType {
  toasts: Toast[];
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  isAuthenticated: boolean;
  currentUser: any;
  logout: () => void;
}

export const AppContext = React.createContext<AppContextType | null>(null);

export function useAppData() {
  const queryClient = useQueryClient();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());

  // Fetch user profile using React Query
  const profileQuery = useProfile(isAuthenticated);
  const currentUser = profileQuery.data;

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts((prev: Toast[]) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev: Toast[]) => prev.filter((t: Toast) => t.id !== id));
    }, 4000);
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setIsAuthenticated(false);
    
    // Clear all queries on logout
    queryClient.clear();
    
    addToast('Logged out successfully', 'success');
  }, [addToast, queryClient]);

  // Update authentication state when it changes
  useEffect(() => {
    const authStatus = AuthService.isAuthenticated();
    if (authStatus !== isAuthenticated) {
      setIsAuthenticated(authStatus);
    }
  }, [isAuthenticated]);

  return {
    toasts,
    addToast,
    isAuthenticated,
    currentUser: currentUser || null,
    logout,
  };
}

export function useApp() {
  const context = React.useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}