'use client';

import { useEffect, useState } from 'react';
import BlurText from "../../components/BlurText";
import PillNav from '../../components/PillNav';
import Plasma from '../../components/Plasma';
import Toast from '../../components/Toast';

interface Tag {
  id: number;
  name: string;
  color: string;
}

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
  car_tags?: Array<{ tag: Tag }>;
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

// Main page for displaying all cars
export default function CarsPage() {

  // State for all cars from the database
  const [cars, setCars] = useState<Car[]>([]);

  // Load status for initial fetch
  const [loading, setLoading] = useState(true);

  // Error message for failed fetch
  const [error, setError] = useState<string | null>(null);
  
  // Selected car for detail view (modal)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Search field (make, model, color, license plate)/ Zoekveld (merk, model, kleur, kenteken)
  const [searchQuery, setSearchQuery] = useState('');

  // Maximum price filter
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // Current page number (0-indexed)
  const [currentPage, setCurrentPage] = useState(0);

  // Number of cars per page
  const ITEMS_PER_PAGE = 9;

  // All available tags
  const [allTags, setAllTags] = useState<Tag[]>([]);

  // Selected tags for filtering
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  // Retrieve all cars when the page loads
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/cars/all'); 
        const data = await response.json();

        if (Array.isArray(data)) {
          setCars(data);
          
          const tagsSet = new Map<number, Tag>();
          data.forEach((car: Car) => {
            if (car.car_tags) {
              car.car_tags.forEach((ct) => {
                tagsSet.set(ct.tag.id, ct.tag);
              });
            }
          });
          setAllTags(Array.from(tagsSet.values()));
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

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, maxPrice, selectedTags]);

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

  const getFilteredCars = () => {
    return cars.filter(car => {
      if (car.sold_at) return false; 
    
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          car.make.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          (car.color && car.color.toLowerCase().includes(query)) ||
          car.license_plate.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      if (maxPrice && car.price > maxPrice) return false;
      if (selectedTags.length > 0) {
        const carTagIds = car.car_tags?.map(ct => ct.tag.id) || [];
        const hasSelectedTag = selectedTags.some(tagId => carTagIds.includes(tagId));
        if (!hasSelectedTag) return false;
      }
      return true;
    });
  };

  const getCarGridClass = (carId: number, index: number) => {
    const seed = (carId * 9973) % 100;
    const isFeatured = seed < 20; 
    
    if (isFeatured) {
      return 'ring-1 ring-cyan-400/50';
    }
    return '';
  };

  const getPaginatedCars = () => {
    const filteredCars = getFilteredCars();
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      cars: filteredCars.slice(startIndex, endIndex),
      total: filteredCars.length,
      totalPages: Math.ceil(filteredCars.length / ITEMS_PER_PAGE),
    };
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
            <PillNav
                logo="/images/logo.png"
              items={[
                { label: 'Home', href: '/' },
                { label: 'Auto verkopen', href: '/sell-car' },
                { label: "Overzicht alle auto's", href: '/overview' },
                { label: "Mijn auto's", href: '/my-cars' },
                {label: 'admin', href: '/admin/tag-stats'},
                {label: 'Admin Top Cars', href: '/admin-top-cars'},
                {label: 'Admin Dashboard', href: '/admin-dashboard-overview'},
                { label: 'Inloggen', href: '/login' }
              ]}
              activeHref="/"
              className="custom-nav"
              ease="power2.easeOut"
              baseColor="#000000"
              pillColor="#ffffff"
              hoveredPillTextColor="#ffffff"
              pillTextColor="#000000"
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
          {}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-xl text-white">Laden...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-xl text-red-400">{error}</p>
            </div>
          ) : (
            <>
              {}
              <div className="mb-8 space-y-4">
                {}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Zoeken..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className=" px-6 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:bg-white/20 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Prijsfilter slider */}
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-300 mb-2">
                      Maximale prijs: {maxPrice ? `€ ${Number(maxPrice).toLocaleString('nl-NL')}` : 'Geen limiet'}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="5000"
                      value={maxPrice || 0}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value) || null)}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>
                  {maxPrice && (
                    <button
                      onClick={() => setMaxPrice(null)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
                    >
                      Verwijderen
                    </button>
                  )}
                </div>

                {/* Tag filter */}
                {allTags.length > 0 && (
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Filteren op tag{selectedTags.length > 0 ? `s (${selectedTags.length} geselecteerd)` : 's'}:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => {
                            setSelectedTags(
                              selectedTags.includes(tag.id)
                                ? selectedTags.filter(t => t !== tag.id)
                                : [...selectedTags, tag.id]
                            );
                          }}
                          className={`px-4 py-2 rounded-full font-medium transition-all ${
                            selectedTags.includes(tag.id)
                              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                          }`}
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                    {selectedTags.length > 0 && (
                      <button
                        onClick={() => setSelectedTags([])}
                        className="mt-2 text-sm text-cyan-400 hover:text-cyan-300"
                      >
                        Tags wissen
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Resultaten tonen met paginering */}
              {(() => {
                const { cars: paginatedCars, total, totalPages } = getPaginatedCars();
                
                return total === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-xl text-white">
                      {cars.length === 0 ? 'Nog geen auto\'s beschikbaar' : 'Geen auto\'s gevonden die aan uw zoekcriteria voldoen'}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-300 mb-4">{total} auto's gevonden</p>
                    
                    {/* Autokaarten grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-max mb-8">
                      {paginatedCars.map((car, index) => (
                        <CarCard 
                          key={car.id} 
                          car={car} 
                          onClick={() => handleCarClick(car)}
                          gridClass={getCarGridClass(car.id, index)}
                        />
                      ))}
                    </div>

                    {/* Paginering */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-3 mt-8 p-6 bg-white/5 rounded-xl">
                      
                        <div className="flex gap-2">
                          {Array.from({ length: totalPages }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i)}
                              className={`w-12 h-12 rounded-lg font-bold transition-colors text-lg ${
                                currentPage === i
                                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                                  : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pagina indicator */}
                    <div className="text-center mt-4 text-gray-400 text-sm">
                      Pagina {currentPage + 1} van {totalPages}
                    </div>
                  </>
                );
              })()}
            </>
          )}
        </main>
      </div>

      {selectedCar && (
        <CarDetailModal car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </> 
  );
}

function CarCard({ car, onClick, gridClass }: { car: Car; onClick: () => void; gridClass?: string }) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div 
      onClick={onClick}
      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer ${gridClass || ''}`}
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
        {car.car_tags && car.car_tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {car.car_tags.map((carTag) => (
            <span
              key={carTag.tag.id}
              className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500 text-white"
            >
              {carTag.tag.name}
            </span>
          ))}
        </div>
      )}
        <p className="text-xs text-gray-400 mb-4">Kenteken: {car.license_plate}</p>
      </div>
    </div>
  );
}

function CarDetailModal({ car, onClose }: { car: Car; onClose: () => void }) {
  const [imageError, setImageError] = useState(false);
  const [showViewsToast, setShowViewsToast] = useState(false);

  useEffect(() => {
    // Toon toast na 10 seconden
    const timer = setTimeout(() => {
      setShowViewsToast(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismissToast = () => {
    setShowViewsToast(false);
  };

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

      {/* Views Toast - toont na 10 seconden */}
      {showViewsToast && (
        <Toast
          message={`${car.views} ${car.views === 1 ? 'klant heeft' : 'klanten hebben'} deze auto vandaag bekeken`}
          autoDismiss={6000}
          onDismiss={handleDismissToast}
        />
      )}
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
