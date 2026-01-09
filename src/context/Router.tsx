import React, { useState } from 'react';
import { Route } from '../types';

interface RouterContextType {
  route: Route;
  navigate: (route: Route) => void;
}

export const RouteContext = React.createContext<RouterContextType | null>(null);

export function useRouter() {
  const context = React.useContext(RouteContext);
  if (!context) throw new Error('useRouter must be used within Router');
  return context;
}

export function Router({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>({ page: 'home' });
  
  return (
    <RouteContext.Provider value={{ route, navigate: setRoute }}>
      {children}
    </RouteContext.Provider>
  );
}
