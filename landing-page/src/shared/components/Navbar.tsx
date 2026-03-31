"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { cn } from "@/shared/lib/utils";
import { theme } from "@/shared/lib/theme";
import Image from "next/image";

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
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-4 left-4 right-4 z-50 transition-all",
        isScrolled ? "py-0" : "py-2"
      )}
      style={{ transitionDuration: `${theme.animations.durations.slow}s` }}
    >
      <div className={cn(
        "max-w-7xl mx-auto rounded-full px-6 py-2 flex items-center justify-between border transition-all",
        isScrolled 
          ? "glass shadow-[0_8px_32px_rgba(0,0,0,0.05)] border-white/20 bg-white/70" 
          : "bg-transparent border-transparent"
      )}
      style={{ transitionDuration: `${theme.animations.durations.slow}s` }}>
        {/* Logo */}
        <div className="flex items-center group cursor-pointer relative py-2">
            <Image 
              src="/Logo_EcoVolt_UPX3.png" 
              alt="EcoVolt Logo" 
              width={200} 
              height={50} 
              className="object-contain transition-transform group-hover:scale-105"
              style={{ transitionDuration: `${theme.animations.durations.normal}s` }}
              priority
            />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all rounded-full hover:bg-slate-50 dark:hover:bg-slate-800"
              style={{ transitionDuration: `${theme.animations.durations.fast}s` }}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Button size="sm" variant="primary" className="shadow-none">
            Solicitar demonstração
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-slate-600 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Fechar Menu" : "Abrir Menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: theme.animations.durations.normal, ease: theme.animations.easing.premium }}
            className="absolute top-24 left-6 right-6 glass p-8 rounded-3xl md:hidden shadow-2xl border-white/40 bg-white/90 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-bold text-slate-700 py-3 px-4 rounded-2xl hover:bg-slate-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />
              <div className="flex items-center justify-between gap-4">
                <ThemeToggle />
                <Button className="flex-1 py-6">Solicitar demonstração</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
