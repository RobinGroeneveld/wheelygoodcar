"use client";

import ScrollStack, { ScrollStackItem } from '../../components/ScrollStack';
import { useTopSellers } from '../../lib/useTopSellers';
import PillNav from '../../components/PillNav';
import { useState } from 'react';


export default function AdminTopCarsPage() {
  const { data, error, isLoading } = useTopSellers();
  const [showAll, setShowAll] = useState(false);

  return (
    <div style={{
      height: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #18181b 0%, #23272f 100%)',
      padding: '2rem 0'
    }}>
      <h1 style={{
        marginTop: 40,
        color: '#f1f5f9',
        textAlign: 'center',
        marginBottom: 32,
        fontSize: 36,
        letterSpacing: 1,
        fontWeight: 800,
        textShadow: '0 2px 16px #0008'
      }}>
        Opvallende aanbieders
      </h1>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ maxWidth: 1100, width: '100%' }}>
          <PillNav
            logo=""
            items={[
               { label: 'Home', href: '/' },
                { label: 'Auto verkopen', href: '/sell-car' },
                { label: "Overzicht alle auto's", href: '/overview' },
                { label: "Mijn auto's", href: '/my-cars' },
                {label: 'admin', href: '/admin/tag-stats'},
                {label: 'Admin Top Cars', href: '/admin-top-cars'},
                { label: 'Inloggen', href: '/login' }
            ]}
            activeHref="/admin-top-cars"
            className="custom-nav"
            ease="power2.easeOut"
            baseColor="#000000"
            pillColor="#ffffff"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#000000"
            initialLoadAnimation={false}
          />
        </div>
      </div>

      {data && data.length > 0 && (
        <ScrollStack>
          {(showAll ? data : data.slice(0, 8)).map((row: any, idx: number) => (
            <ScrollStackItem key={row.id}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 8
              }}>
                {idx === 0 && <span title="#1" style={{fontSize: 28, color: '#ffe066', marginRight: 8, filter: 'drop-shadow(0 0 8px #ffe06688)'}}></span>}
                {idx === 1 && <span title="#2" style={{fontSize: 24, color: '#b4b8c2', marginRight: 8, filter: 'drop-shadow(0 0 8px #b4b8c288)'}}></span>}
                {idx === 2 && <span title="#3" style={{fontSize: 22, color: '#e1a76b', marginRight: 8, filter: 'drop-shadow(0 0 8px #e1a76b88)'}}></span>}
                <h2 style={{
                  fontSize: 24,
                  margin: 0,
                  color: '#f1f5f9',
                  fontWeight: 700,
                  letterSpacing: 0.5
                }}>{row.name || <em>Onbekend</em>}</h2>
              </div>
              <p style={{ color: '#cbd5e1', marginBottom: 12, fontSize: 15 }}>{row.email}</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                <span style={{ background: 'linear-gradient(90deg,#2563eb,#38bdf8)', color: '#fff', borderRadius: 12, padding: '2px 14px', fontWeight: 700, fontSize: 15, boxShadow: '0 2px 8px #2563eb33' }}>
                  Totaal: {row.totalCars}
                </span>
                <span style={{ background: 'linear-gradient(90deg,#059669,#10b981)', color: '#fff', borderRadius: 12, padding: '2px 14px', fontWeight: 700, fontSize: 15, boxShadow: '0 2px 8px #05966933' }}>
                  aantal auto`s verkocht: {row.soldCars}
                </span>
                <span style={{ background: 'linear-gradient(90deg,#f59e42,#fbbf24)', color: '#fff', borderRadius: 12, padding: '2px 14px', fontWeight: 700, fontSize: 15, boxShadow: '0 2px 8px #f59e4233' }}>
                  Views: {row.totalViews}
                </span>
                <span style={{ background: 'linear-gradient(90deg,#6366f1,#818cf8)', color: '#fff', borderRadius: 12, padding: '2px 14px', fontWeight: 700, fontSize: 15, boxShadow: '0 2px 8px #6366f133' }}>
                  Score: {row.score.toFixed(1)}
                </span>
              </div>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>
                Aangemaakt: {new Date(row.createdAt).toLocaleDateString('nl-NL')}
              </span>
            </ScrollStackItem>
          ))}
          {data.length > 8 && !showAll && (
            <ScrollStackItem>
              <a href="/admin-top-cars-overview" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 700, fontSize: 16 }}>Klik hier om de rest te zien</a>
            </ScrollStackItem>
          )}
        </ScrollStack>
      )}
    </div>
  );
}