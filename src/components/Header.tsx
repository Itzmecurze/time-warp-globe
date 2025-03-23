
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-space-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-white/90 animate-pulse-subtle"></div>
          </div>
          <span className="font-semibold text-xl tracking-tight">TimeDilation</span>
        </Link>
        
        <nav className="flex gap-8">
          {[
            { path: '/', label: 'Experience' },
            { path: '/about', label: 'Science' },
          ].map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-1 py-2 transition-all duration-300 hover:text-primary ${
                location.pathname === item.path ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              {location.pathname === item.path && (
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 bg-primary w-full"
                  layoutId="navbar-indicator"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
