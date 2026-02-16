'use client';

import TiltedCard from '../components/TiltedCard';
import SpotlightCard from '../components/SpotlightCard';
import PillNav from '../components/PillNav';
import RotatingText from '../components/RotatingText';
import LiquidChrome from '../components/LiquidChrome';

export default function Page() {
  return (
    <>
      {/* Fixed full-screen background */}
      <div className="fixed top-0 left-0 w-screen h-screen -z-10">
        <LiquidChrome
          baseColor={[0.0, 0.1, 0.1]}
          speed={0.5}
          amplitude={0.3}
          frequencyX={3}
          frequencyY={3}
          interactive={true}
        />
      </div>

      {/* Content */}
      <div className="relative min-h-screen">
        <header className="pt-20">
          <div className="flex justify-center gap-8 mt-20">
            <PillNav
              items={[
                { label: 'Home', href: '/' },
                { label: 'Auto verkopen', href: '/sell-car' },
                { label: 'Overzicht alle auto`s', href: '/overview' },
                { label: 'Inloggen', href: '/login' }
              ]}
              activeHref="/"
              className="custom-nav"
              ease="power2.easeOut"
              baseColor="#000000"
              pillColor="#ffffff"
              hoveredPillTextColor="#ffffff"
              pillTextColor="#000000"
              initialLoadAnimation={false}
            />
          </div>
      
          <div className="flex gap-2 text-4xl font-bold justify-center mt-20 mb-20">
            <span className='text-white'>Welkom bij</span>

            <RotatingText
              texts={['Wheely Good ', 'Cars']}
              mainClassName="px-3 bg-cyan-300 text-black overflow-hidden py-1 justify-center rounded-lg"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </div>
        </header>

        <main>
          <div className="flex flex-wrap justify-center gap-8 pb-20">
            <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
              <TiltedCard
                imageSrc="/images/mercedes.jpg"
                altText="Mercedes-Benz C-Klasse"
                captionText="2008 Mercedes-Benz C-Klasse"
                containerHeight="380px"
                containerWidth="380px"
                scaleOnHover={1.05}
                rotateAmplitude={10}
              />
            </SpotlightCard>

            <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
              <TiltedCard
                imageSrc="/images/clio.avif"
                altText="Mercedes-Benz C-Klasse"
                captionText="2000 Renault Clio"
                containerHeight="380px"
                containerWidth="380px"
                scaleOnHover={1.05}
                rotateAmplitude={10}
              />
            </SpotlightCard>

            <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
              <TiltedCard
                imageSrc="/images/mercedes-performance.webp"
                altText="Mercedes-Benz C-Klasse"
                captionText="2024 Mercedes-AMG C 63 S E Performance"
                containerHeight="380px"
                containerWidth="380px"
                scaleOnHover={1.05}
                rotateAmplitude={10}
              />
            </SpotlightCard>
          </div>
        </main>
      </div>
    </>
  );
}