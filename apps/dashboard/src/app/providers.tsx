"use client";
import React from 'react';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { UserProvider } from '@/shared/context/UserContext';
import { ToastProvider } from '@/shared/context/ToastContext';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://ecovolt-energy.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <UserProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </UserProvider>
    </ConvexProvider>
  );
}
