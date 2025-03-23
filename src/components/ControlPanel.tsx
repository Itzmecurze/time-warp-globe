
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { motion } from 'framer-motion';

interface ControlPanelProps {
  blackHoleMass: number;
  setBlackHoleMass: (value: number) => void;
  planetDistance: number;
  setPlanetDistance: (value: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  blackHoleMass,
  setBlackHoleMass,
  planetDistance,
  setPlanetDistance
}) => {
  return (
    <motion.div 
      className="glass-panel p-6 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="text-center mb-4">
        <h3 className="text-xl font-medium mb-1">Gravitational Time Dilation Controls</h3>
        <p className="text-sm text-muted-foreground">Adjust parameters to see how time dilation changes</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="blackHoleMass" className="text-sm font-medium">
              Black Hole Mass
            </label>
            <span className="text-xs text-muted-foreground">{blackHoleMass} M☉</span>
          </div>
          <Slider
            id="blackHoleMass"
            min={1}
            max={100}
            step={1}
            value={[blackHoleMass]}
            onValueChange={(value) => setBlackHoleMass(value[0])}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Lighter (1 M☉)</span>
            <span>Heavier (Gargantua: ~100 M☉)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="planetDistance" className="text-sm font-medium">
              Distance from Black Hole
            </label>
            <span className="text-xs text-muted-foreground">{planetDistance} km</span>
          </div>
          <Slider
            id="planetDistance"
            min={10}
            max={500}
            step={10}
            value={[planetDistance]}
            onValueChange={(value) => setPlanetDistance(value[0])}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Closer (10 km)</span>
            <span>Further (500 km)</span>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground/80 italic text-center mt-4">
        *M☉ represents solar masses, the mass of our sun
      </div>
    </motion.div>
  );
};

export default ControlPanel;
