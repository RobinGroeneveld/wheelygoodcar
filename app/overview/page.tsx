'use client';

import { useEffect, useState } from 'react';
import BlurText from "../../components/BlurText";
import PillNav from '../../components/PillNav';

interface Car {
  id: number;
  license_plate: string;
  make: string;
  model: string;
  price: number;
  mileage: number;
  seats?: number;
  doors?: number;
  production_year?: number;
  weight?: number;
  color?: string;
  image?: string;
  views: number;
  created_at: string;
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnimationComplete = () => {
    // Doe iets na animatie voltooid
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-700">Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header>
        <div className="flex justify-center gap-8 pt-8">
          <PillNav
            items={[
              { label: 'Home', href: '/' },
              { label: 'Auto verkopen', href: '/sell-car' },
              { label: 'Overzicht alle auto`s', href: '/overview' },
              { label: 'Inloggen', href: '/login' }
            ]}
            activeHref="/overview"
            className="custom-nav"
            ease="power2.easeOut"
            baseColor="#B38B6D"
            pillColor="#ffffff"
            hoveredPillTextColor="#000000"
            pillTextColor="#6b7280"
            initialLoadAnimation={false}
          />
        </div>
        <div className="flex justify-center mt-12">
          <BlurText
            text="Ontdek onze auto's!"
            delay={200}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div 
              key={car.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {car.image ? (
                <img 
                  src={car.image} 
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <span className="text-6xl">🚗</span>
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {car.make} {car.model}
                </h2>
                <p className="text-gray-500 mb-4">{car.production_year}</p>
                
                <div className="mb-4">
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    € {car.price.toLocaleString('nl-NL')}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {car.mileage.toLocaleString('nl-NL')} km
                  </p>
                </div>
                
                <div className="flex gap-3 mb-4 flex-wrap">
                  {car.doors && (
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      🚪 {car.doors} deuren
                    </span>
                  )}
                  {car.seats && (
                    <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      💺 {car.seats} zitplaatsen
                    </span>
                  )}
                </div>
                
                {car.color && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Kleur:</span> {car.color}
                  </p>
                )}
                <p className="text-xs text-gray-400 mb-4">
                  Kenteken: {car.license_plate}
                </p>
                
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg">
                  Bekijk details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {cars.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚗</div>
            <p className="text-xl text-gray-500">Nog geen auto's beschikbaar</p>
          </div>
        )}
      </main>
    </div>
  );
}