"use client";

import { useState } from "react";
import { signIn } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatingLines from "@/components/FloatingLines";
import PillNav from "@/components/PillNav";

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Auto verkopen', href: '/sell-car' },
  { label: "Overzicht alle auto's", href: '/overview' },
  { label: 'Inloggen', href: '/login' },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn.email({ email, password });
      router.push("/overview");
    } catch (err) {
      setError("Login mislukt. Controleer je gegevens.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen -z-10">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={5}
          lineDistance={5}
          bendRadius={5}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
      </div>

      <div className="min-h-screen flex flex-col">
        <header className="pt-8">
          <div className="flex justify-center">
            <PillNav
              items={NAV_ITEMS}
              activeHref="/login"
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
          <form onSubmit={handleSubmit} className="max-w-sm w-full p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl space-y-4">
            <h2 className="text-2xl font-bold text-white">Inloggen</h2>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <div className="space-y-3">
              <input
                type="email"
                placeholder="E-mailadres"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
              />
              <input
                type="password"
                placeholder="Wachtwoord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white py-2 rounded-xl font-semibold transition-all"
            >
              {loading ? "Bezig met inloggen..." : "Inloggen"}
            </button>

            <p className="text-center text-gray-400 text-sm">
              Nog geen account?{" "}
              <Link href="/register" className="text-cyan-400 hover:underline">
                Registreer hier
              </Link>
            </p>
            
          </form>
          
        </div>
      </div>
    </>
  );
}