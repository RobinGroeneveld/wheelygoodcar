import TiltedCard from '../components/TiltedCard';
import SpotlightCard from '../components/SpotlightCard';
import PillNav from '../components/PillNav';
import RotatingText from '../components/RotatingText'


export default function Page() {
  return (
    <html lang="en">
      <body className="bg-black">
        <header className="mt-20">
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
          <div className="flex flex-wrap justify-center gap-8">
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
                imageSrc="/images/mercedes-tuned.jpeg"
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
      </body>
    </html>
  )
  
}

