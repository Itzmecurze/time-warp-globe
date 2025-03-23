
import React from 'react';
import { motion } from 'framer-motion';

const InfoPanel: React.FC = () => {
  return (
    <motion.div 
      className="glass-panel p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="text-center mb-4">
        <h3 className="text-xl font-medium">The Science Behind Time Dilation</h3>
      </div>
      
      <div className="space-y-4 text-sm">
        <p>
          In the film Interstellar, Miller's planet experiences extreme time dilation due to its proximity to Gargantua, 
          a supermassive black hole. This phenomenon is based on Einstein's Theory of General Relativity.
        </p>
        
        <div className="p-3 rounded bg-secondary/30">
          <p className="font-medium mb-1">Time Dilation Formula:</p>
          <p className="font-mono text-center">
            t₀ = t × √(1 - 2GM/rc²)
          </p>
          <p className="mt-2 text-muted-foreground text-xs">
            Where t₀ is the observed time, t is the time for a distant observer, 
            G is the gravitational constant, M is the mass of the object, 
            r is the distance from the center of the object, and c is the speed of light.
          </p>
        </div>
        
        <p>
          The closer an object is to a massive body like a black hole, the stronger the gravitational field 
          and the slower time passes relative to an observer farther away.
        </p>
        
        <p className="text-muted-foreground text-xs italic">
          Note: The visualization uses simplified calculations for educational purposes. 
          The actual physics involves additional factors including orbital mechanics.
        </p>
      </div>
    </motion.div>
  );
};

export default InfoPanel;
