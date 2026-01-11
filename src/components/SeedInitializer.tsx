import React, { useEffect, useState } from 'react';
import { useApp } from '../context/Router';

export function SeedInitializer() {
  const [seeded, setSeeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const hasSeeded = localStorage.getItem('db_seeded');
        if (!hasSeeded) {
          localStorage.setItem('db_seeded', 'true');
          setSeeded(true);
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Seeding error:', err);
      }
    };

    initializeData();
  }, []);

  return null;
}
