'use client';

import { useState, useEffect, useMemo  } from "react";
import { useSession } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import BlurText from "../../components/BlurText";
import PillNav from '../../components/PillNav';
import FloatingLines from '../../components/FloatingLines';

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

function normalizeLicensePlate(input: string): string {
  return input.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

type RdwVehicleResponse = {
  license_plate: string;
  make: string;
  model: string;
  production_year: number | null;
  color: string;
  seats: number | null;
  doors: number | null;
  weight: number | null;
  source: 'RDW';
};

export default function SellCarForm() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [uploading, setUploading] = useState(false);

  const [price, setPrice] = useState("");
  const [mileage, setMileage] = useState("");
  const [color, setColor] = useState("");
  const [doors, setDoors] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [license_plate, setLicense_Plate] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [production_year, setProduction_Year] = useState("");
  const [seats, setSeats] = useState("");
  const [weight, setWeight] = useState("");
  const [rdwLoading, setRdwLoading] = useState(false);
  const [rdwMessage, setRdwMessage] = useState<string | null>(null);

  const floatingLinesBackground = useMemo(() => (
    <div className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none">
      <FloatingLines
        linesGradient={[]}
        enabledWaves={["top", "middle", "bottom"]}
        lineCount={[5, 5, 5]}
        lineDistance={[5, 5, 5]}
        topWavePosition={{ x: 0, y: 0.8, rotate: 0 }}
        middleWavePosition={{ x: 0, y: 0, rotate: 0 }}
        bottomWavePosition={{ x: 2.0, y: -0.7, rotate: -1 }}
        bendRadius={5}
        bendStrength={-0.5}
        interactive={false}
        parallax={false}
      />
    </div>
  ), []);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);


  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Laden...</p>
      </div>
    );
  }


  if (!session?.user) return null;

  const handleLicensePlateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPlate = normalizeLicensePlate(license_plate);

    if (!normalizedPlate) {
      return;
    }

    setLicense_Plate(normalizedPlate);
    setRdwLoading(true);
    setRdwMessage(null);

    try {
      const response = await fetch(`/api/rdw/vehicle?licensePlate=${encodeURIComponent(normalizedPlate)}`);

      if (response.ok) {
        const rdwData = (await response.json()) as RdwVehicleResponse;
        setMake(rdwData.make ?? "");
        setModel(rdwData.model ?? "");
        setProduction_Year(rdwData.production_year ? String(rdwData.production_year) : "");
        setColor(rdwData.color ?? "");
        setSeats(rdwData.seats ? String(rdwData.seats) : "");
        setDoors(rdwData.doors ? String(rdwData.doors) : "");
        setWeight(rdwData.weight ? String(rdwData.weight) : "");
        setRdwMessage('RDW-gegevens zijn alvast ingevuld. Controleer en vul aan waar nodig.');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Kon RDW-gegevens niet ophalen.' }));
        setRdwMessage(errorData.error ?? 'Kon RDW-gegevens niet ophalen. Vul de velden handmatig in.');
      }
    } catch (error) {
      console.error('RDW lookup error:', error);
      setRdwMessage('Kon RDW-gegevens niet ophalen. Vul de velden handmatig in.');
    } finally {
      setRdwLoading(false);
      setStep(2);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Maak preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    let imageUrl = '';

    // Upload afbeelding eerst als er een is
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
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

    const carData = {
      price, mileage, color, doors, 
      image: imageUrl,
      license_plate, make, model, production_year, seats, weight,
    };

    try {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Auto succesvol toegevoegd!');
        setPrice(''); setMileage(''); setColor(''); setDoors('');
        setImage(''); setImageFile(null); setImagePreview(null);
        setLicense_Plate(''); setMake(''); setModel('');
        setProduction_Year(''); setSeats(''); setWeight('');
        setRdwMessage(null);
        setStep(1);
        router.push('/my-cars');
      } else {
        alert(`Fout: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Er is een fout opgetreden bij het versturen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {floatingLinesBackground}
      
      <header>
        <div className="flex justify-center gap-8 mt-20">
          <PillNav
            logo="/images/logo.png"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Auto verkopen', href: '/sell-car' },
              { label: "Overzicht alle auto's", href: '/overview' },
              { label: "Mijn auto's", href: '/my-cars' },
              { label: 'Inloggen', href: '/login' }
            ]}
            activeHref="/sell-car"
            ease="power2.easeOut"
            baseColor="#000000"
            pillColor="#ffffff"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#000000"
            initialLoadAnimation={false}
          />
        </div>
        <div className="flex justify-center mt-10">
          <BlurText
            text="Hier kan je je auto verkopen!"
            delay={200}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-2xl mb-8"
          />
        </div>
      </header>

      <main>
        {step === 1 ? (
          <form onSubmit={handleLicensePlateSubmit} className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Stap 1: Voer je kenteken in</h2>
            <p className="text-gray-600 text-sm mb-6 text-center">
              Vul hieronder het kenteken van je auto in om verder te gaan.
            </p>
            
            <input
              type="text"
              placeholder="Kenteken (bijv. AB-123-CD)"
              value={license_plate}
              onChange={(e) => setLicense_Plate(e.target.value.toUpperCase())}
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-center text-xl font-bold tracking-wider uppercase focus:border-cyan-500 focus:outline-none"
              required
            />

            <button
              type="submit"
              disabled={rdwLoading}
              className="mt-6 bg-cyan-500 text-white px-4 py-3 rounded-lg hover:bg-cyan-600 w-full font-semibold transition-all"
            >
              {rdwLoading ? 'RDW-gegevens ophalen...' : 'Volgende stap →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg space-y-4">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-cyan-500 hover:text-cyan-700 font-medium"
              >
                ← Terug
              </button>
              <h2 className="text-xl font-bold">Stap 2: Auto gegevens</h2>
              <div className="w-16"></div>
            </div>

            <div className="bg-gray-100 p-3 rounded-lg text-center mb-4">
              <p className="text-sm text-gray-500">Kenteken</p>
              <p className="text-xl font-bold tracking-wider">{license_plate}</p>
            </div>

            {rdwMessage && (
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-sm text-cyan-900">
                {rdwMessage}
              </div>
            )}

            <input type="text" placeholder="Merk (bijv. Mercedes)" value={make}
              onChange={(e) => setMake(e.target.value)} className="w-full p-2 border rounded" required />

            <input type="text" placeholder="Model (bijv. C63 AMG)" value={model}
              onChange={(e) => setModel(e.target.value)} className="w-full p-2 border rounded" required />

            <input type="number" placeholder="Prijs (€)" value={price}
              onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded" required />

            <input type="number" placeholder="Kilometerstand" value={mileage}
              onChange={(e) => setMileage(e.target.value)} className="w-full p-2 border rounded" />

            <input type="number" placeholder="Bouwjaar" value={production_year}
              onChange={(e) => setProduction_Year(e.target.value)} className="w-full p-2 border rounded" />

            <input type="text" placeholder="Kleur" value={color}
              onChange={(e) => setColor(e.target.value)} className="w-full p-2 border rounded" />

            <input type="number" placeholder="Aantal deuren" value={doors}
              onChange={(e) => setDoors(e.target.value)} className="w-full p-2 border rounded" />

            <input type="number" placeholder="Aantal zitplaatsen" value={seats}
              onChange={(e) => setSeats(e.target.value)} className="w-full p-2 border rounded" />

            <input type="number" placeholder="Gewicht (kg)" value={weight}
              onChange={(e) => setWeight(e.target.value)} className="w-full p-2 border rounded" />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Foto van je auto</label>
              <div className="flex items-center gap-4">
                <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-cyan-500 transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <span className="text-gray-500">
                    {imageFile ? imageFile.name : 'Kies een afbeelding...'}
                  </span>
                </label>
              </div>
              {imagePreview && (
                <div className="mt-2 relative">
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
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <button type="submit" disabled={uploading} className="bg-cyan-500 text-white px-4 py-3 rounded-lg hover:bg-cyan-600 disabled:bg-cyan-300 w-full font-semibold transition-all">
              {uploading ? 'Bezig met uploaden...' : 'Auto toevoegen'}
            </button>
          </form>
        )}
      </main>
    </>
  );
}