"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { cn } from "@/shared/lib/utils";

const navLinks = [
  { name: "Início", href: "#" },
  { name: "Solução", href: "#solucao" },
  { name: "Como Funciona", href: "#como-funciona" },
  { name: "Plataforma", href: "#plataforma" },
  { name: "Benefícios", href: "#beneficios" },
  { name: "Contato", href: "#contato" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-out",
        isScrolled ? "top-2 px-4" : "top-0 px-0"
      )}
    >
      <div 
        className={cn(
          "w-full max-w-7xl mx-auto flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isScrolled 
            ? "py-3 px-8 rounded-full border border-white/10 bg-slate-950/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3),0_0_20px_rgba(16,185,129,0.05)] ring-1 ring-white/5" 
            : "py-6 px-12 bg-transparent border-transparent shadow-none"
        )}
      >
        {/* Logo */}
        <div className="flex items-center group cursor-pointer relative gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
              <rect x="4" y="4" width="40" height="40" rx="10" fill="#0F172A" stroke="#10B981" strokeWidth="1.5" />
              <path d="M24 10C16.268 10 10 16.268 10 24C10 31.732 16.268 38 24 38C31.732 38 38 31.732 38 24C38 16.268 31.732 10 24 10Z" stroke="#10B981" strokeWidth="0.5" strokeDasharray="2 2" className="animate-[spin_20s_linear_infinite]" />
              <path d="M26 12L16 26H24L22 36L32 22H24L26 12Z" fill="url(#bolt-gradient)" />
              <defs>
                <linearGradient id="bolt-gradient" x1="16" y1="12" x2="32" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#34D399" />
                  <stop offset="1" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-2xl md:text-3xl font-display font-black tracking-tighter uppercase leading-none">
              <span className="text-white">ECO</span>
              <span className="text-emerald-500">VOLT</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-[1px] w-4 bg-gradient-to-r from-emerald-500/80 to-transparent" />
              <span className="text-[0.65rem] md:text-[0.75rem] font-bold tracking-[0.4em] text-slate-400 uppercase leading-none">
                Enterprise
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className={cn(
          "hidden md:flex items-center gap-1 p-1 rounded-full border transition-all duration-500",
          isScrolled ? "bg-white/5 border-white/5" : "bg-transparent border-transparent"
        )}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative px-5 py-2 text-sm font-medium tracking-wide text-slate-400 hover:text-white transition-all rounded-full group"
            >
              <span className="relative z-10">{link.name}</span>
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <ThemeToggle />
          <Button 
            size="sm" 
            variant="primary" 
            className="group relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-500 rounded-full px-8 py-2.5 font-bold text-sm tracking-tight"
          >
            <span className="relative z-10">Solicitar Demonstração</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-white/20 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white focus:outline-none transition-all active:scale-95"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Fechar Menu" : "Abrir Menu"}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-20 left-4 right-4 p-8 rounded-3xl md:hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] border border-white/10 bg-slate-950/95 backdrop-blur-3xl overflow-hidden z-[-1]"
          >
            <div className="flex flex-col gap-2 relative z-10">
              {navLinks.map((link, i) => (
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={link.name}
                  href={link.href}
                  className="text-xl font-bold text-slate-300 py-4 px-6 rounded-2xl hover:bg-emerald-500/10 hover:text-emerald-400 transition-all active:scale-95"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}
              <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-6" />
              <div className="flex flex-col gap-4">
                <Button className="w-full py-8 rounded-2xl font-black text-lg shadow-2xl shadow-emerald-500/20">Solicitar demonstração</Button>
                <div className="flex items-center justify-center py-2">
                  <ThemeToggle />
                </div>
              </div>
            </div>
            
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
