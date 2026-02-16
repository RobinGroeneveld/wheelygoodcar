'use client';

import { useState } from "react";
import BlurText from "../../components/BlurText";
import PillNav from '../../components/PillNav';
import FloatingLines from '../../components/FloatingLines';

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

export default function SellCarForm() {
  // State variables
  const [price, setPrice] = useState("");
  const [mileage, setMileage] = useState("");
  const [color, setColor] = useState("");
  const [doors, setDoors] = useState("");
  const [image, setImage] = useState("");
  const [license_plate, setLicense_Plate] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [production_year, setProduction_Year] = useState("");
  const [seats, setSeats] = useState("");
  const [weight, setWeight] = useState("");

  // HandleSubmit functie die data naar API stuurt
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const carData = {
      price,
      mileage,
      color,
      doors,
      image,
      license_plate,
      make,
      model,
      production_year,
      seats,
      weight,
    };

    try {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Auto succesvol toegevoegd! 🚗');
        console.log('Opgeslagen auto:', data.car);
        
        // Reset formulier
        setPrice('');
        setMileage('');
        setColor('');
        setDoors('');
        setImage('');
        setLicense_Plate('');
        setMake('');
        setModel('');
        setProduction_Year('');
        setSeats('');
        setWeight('');
      } else {
        alert(`Fout: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Er is een fout opgetreden bij het versturen');
    }
  };

  return (
    <>
    <div style={{ width: '100%', height: '600px', position: 'relative' }} className="fixed top-0 left-0 w-screen h-screen -z-10">
      <FloatingLines 
        enabledWaves={["top","middle","bottom"]}
        // Array - specify line count per wave; Number - same count for all waves
        lineCount={5}
        // Array - specify line distance per wave; Number - same distance for all waves
        lineDistance={5}
        bendRadius={5}
        bendStrength={-0.5}
        interactive={true}
        parallax={true}
      />
    </div>
    
      <header>
        <div className="flex justify-center gap-8 mt-20">
          <PillNav
            items={[
              { label: 'Home', href: '/' },
              { label: 'Auto verkopen', href: '/sell-car' },
              { label: 'Overzicht alle auto`s', href: '/overview' },
              { label: 'Inloggen', href: '/login' }
            ]}
            activeHref="/sell-car"
            className="custom-nav"
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
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2">Auto verkopen</h2>

          <input 
            type="number"
            placeholder="Prijs (€)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />  

          <input 
            type="number"
            placeholder="Kilometerstand"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            className="w-full p-2 border rounded"
          />  

          <input 
            type="text"
            placeholder="Kleur"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full p-2 border rounded"
          />  

          <input 
            type="number"
            placeholder="Aantal deuren"
            value={doors}
            onChange={(e) => setDoors(e.target.value)}
            className="w-full p-2 border rounded"
          />  

          <input 
            type="text"
            placeholder="Afbeelding URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full p-2 border rounded"
          />  

          <input 
            type="text"
            placeholder="Kenteken"
            value={license_plate}
            onChange={(e) => setLicense_Plate(e.target.value)}
            className="w-full p-2 border rounded"
          />  

          <input 
            type="text"
            placeholder="Merk (bijv. Mercedes)"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />  

          <input 
            type="text"
            placeholder="Model (bijv. C63 AMG)"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />  

          <input 
            type="number"
            placeholder="Bouwjaar"
            value={production_year}
            onChange={(e) => setProduction_Year(e.target.value)}
            className="w-full p-2 border rounded"
          />  

          <input 
            type="number"
            placeholder="Aantal zitplaatsen"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            className="w-full p-2 border rounded"
          />  

          <input 
            type="number"
            placeholder="Gewicht (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-2 border rounded"
          />    

          <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 w-full">
            Auto toevoegen
          </button>
        </form>
      </main>
    </>
  );
}