"use client";

import { useEffect, useState } from "react";
import PillNav from "../../components/PillNav";
import { useSession } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  const { data: session, isLoading } = useSession();
  const router = useRouter();

  async function fetchData() {
    try {
      const res = await fetch("/api/dashboard");

      if (!res.ok) {
        throw new Error("Kon dashboard data niet ophalen");
      }

      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (
      !isLoading &&
      (!session ||
        !session.user ||
        session.user.email !== "admin@wheelygoodcars.nl")
    ) {
      router.replace("/login");
    }
  }, [isLoading, session, router]);

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <main className="p-8 text-white bg-slate-950 min-h-screen">
        Bezig met laden...
      </main>
    );
  }

  if (
    !session ||
    !session.user ||
    session.user.email !== "admin@wheelygoodcars.nl"
  ) {
    return null;
  }

  if (!data) {
    return (
      <main className="p-8 text-white bg-slate-950 min-h-screen">
        Loading...
      </main>
    );
  }

  const chartData = [
    { name: "Auto's", value: data.totalCars },
    { name: "Verkocht", value: data.soldCars },
    { name: "Vandaag", value: data.carsToday },
    { name: "Aanbieders", value: data.totalSellers },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <header className="pt-20">
        <div className="flex justify-center gap-8 mb-8">
          <PillNav
            logo="/images/logo.png"
            items={[
              { label: "Home", href: "/" },
              { label: "Auto verkopen", href: "/sell-car" },
              { label: "Overzicht alle auto's", href: "/overview" },
              { label: "Mijn auto's", href: "/my-cars" },
              { label: "Admin", href: "/admin/tag-stats" },
              { label: "Admin Top Cars", href: "/admin-top-cars" },
              {
                label: "Admin Dashboard",
                href: "/admin-dashboard-overview",
              },
              { label: "Inloggen", href: "/login" },
            ]}
            activeHref="/admin-dashboard-overview"
            className="custom-nav"
            ease="power2.easeOut"
            baseColor="#030712"
            pillColor="#ffffff"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#000000"
            initialLoadAnimation={false}
          />
        </div>
      </header>

      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6">
          Auto Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card title="Totaal auto's" value={data.totalCars} />
          <Card title="Verkocht" value={data.soldCars} />
          <Card title="Vandaag toegevoegd" value={data.carsToday} />
          <Card title="Aanbieders" value={data.totalSellers} />
          <Card title="Views totaal" value={data.totalViews} />
          <Card
            title="Gem. auto's per aanbieder"
            value={Number(data.avgCarsPerSeller).toFixed(2)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
          <div className="bg-gray-900 p-4 rounded-xl">
            <h2 className="mb-4 text-lg font-semibold">
              Overzicht
            </h2>

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />

                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;

                    const item = payload[0].payload;

                    return (
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
                        <p className="font-semibold text-white">
                          {item.name}
                        </p>

                        <p className="text-blue-400 text-lg">
                          {item.value}
                        </p>
                      </div>
                    );
                  }}
                />

                <Bar
                  dataKey="value"
                  fill="#4f46e5"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900 p-4 rounded-xl">
            <h2 className="mb-4 text-lg font-semibold">
              Realtime
            </h2>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData.map((d) => ({
                  ...d,
                  value: d.value + Math.random() * 5,
                }))}
              >
                <XAxis dataKey="name" />
                <YAxis />

                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;

                    const item = payload[0].payload;

                    return (
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
                        <p className="font-semibold text-white">
                          {item.name}
                        </p>

                        <p className="text-green-400 text-lg">
                          {Math.round(item.value)}
                        </p>
                      </div>
                    );
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-2 text-lg font-semibold">
            Verkoop ratio
          </h2>

          <ProgressBar
            value={
              data.totalCars > 0
                ? (data.soldCars / data.totalCars) * 100
                : 0
            }
          />
        </div>
      </main>
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl">
      <div className="text-gray-400">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
      <div
        className="bg-green-500 h-4 rounded-full transition-all duration-500"
        style={{
          width: `${Math.min(value, 100)}%`,
        }}
      />
    </div>
  );
}