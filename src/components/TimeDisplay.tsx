
import React from 'react';
import { motion } from 'framer-motion';

interface TimeDisplayProps {
  earthTime: number;
  millerTime: number;
  dilationFactor: number;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ earthTime, millerTime, dilationFactor }) => {
  // Format time as hours:minutes:seconds
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format years for display
  const formatYears = (hours: number) => {
    const years = hours / 8760; // 8760 hours in a year
    return years < 1 ? `${(years * 12).toFixed(1)} months` : `${years.toFixed(1)} years`;
  };

  return (
    <motion.div 
      className="glass-panel p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-medium">Time Comparison</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {dilationFactor.toFixed(0)}x time dilation factor
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="text-center">
          <div className="mb-2">
            <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Earth</h4>
          </div>
          <div className="text-3xl font-mono tracking-wider animate-pulse-subtle">
            {formatTime(earthTime)}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Standard time</div>
          <div className="mt-1 text-sm">{formatYears(earthTime / 3600)}</div>
        </div>
        
        <div className="text-center">
          <div className="mb-2">
            <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Miller's Planet</h4>
          </div>
          <div className="text-3xl font-mono tracking-wider text-primary animate-pulse-subtle">
            {formatTime(millerTime)}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Dilated time</div>
          <div className="mt-1 text-sm">{formatYears(millerTime / 3600)}</div>
        </div>
      </div>
      
      <div className="mt-6 p-3 rounded bg-secondary/30 text-sm">
        <p className="text-center">
          1 hour on Miller's Planet = {Math.round(dilationFactor)} hours on Earth
          <br />
          (approximately {formatYears(dilationFactor)} on Earth)
        </p>
      </div>
    </motion.div>
  );
};

export default TimeDisplay;
