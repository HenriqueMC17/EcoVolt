"use client";

import React, { useState, useEffect } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { NAV_LINKS } from "@/shared/lib/constants";
import { Logo } from "@/shared/ui/Logo";

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
        <Logo />

        {/* Desktop Nav */}
        <div className={cn(
          "hidden md:flex items-center gap-1 p-1 rounded-full border transition-all duration-500",
          isScrolled ? "bg-white/5 border-white/5" : "bg-transparent border-transparent"
        )}>
          {NAV_LINKS.map((link) => (
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
          <Link href="/solicitar-demonstracao">
            <Button 
              size="sm" 
              variant="primary" 
              className="group relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-500 rounded-full px-8 py-2.5 font-bold text-sm tracking-tight"
            >
              <span className="relative z-10">Solicitar Demonstração</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-white/20 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
          </Link>
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
              {NAV_LINKS.map((link, i) => (
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
                <Link href="/solicitar-demonstracao" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <Button className="w-full py-8 rounded-2xl font-black text-lg shadow-2xl shadow-emerald-500/20">Solicitar demonstração</Button>
                </Link>
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
