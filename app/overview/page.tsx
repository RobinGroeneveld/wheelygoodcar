'use client';

import { useEffect, useState } from 'react';
import BlurText from "../../components/BlurText";
import PillNav from '../../components/PillNav';
import Plasma from '../../components/Plasma';
import { useSession } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import ReactPDF from '@react-pdf/renderer';

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
  sold_at?: string | null;
}

const NAV_ITEMS = [
   { label: 'Home', href: '/' },
  { label: 'Auto verkopen', href: '/sell-car' },
  { label: "Overzicht alle auto's", href: '/overview' },
  { label: "Mijn auto's", href: '/my-cars' },
  {label: 'admin', href: '/admin/tag-stats'},
  {label: 'Admin Top Cars', href: '/admin-top-cars'},
  { label: 'Inloggen', href: '/login' }
];

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

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

  const handleCarClick = async (car: Car) => {
    setSelectedCar(car);
    
    try {
      await fetch(`/api/cars/${car.id}/view`, {
        method: 'POST',
      });
      
      setCars(cars.map(c => 
        c.id === car.id 
          ? { ...c, views: c.views + 1 }
          : c
      ));
      
      setSelectedCar({ ...car, views: car.views + 1 });
    } catch (err) {
      console.error('Error updating views:', err);
    }
  };

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
            <a href="/detail-car">Bekijk details</a>
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
          ) : (
            (() => {
              // Filter out sold cars (where sold_at is not null)
              const activeCars = cars.filter(car => !car.sold_at);
              
              return activeCars.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🚗</div>
                  <p className="text-xl text-white">Nog geen auto's beschikbaar</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {activeCars.map((car) => (
                    <CarCard key={car.id} car={car} onClick={() => handleCarClick(car)} />
                  ))}
                </div>
              );
            })()
          )}
        </main>
      </div>

      {selectedCar && (
        <CarDetailModal car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </>
  );
}

function CarCard({ car, onClick }: { car: Car; onClick: () => void }) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div 
      onClick={onClick}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
    >
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

function CarDetailModal({ car, onClose }: { car: Car; onClose: () => void }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header met close button */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-white/10 bg-slate-900/80 backdrop-blur">
          <h2 className="text-2xl font-bold text-white">
            {car.make} {car.model}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image */}
          {car.image && !imageError ? (
            <img
              src={car.image}
              alt={`${car.make} ${car.model}`}
              className="w-full h-80 object-cover rounded-2xl"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-80 bg-white/10 flex items-center justify-center rounded-2xl">
              <span className="text-8xl">🚗</span>
            </div>
          )}

          {/* Price */}
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
            <p className="text-green-400 text-sm font-semibold mb-1">Prijs</p>
            <p className="text-4xl font-bold text-green-400">
              € {Number(car.price).toLocaleString('nl-NL')}
            </p>
          </div>

          {/* Views Count */}
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
            <p className="text-blue-400 text-sm font-semibold mb-1">Aantal weergaven</p>
            <p className="text-3xl font-bold text-blue-400">
              {car.views} {car.views === 1 ? 'weergave' : 'weergaven'}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Kenteken" value={car.license_plate} />
            <DetailItem label="Bouwjaar" value={car.production_year?.toString() || 'N.v.t.'} />
            <DetailItem label="Kilometerstand" value={`${car.mileage.toLocaleString('nl-NL')} km`} />
            <DetailItem label="Kleur" value={car.color || 'N.v.t.'} />
            <DetailItem label="Deuren" value={car.doors?.toString() || 'N.v.t.'} />
            <DetailItem label="Zitplaatsen" value={car.seats?.toString() || 'N.v.t.'} />
            {car.weight && <DetailItem label="Gewicht" value={`${car.weight} kg`} />}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition-colors mt-4"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
      <p className="text-gray-400 text-xs font-medium mb-1">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}
