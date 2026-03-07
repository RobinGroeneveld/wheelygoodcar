"use client";

import { useState, useMemo } from "react";
import { signUp } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatingLines from "@/components/FloatingLines";
import PillNav from "@/components/PillNav";

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Auto verkopen', href: '/sell-car' },
  { label: "Overzicht alle auto's", href: '/overview' },
  { label: "Mijn auto's", href: '/my-cars' },
  { label: 'Inloggen', href: '/login' },
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signUp.email({
        email,
        password,
        name,
      });
      console.log('Registratie resultaat:', result);
      if (result?.error) {
        const msg = result.error.message || result.error.statusText || "Registratie mislukt.";
        setError(msg);
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      setError(err?.message || "Registratie mislukt. Probeer het opnieuw.");
      console.error('Registratie error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {floatingLinesBackground}

      <div className="min-h-screen flex flex-col">
        <header className="pt-8">
          <div className="flex justify-center">
            <PillNav
              logo="/images/logo.png"
              items={NAV_ITEMS}
              activeHref="/register"
              ease="power2.easeOut"
              baseColor="#000000"
              pillColor="#ffffff"
              hoveredPillTextColor="#ffffff"
              pillTextColor="#000000"
              initialLoadAnimation={false}
            />
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="max-w-md w-full p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl space-y-4"
          >
            <h2 className="text-2xl font-bold text-white text-center">Registreren</h2>
            
            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Naam</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Je naam"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="je@email.nl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Wachtwoord</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Telefoonnummer (optioneel)</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="+31 6 12345678"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 text-white py-3 rounded-xl font-semibold transition-all"
            >
              {loading ? "Bezig met registreren..." : "Registreren"}
            </button>

            <p className="text-center text-gray-400 text-sm">
              Al een account?{" "}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
                Log hier in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
