import MagicBento from './MagicBento';
import { useTopSellers } from '../lib/useTopSellers';
import { useMemo } from 'react';

export default function MagicBentoAdminSellers() {
  const { data, error, isLoading } = useTopSellers();

  // Zet aanbieders om naar MagicBento cardData formaat
  const cardData = useMemo(() => {
    if (!data) return [];
    return data.map((row: any, idx: number) => ({
      color: idx === 0 ? '#23272f' : '#060010',
      title: row.name || 'Onbekend',
      description: `Email: ${row.email}\nTotaal: ${row.totalCars} | Verkocht: ${row.soldCars} | Views: ${row.totalViews} | Score: ${row.score.toFixed(1)}`,
      label: `#${idx + 1}`
    }));
  }, [data]);


  return (
    <MagicBento
      textAutoHide={true}
      enableStars
      enableSpotlight
      enableBorderGlow={true}
      enableTilt={false}
      enableMagnetism={false}
      clickEffect
      spotlightRadius={400}
      particleCount={12}
      glowColor="132, 0, 255"
      disableAnimations={false}
      cardData={cardData}
    />
  );
}
