'use client';

import { useEffect, useState, useMemo } from 'react';
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
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [deletingCarId, setDeletingCarId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const plasmaBackground = useMemo(() => (
    <div className="fixed top-0 left-0 w-screen h-screen -z-10">
      <Plasma
        color="#0D5757"
        speed={0.6}
        direction="forward"
        scale={1.1}
        opacity={0.8}
        mouseInteractive={false}
      />
    </div>
  ), []);

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);


  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
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

  useEffect(() => {
    if (!session) return;
    fetchCars();
  }, [session]);

  const handleDelete = async (carId: number) => {
    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCars(cars.filter(car => car.id !== carId));
        setDeletingCarId(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Kon auto niet verwijderen');
      }
    } catch (err) {
      console.error('Error deleting car:', err);
      alert('Er is een fout opgetreden bij het verwijderen.');
    }
  };

  const handleSaveEdit = async (updatedCar: Car) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/cars/${updatedCar.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCar),
      });

      if (response.ok) {
        const data = await response.json();
        setCars(cars.map(car => car.id === updatedCar.id ? data.car : car));
        setEditingCar(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Kon auto niet bijwerken');
      }
    } catch (err) {
      console.error('Error updating car:', err);
      alert('Er is een fout opgetreden bij het bijwerken.');
    } finally {
      setSaving(false);
    }
  };

   

  if (isPending || !session) {
    return (
      <>
        {plasmaBackground}
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-white">Laden...</p>
        </div>
      </>
    );
  }

  return (
    <>
      {plasmaBackground}

      {}
      {editingCar && (
        <EditCarModal
          car={editingCar}
          onSave={handleSaveEdit}
          onClose={() => setEditingCar(null)}
          saving={saving}
        />
      )}

      {}
      {deletingCarId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Auto verwijderen?</h3>
            <p className="text-gray-300 mb-6">
              Weet je zeker dat je deze auto wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingCarId(null)}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl font-semibold transition-all"
              >
                Annuleren
              </button>
              <button
                onClick={() => handleDelete(deletingCarId)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-all"
              >
                Verwijderen
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen flex flex-col">
        <header className="pt-8">
          <div className="flex justify-center">
            <PillNav
              logo="/images/logo.png"
              items={NAV_ITEMS}
              activeHref="/my-cars"
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
              text="Mijn auto's"
              delay={200}
              animateBy="words"
              direction="top"
              className="text-4xl font-bold text-white"
            />
          </div>
          <div className="flex justify-center mt-2">
            <p className="text-gray-300">
              Welkom terug, {session.user?.name || 'gebruiker'}!
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              <p className="text-xl text-white mt-4">Auto's laden...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-xl text-red-400">{error}</p>
            </div>
          ) : cars.length === 0 ? (
        
              <button
                onClick={() => router.push('/sell-car')}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Eerste auto toevoegen →
              </button>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center">
                <p className="text-white text-lg">
                  <span className="font-bold">{cars.length}</span> {cars.length === 1 ? 'auto' : 'auto\'s'}
                </p>
                <button
                  onClick={() => router.push('/sell-car')}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-xl font-semibold transition-all"
                >
                  + Nieuwe auto
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cars.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    onEdit={() => setEditingCar(car)}
                    onDelete={() => setDeletingCarId(car.id)}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}

function EditCarModal({
  car,
  onSave,
  onClose,
  saving,
}: {
  car: Car;
  onSave: (car: Car) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState<Car>(car);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(car.image || null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = formData.image;

  
    if (imageFile) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          alert(`Upload fout: ${uploadData.error}`);
          setUploading(false);
          return;
        }

        imageUrl = uploadData.url;
      } catch (error) {
        console.error('Upload error:', error);
        alert('Er is een fout opgetreden bij het uploaden van de afbeelding');
        setUploading(false);
        return;
      }
    }

    setUploading(false);
    onSave({ ...formData, image: imageUrl });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full my-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Auto bewerken</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Merk</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Kenteken</label>
              <input
                type="text"
                name="license_plate"
                value={formData.license_plate}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Prijs (€)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Kilometerstand</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bouwjaar</label>
              <input
                type="number"
                name="production_year"
                value={formData.production_year || ''}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Kleur</label>
              <input
                type="text"
                name="color"
                value={formData.color || ''}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Deuren</label>
              <input
                type="number"
                name="doors"
                value={formData.doors || ''}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Zitplaatsen</label>
              <input
                type="number"
                name="seats"
                value={formData.seats || ''}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Gewicht (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight || ''}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Foto van je auto</label>
            
            {imagePreview && (
              <div className="mb-3 relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    setFormData(prev => ({ ...prev, image: undefined }));
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
            
            <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-cyan-500 transition-colors bg-white/5">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="text-gray-400">
                {imageFile ? `${imageFile.name}` : '📷 Nieuwe afbeelding kiezen...'}
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl font-semibold transition-all"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 text-white py-3 rounded-xl font-semibold transition-all"
            >
              {uploading ? 'Uploaden...' : saving ? 'Opslaan...' : 'Opslaan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CarCard({
  car,
  onEdit,
  onDelete,
}: {
  car: Car;
  onEdit: () => void;
  onDelete: () => void;
}) {
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

        <div className="flex gap-3 mb-2">
          <button
            onClick={onEdit}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-semibold transition-all"
          >
            Bewerken
          </button>
          <button
            onClick={onDelete}
            className="flex-1 bg-red-500/80 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-all"
          >
            Verwijderen
          </button>
        </div>
        <a
          href={`/api/cars/${car.id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white/20 hover:bg-cyan-500 text-cyan-900 hover:text-white text-center py-2 rounded-xl font-semibold transition-all mt-2"
          download={`auto-${car.license_plate}.pdf`}
        >
          Download PDF
        </a>
      </div>
    </div>
  );
}