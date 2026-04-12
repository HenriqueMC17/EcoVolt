"use client";

import React from "react";
import { m as motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface GlowProps {
  color?: "green" | "blue" | "amber" | "white";
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animate?: boolean;
}

export const Glow = ({ 
  color = "green", 
  position = "center", 
  size = "md", 
  className,
  animate = true
}: GlowProps) => {
  const colors = {
    green: "bg-ecovolt-green-500/10",
    blue: "bg-ecovolt-blue-500/10",
    amber: "bg-ecovolt-amber-500/10",
    white: "bg-white/10",
  };

  const sizes = {
    sm: "w-[300px] h-[300px] blur-[80px]",
    md: "w-[500px] h-[500px] blur-[100px]",
    lg: "w-[800px] h-[800px] blur-[140px]",
    xl: "w-[1200px] h-[1200px] blur-[180px]",
  };

  const positions = {
    "top-left": "-top-1/4 -left-1/4",
    "top-right": "-top-1/4 -right-1/4",
    "bottom-left": "-bottom-1/4 -left-1/4",
    "bottom-right": "-bottom-1/4 -right-1/4",
    "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "absolute rounded-full -z-10 pointer-events-none",
        colors[color],
        sizes[size],
        positions[position],
        animate && "animate-pulse-slow",
        className
      )}
    />
  );
};
