"use client";
 
import { useState, useMemo } from "react";
import { signIn, signOut, useSession } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatingLines from "@/components/FloatingLines";
import PillNav from "@/components/PillNav";
 
/*
  Navigation configuration used across the login page.
 
  Keeping this outside the component prevents unnecessary re-creation
  on each render.
*/
 
const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Auto verkopen', href: '/sell-car' },
  { label: "Overzicht alle auto's", href: '/overview' },
  { label: "Mijn auto's", href: '/my-cars' },
  {label: 'admin', href: '/admin/tag-stats'},
  {label: 'Admin Top Cars', href: '/admin-top-cars'},
  {label: 'Admin Dashboard', href: '/admin-dashboard-overview'},
  { label: 'Inloggen', href: '/login' }
];
 
export default function LoginPage() {
 
  /*
    Local state for form handling.
  */
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
   /*
    UI state for error handling and loading indicator.
  */
 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 
  const router = useRouter();
 
  const { data: session } = useSession();
 
 /*
    Memoized background animation component.
 
    useMemo ensures the animation component is not recreated
    on every render, improving performance.
  */
 
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
  ),
  []
);
 
/*
    Handle login form submission.
 
    Steps:
    1. Prevent default form behavior
    2. Reset error state
    3. Show loading indicator
    4. Attempt login via auth client
    5. Redirect on success
*/
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
 
    try {
      const result = await signIn.email({ email, password });
 
      if (result?.error) {
        setError("Login mislukt. Controleer je e-mailadres en wachtwoord.");
      } else {
        router.push("/overview");
      }
    } catch (err) {
      setError("Login mislukt. Controleer je gegevens.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
   /*
    Handle user logout.
 
    After logout, redirect user to homepage.
  */
 
  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };
 
  return (
    <>
      {/* Background animation */}
      {floatingLinesBackground}
 
      <div className="min-h-screen flex flex-col">
 
        {/* Navigation */}
        <header className="pt-8">
          <div className="flex justify-center">
            <PillNav
              logo="/images/logo.png"
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
       
        {/* Main content */}
        <div className="flex-1 flex items-center justify-center">
 
          {/* If user is logged in → show dashboard card */}
          {session?.user ? (
            <div className="max-w-sm w-full p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl text-center space-y-6">
 
              <div className="text-5xl">👋</div>
 
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Hé, {session.user.name}!
                </h2>
                <p className="text-gray-300 mt-1 text-sm">
                  {session.user.email}
                </p>
              </div>
 
              <p className="text-gray-400 text-sm">
                Je bent momenteel ingelogd.
              </p>
 
              <div className="space-y-3">
 
                <button
                  onClick={() => router.push("/overview")}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-xl font-semibold transition-all"
                >
                  Naar overzicht →
 
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full bg-white/10 hover:bg-red-500/30 border border-white/20 hover:border-red-400/50 text-white py-2 rounded-xl font-semibold transition-all"
                >
                  Uitloggen
                </button>
              </div>
            </div>
          ) : (
            /* If user is not logged in → show login form */
            <form
              onSubmit={handleSubmit}
              className="max-w-sm w-full p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl space-y-4"
            >
 
 
              <h2 className="text-2xl font-bold text-white">
                Inloggen
              </h2>
 
              {/* Error message */}
              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
 
              {/* Input fields */}
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
              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white py-2 rounded-xl font-semibold transition-all"
              >
                {loading ? "Bezig met inloggen..." : "Inloggen"}
              </button>
             
              {/* Register link */}
              <p className="text-center text-gray-400 text-sm">
                Nog geen account?{" "}
                <Link href="/register" className="text-cyan-400 hover:underline">
                  Registreer hier
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}