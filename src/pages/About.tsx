
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  const sections = [
    {
      title: "Einstein's Theory of General Relativity",
      content: "General Relativity describes gravity as a geometric property of spacetime, rather than a force. The presence of mass and energy curves spacetime, and this curvature affects the path of objects moving through it. Time dilation is a direct consequence of this curvature - time flows differently depending on the strength of the gravitational field you're in."
    },
    {
      title: "Gravitational Time Dilation",
      content: "Gravitational time dilation occurs because time passes more slowly in stronger gravitational fields. Near massive objects like black holes, the extreme gravity causes time to pass significantly slower compared to regions with weaker gravity. This means that an observer near a black hole would experience time passing normally, but would see the rest of the universe evolving at an accelerated rate."
    },
    {
      title: "Black Holes and the Schwarzschild Metric",
      content: "Black holes are regions of spacetime where gravity is so strong that nothing—not even light—can escape. The Schwarzschild metric describes the spacetime geometry around a non-rotating, spherically symmetric black hole. It allows us to calculate precisely how time dilation works at different distances from the black hole's center."
    },
    {
      title: "Miller's Planet in Interstellar",
      content: "In the film, Miller's planet orbits extremely close to Gargantua, a supermassive black hole. The proximity to Gargantua causes severe time dilation, where one hour on the planet equals approximately 7 years on Earth. While this is dramatically portrayed in the film, the physics behind it is based on real science, albeit with some creative license for storytelling purposes."
    },
    {
      title: "The Science vs. The Fiction",
      content: "While Interstellar is praised for its scientific accuracy, it does take some liberties. For instance, a planet orbiting so close to a black hole would likely be torn apart by tidal forces. Additionally, the extreme radiation near a black hole would make the planet uninhabitable. However, the core concept of time dilation is accurately portrayed, showcasing one of the most fascinating aspects of Einstein's theories."
    }
  ];

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
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="text-gradient">The Science</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Understanding the physics behind time dilation
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Content Section */}
        <section className="py-8">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto glass-panel p-8">
              <div className="space-y-10">
                {sections.map((section, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <h2 className="text-2xl font-medium mb-3">{section.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="mt-12 p-6 rounded-lg bg-secondary/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="text-xl font-medium mb-3">The Mathematical Formulation</h3>
                <div className="overflow-x-auto space-y-4">
                  <div>
                    <p className="font-medium mb-2">Time Dilation Formula:</p>
                    <div className="p-3 bg-space-black/50 rounded-md">
                      <p className="font-mono text-center text-lg">
                        t₀ = t × √(1 - 2GM/rc²)
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Where t₀ is the dilated time, t is the time in flat spacetime, G is the gravitational constant, 
                      M is the mass of the gravitating body, r is the radial coordinate, and c is the speed of light.
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-2">Schwarzschild Radius:</p>
                    <div className="p-3 bg-space-black/50 rounded-md">
                      <p className="font-mono text-center text-lg">
                        r<sub>s</sub> = 2GM/c²
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      This is the radius at which, if a mass were compressed, it would become a black hole. At this 
                      radius, the escape velocity equals the speed of light.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Quote Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div 
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <blockquote className="text-xl md:text-2xl italic">
                "We used to look up at the sky and wonder at our place in the stars. Now we just look down and worry about our place in the dirt."
              </blockquote>
              <cite className="block mt-4 text-muted-foreground">— Cooper, Interstellar</cite>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
