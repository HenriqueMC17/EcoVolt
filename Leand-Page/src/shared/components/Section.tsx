"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  containerClassName?: string;
}

export const Section = ({ children, className, id, containerClassName }: SectionProps) => {
  return (
    <section 
      id={id} 
      className={cn("py-24 px-6 md:py-32 overflow-hidden bg-background transition-colors duration-300", className)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn("max-w-7xl mx-auto", containerClassName)}
      >
        {children}
      </motion.div>
    </section>
  );
};
