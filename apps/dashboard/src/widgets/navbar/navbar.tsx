'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/shared/ui/typography';
import { Zap, Menu, X, Shield, Globe } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useRouter } from 'next/navigation';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Terminal', href: '/dashboard' },
    { name: 'Protocol', href: '#' },
    { name: 'Infrastructure', href: '#' },
    { name: 'Governance', href: '#' },
  ];

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6',
        isScrolled ? 'py-4' : 'py-8'
      )}
    >
      <div className={cn(
        "container mx-auto flex items-center justify-between px-8 py-4 rounded-[2rem] transition-all duration-500",
        isScrolled ? "glass-thick border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]" : "bg-transparent border-transparent"
      )}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => router.push('/')}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
            <Zap className="text-primary fill-primary relative z-10" size={28} />
          </div>
          <Typography variant="h3" className="text-xl font-black tracking-[-0.05em] text-white uppercase italic">
            ECO<span className="text-primary">VOLT</span>
          </Typography>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8 px-8 py-2 bg-white/5 border border-white/5 rounded-full backdrop-blur-xl">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/5 rounded-xl"
              whileHover={{ scale: 1.05 }}
            >
              <Globe size={14} className="text-slate-500" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global v2.4</span>
            </motion.div>
            
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard')}
              className="btn-premium-primary px-8 py-3 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            >
              <Shield size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Launch App</span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden w-12 h-12 flex items-center justify-center rounded-2xl glass border-white/10 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="md:hidden absolute top-24 left-6 right-6 p-8 glass-thick border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center justify-between group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                  <Zap size={20} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
              <div className="h-px bg-white/5 my-2" />
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push('/dashboard');
                }}
                className="btn-premium-primary w-full h-16 rounded-2xl"
              >
                <span className="text-xs font-black uppercase tracking-[0.2em]">Launch Terminal</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
