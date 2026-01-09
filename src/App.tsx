import React from 'react';
import { AppContext, useAppData } from './context/AppContext';
import { Router } from './context/Router';
import { Navigation } from './components/Navigation';
import { ToastContainer } from './components/ToastContainer';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { BookingsPage } from './pages/BookingsPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { useRouter } from './context/Router';

function AppContent() {
  const { route } = useRouter();
  
  return (
    <>
      {route.page === 'home' && <HomePage />}
      {route.page === 'events' && <EventsPage />}
      {route.page === 'event-detail' && <EventDetailPage eventId={route.id} />}
      {route.page === 'bookings' && <BookingsPage />}
      {route.page === 'create' && <CreateEventPage />}
    </>
  );
}

export default function App() {
  const appData = useAppData();
  
  return (
    <AppContext.Provider value={appData}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <ToastContainer />
          <AppContent />
        </div>
      </Router>
    </AppContext.Provider>
  );
}
