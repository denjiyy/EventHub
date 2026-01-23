import React, { useEffect, useState } from 'react';
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
  const [seedStatus, setSeedStatus] = useState('idle');

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Initializing app...');
      
      const hasSeeded = localStorage.getItem('db_seeded');
      console.log('📦 Seeded status:', hasSeeded || 'not seeded');
      
      let needsSeeding = !hasSeeded;
      
      if (hasSeeded) {
        console.log('🔍 Verifying existing data...');
        try {
          const existingEvents = await eventsQuery.refetch();
          if (!existingEvents.data || existingEvents.data.length === 0) {
            console.log('⚠️  No events found despite seeded flag. Will re-seed.');
            needsSeeding = true;
            localStorage.removeItem('db_seeded');
          } else {
            console.log(`✅ Found ${existingEvents.data.length} existing events`);
          }
        } catch (error) {
          console.log('⚠️  Could not verify events. Will attempt seeding.');
          needsSeeding = true;
          localStorage.removeItem('db_seeded');
        }
      }
      
      if (needsSeeding) {
        console.log('🌱 Starting database seed...');
        setSeedStatus('seeding');
        
        try {
          const result = await SeedService.seedDatabase();
          
          if (result.created > 0 || result.skipped > 0) {
            localStorage.setItem('db_seeded', 'true');
            console.log('✅ Database seeded successfully!', result);
            setSeedStatus('done');
            
            await new Promise(resolve => setTimeout(resolve, 500));
            await eventsQuery.refetch();
            
            appData.addToast(
              `Database seeded! Created ${result.created} events`,
              'success'
            );
          } else {
            throw new Error('No events were created or found');
          }
        } catch (seedError) {
          console.error('❌ Seeding failed:', seedError.message);
          setSeedStatus('error');
          localStorage.removeItem('db_seeded');
          appData.addToast(
            `Seeding failed: ${seedError.message}. Check console for details.`,
            'error'
          );
        }
      } else {
        console.log('✅ Database already seeded');
        setSeedStatus('done');
      }
    };

    initializeApp();
  }, []);

  if (seedStatus === 'seeding') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center z-50">
        <div className="text-center text-white">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Setting up your database...</h2>
          <p className="text-violet-200">This will only happen once</p>
        </div>
      </div>
    );
  }

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