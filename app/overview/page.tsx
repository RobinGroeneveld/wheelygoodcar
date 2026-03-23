'use client';

import { useEffect, useState } from 'react';
import BlurText from "../../components/BlurText";
import PillNav from '../../components/PillNav';
import Plasma from '../../components/Plasma';
import { useSession } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

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

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Auto verkopen', href: '/sell-car' },
  { label: "Overzicht alle auto's", href: '/overview' },
  { label: "Mijn auto's", href: '/my-cars' },
  { label: 'Inloggen', href: '/login' },
];

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/cars/all'); 
        const data = await response.json();

        if (Array.isArray(data)) {
          setCars(data);
        } else {
          setError(data.error || 'Kon auto\'s niet laden.');
          setCars([]);
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Er is een fout opgetreden.');
      } finally {
        setLoading(false);  
      }
    };
    fetchCars();
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen -z-10">
        <Plasma
          color="#0D5757"
          speed={0.6}
          direction="forward"
          scale={1.1}
          opacity={0.8}
          mouseInteractive={true}
        />
      </div>

      <div className="min-h-screen flex flex-col">
        <header className="pt-8">
          <div className="flex justify-center">
            <PillNav
              logo="/images/logo.png"
              items={NAV_ITEMS}
              activeHref="/overview"
              ease="power2.easeOut"
              baseColor="#000000"
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
              className="text-4xl font-bold text-white"
            />
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-xl text-white">Laden...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-xl text-red-400">{error}</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🚗</div>
              <p className="text-xl text-white">Nog geen auto's beschikbaar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function CarCard({ car }: { car: Car }) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      {car.image && !imageError ? (
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="w-full h-56 object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-56 bg-white/10 flex items-center justify-center">
          <span className="text-6xl">🚗</span>
        </div>
      )}

      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-1">
          {car.make} {car.model}
        </h2>
        <p className="text-gray-300 mb-4">{car.production_year}</p>

        <div className="mb-4">
          <p className="text-3xl font-bold text-green-400">
            € {Number(car.price).toLocaleString('nl-NL')}
          </p>
          <p className="text-sm text-gray-300 mt-1">
            {car.mileage.toLocaleString('nl-NL')} km
          </p>
        </div>

        <div className="flex gap-3 mb-4 flex-wrap">
          {car.doors && (
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-medium">
              {car.doors} deuren
            </span>
          )}
          {car.seats && (
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-medium">
              {car.seats} zitplaatsen
            </span>
          )}
        </div>

        {car.color && (
          <p className="text-sm text-gray-300 mb-2">
            <span className="font-semibold">Kleur:</span> {car.color}
          </p>
        )}
        <p className="text-xs text-gray-400 mb-4">Kenteken: {car.license_plate}</p>
      </div>
    </div>
  );
}
