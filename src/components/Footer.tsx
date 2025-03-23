
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 py-6 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white/90"></div>
              </div>
              <span className="font-medium">TimeDilation</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Exploring the physics of Interstellar
            </p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Inspired by Christopher Nolan's "Interstellar"</p>
            <p className="mt-1">Based on Einstein's Theory of General Relativity</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
