
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import TimeDilationGlobe from '@/components/TimeDilationGlobe';
import ControlPanel from '@/components/ControlPanel';
import TimeDisplay from '@/components/TimeDisplay';
import InfoPanel from '@/components/InfoPanel';
import Footer from '@/components/Footer';

const Index = () => {
  // Control states
  const [blackHoleMass, setBlackHoleMass] = useState(100000000); // Gargantua is approximately 100 million solar masses
  const [planetDistance, setPlanetDistance] = useState(100); // km from black hole center
  
  // Time states
  const [earthTime, setEarthTime] = useState(0);
  const [millerTime, setMillerTime] = useState(0);
  const [dilationFactor, setDilationFactor] = useState(61320); // 1 hour on Miller = 7 years = 61320 hours on Earth
  
  // Calculate time dilation factor based on control values
  useEffect(() => {
    const calculateTimeDilation = () => {
      // In the movie, 1 hour on Miller's planet = 7 years on Earth
      // 7 years = 7 * 365 * 24 = 61320 hours
      const movieDilationFactor = 61320;
      
      // For visualization purposes, we'll use the movie's dilation factor
      // but allow some adjustment based on sliders
      const massEffect = blackHoleMass / 100000000; // Normalized to Gargantua's mass
      const distanceEffect = 100 / Math.max(1, planetDistance); // Inverse relationship with distance
      
      // Calculate a factor that's influenced by the sliders but centered around the movie value
      const factor = movieDilationFactor * (massEffect * distanceEffect);
      
      // Ensure the factor is reasonable (avoiding division by zero or negative values)
      const clampedFactor = isNaN(factor) || !isFinite(factor) || factor < 1 ? 61320 : factor;
      
      setDilationFactor(clampedFactor);
    };
    
    calculateTimeDilation();
  }, [blackHoleMass, planetDistance]);
  
  // Update time counters
  useEffect(() => {
    const timer = setInterval(() => {
      setEarthTime(prev => prev + 1);
      setMillerTime(prev => prev + (1 / dilationFactor));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [dilationFactor]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20">
          <div className="hero-glow"></div>
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="text-gradient">Time Dilation Explorer</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Experience how time flows differently near black holes, as shown in Interstellar
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Visualization Section */}
        <section className="py-8">
          <div className="container mx-auto px-6">
            <TimeDilationGlobe 
              earthTime={earthTime} 
              millerTime={millerTime}
              planetDistance={planetDistance} 
            />
          </div>
        </section>
        
        {/* Controls and Data Section */}
        <section className="py-8">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TimeDisplay 
                earthTime={earthTime} 
                millerTime={millerTime} 
                dilationFactor={dilationFactor} 
              />
              <ControlPanel 
                blackHoleMass={blackHoleMass} 
                setBlackHoleMass={setBlackHoleMass}
                planetDistance={planetDistance}
                setPlanetDistance={setPlanetDistance}
              />
            </div>
          </div>
        </section>
        
        {/* Info Section */}
        <section className="py-8">
          <div className="container mx-auto px-6">
            <InfoPanel />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
