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

export default function App() {
  const appData = useAppData();

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Initializing app...');
      
      try {
        const hasSeeded = localStorage.getItem('db_seeded');
        console.log('📦 Seeded status:', hasSeeded || 'not seeded');
        
        if (!hasSeeded) {
          console.log('🌱 Starting database seed...');
          try {
            await appData.seedDatabase();
            localStorage.setItem('db_seeded', 'true');
            console.log('✅ Database seeded successfully!');
          } catch (seedError: any) {
            console.error('❌ Seeding failed:', seedError.message);
            console.log('⚠️  Attempting to fetch existing data anyway...');
          }
        } else {
          console.log('📚 Loading existing events...');
        }
        
        // Always try to fetch events
        const events = await appData.fetchEvents();
        console.log(`📋 Loaded ${events.length} events`);
        
        if (events.length === 0) {
          console.warn('⚠️  No events found! You may need to seed the database.');
          console.log('💡 To re-seed: Run localStorage.removeItem("db_seeded") and refresh');
        }
      } catch (error: any) {
        console.error('❌ Error initializing app:', error.message);
        console.error('Full error:', error);
      }
    };

    initializeApp();
  }, []);
  
  return (
    <AppContext.Provider value={appData}>
      <BrowserRouter>
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