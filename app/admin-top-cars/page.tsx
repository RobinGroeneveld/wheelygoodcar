// Ensures that this page is executed in the browser. This is necessary because React hooks are used.
"use client";
 
// Component that displays cards stacked on top of each other with a scroll animation.
import ScrollStack, { ScrollStackItem } from '../../components/ScrollStack';
 
// Custom hook that retrieves data from the best sellers.
import { useTopSellers } from '../../lib/useTopSellers';
 
// Navigation bar.
import PillNav from '../../components/PillNav';
 
// React hook for saving local state.
import { useState } from 'react';
 
 
export default function AdminTopCarsPage() {
 
    /*
 
      useTopSellers() retrieves data from the backend.
 
      The hook returns:
 
      - data -> the received data
      - error -> any error during retrieval
      - isLoading -> indicates whether the request is still in progress
 
      React will automatically re-render as soon as the data is available.
 
    */
 
  const { data, error, isLoading } = useTopSellers();
 
    /*
 
      State used to determine how many results are visible.
 
      false -> only the first 8 providers
      true -> all providers
 
      useState ensures that the component is re-rendered
      as soon as the value changes.
    */
 
  const [showAll, setShowAll] = useState(false);
 
  return (
   
    /*
      Main container.
 
      height:100vh
      -> always fills the full height of the browser window.
 
      overflow:hidden
      -> prevents the browser from scrolling automatically.
 
      ScrollStack controls the scrolling functionality.
    */
 
    <div
    style={{
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #18181b 0%, #23272f 100%)',
        padding: '2rem 0'
      }}
    >
 
      <h1
      style={{
          marginTop: 40,
          color: '#f1f5f9',
          textAlign: 'center',
          marginBottom: 32,
          fontSize: 36,
          letterSpacing: 1,
          fontWeight: 800,
          textShadow: '0 2px 16px #0008'
        }}
      >
        Opvallende aanbieders
      </h1>
 
 
      {/* Top navigation */}
      <header className="pt-20">
          <div className="flex justify-center gap-8">
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
                  activeHref="/admin/tag-stats"
                  className="custom-nav"
                  ease="power2.easeOut"
                  baseColor="#000000"
                  pillColor="#ffffff"
                  hoveredPillTextColor="#ffffff"
                  pillTextColor="#000000"
                  initialLoadAnimation={false}
              />
          </div>
      </header>
     
      {/*
 
        The ScrollStack is displayed only when data exists and contains at least one result.
 
        This prevents React from attempting to iterate over an empty
        array or null value.
      */}
 
      {data && data.length > 0 && (
        <ScrollStack>
                   
          {/*
 
            showAll determines how many cards are displayed.
 
            false -> data.slice(0,8)
 
            true -> entire array
 
            map() turns every object in the array into a React component.
          */}
 
          {(showAll ? data : data.slice(0, 8)).map((row: any, idx: number) => (
           
            /*
 
              Every ScrollStackItem receives a unique key.
 
              React uses this key to efficiently determine
              which parts need to be re-rendered.
 
            */
 
            <ScrollStackItem key={row.id}>
              <div
              style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 8
                }}
              >
                {/*
 
                The index (idx) indicates the position in the array.
 
                This visually distinguishes the first three providers.
 
              */}
 
                {idx === 0 &&(
                  <span
                  title="#1"
                  style={{fontSize: 28, color: '#ffe066',
                    marginRight: 8,
                    filter: 'drop-shadow(0 0 8px #ffe06688)'
                  }}
                  ></span>
                )}
 
                {idx === 1 &&(
                   <span
                   title="#2"
                   style={{fontSize: 24, color: '#b4b8c2',
                    marginRight: 8,
                    filter: 'drop-shadow(0 0 8px #b4b8c288)'
                  }}
                  ></span>
                )}
                {idx === 2 &&(
                  <span title="#3"
                  style={{fontSize: 22, color: '#e1a76b',
                  marginRight: 8,
                  filter: 'drop-shadow(0 0 8px #e1a76b88)'
                  }}
                  ></span>
                )}
 
                {/* Username from the user */}
                <h2 style={{
                  fontSize: 24,
                  margin: 0,
                  color: '#f1f5f9',
                  fontWeight: 700,
                  letterSpacing: 0.5
                }}
              >
                {row.name || <em>Onbekend</em>}
                </h2>
              </div>
 
             
              {/* Email address */}
              <p
                style={{
                  color: '#cbd5e1',
                  marginBottom: 12,
                  fontSize: 15
                }}
              >
                {row.email}
              </p>
 
             
              {/* Statistics */}
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                  marginBottom: 8
                  }}
                >
                 
                {/* Total number of cars */}
                <span style={{ background: 'linear-gradient(90deg,#2563eb,#38bdf8)', color: '#fff', borderRadius: 12, padding: '2px 14px', fontWeight: 700, fontSize: 15, boxShadow: '0 2px 8px #2563eb33' }}>
                  Totaal: {row.totalCars}
                </span>
                 
                {/* Sold cars */}
                <span style={{ background: 'linear-gradient(90deg,#059669,#10b981)', color: '#fff', borderRadius: 12, padding: '2px 14px', fontWeight: 700, fontSize: 15, boxShadow: '0 2px 8px #05966933' }}>
                  aantal auto`s verkocht: {row.soldCars}
                </span>
               
                {/* Total number of viewed pages */}
                <span style={{ background: 'linear-gradient(90deg,#f59e42,#fbbf24)', color: '#fff', borderRadius: 12, padding: '2px 14px', fontWeight: 700, fontSize: 15, boxShadow: '0 2px 8px #f59e4233' }}>
                  Views: {row.totalViews}
                </span>
               
                {/*
 
                  toFixed(1) rounds the score to one decimal place.
 
                  For example:
 
                  14.6789 -> 14.7
 
                */}
 
                <span style={{ background: 'linear-gradient(90deg,#6366f1,#818cf8)', color: '#fff', borderRadius: 12, padding: '2px 14px', fontWeight: 700, fontSize: 15, boxShadow: '0 2px 8px #6366f133' }}>
                  Score: {row.score.toFixed(1)}
                </span>
 
              </div>
             
              {/*
 
                createAt is usually an ISO date from the database.
 
                new Date() converts this string into a JavaScript Date object.
 
                toLocaleDateString('nl-NL')
                ensures that the date is displayed
                according to the Dutch format.
 
              */}
              <span style={{ fontSize: 12, color: '#94a3b8' }}>
                Aangemaakt: {new Date(row.createdAt).toLocaleDateString('nl-NL')}
              </span>
 
            </ScrollStackItem>
          ))}
 
        {/*
 
          When there are more than eight results and showAll is still false,
 
          an extra card is displayed allowing the user to navigate to
          the complete overview.
 
        */}
 
          {data.length > 8 && !showAll && (
            <ScrollStackItem>
              <a
              href="/admin-top-cars-overview"
              style={{
                color: '#38bdf8',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: 16
                }}
              >
                Klik hier om de rest te zien
                </a>
            </ScrollStackItem>
          )}
        </ScrollStack>
      )}
    </div>
  );
}