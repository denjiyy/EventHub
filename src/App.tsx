import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext, useAppData } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { ToastContainer } from './components/ToastContainer';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { BookingsPage } from './pages/BookingsPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { SeedService } from './services/seedService';
import { useEvents } from './hooks/useEvents';

function AppInitializer() {
  const appData = useAppData();
  const eventsQuery = useEvents();

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Initializing app...');
      
      try {
        const hasSeeded = localStorage.getItem('db_seeded');
        console.log('📦 Seeded status:', hasSeeded || 'not seeded');
        
        if (!hasSeeded) {
          console.log('🌱 Starting database seed...');
          try {
            await SeedService.seedDatabase();
            localStorage.setItem('db_seeded', 'true');
            console.log('✅ Database seeded successfully!');
            
            // Refetch events after seeding
            await eventsQuery.refetch();
          } catch (seedError) {
            console.error('❌ Seeding failed:', seedError.message);
            console.log('⚠️  Attempting to fetch existing data anyway...');
          }
        } else {
          console.log('📚 Data already seeded');
        }
      } catch (error) {
        console.error('❌ Error initializing app:', error.message);
      }
    };

    initializeApp();
  }, [eventsQuery]);

  return null;
}

export default function App() {
  const appData = useAppData();
  
  return (
    <AppContext.Provider value={appData}>
      <BrowserRouter>
        <AppInitializer />
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <ToastContainer />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/create" element={<CreateEventPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
}