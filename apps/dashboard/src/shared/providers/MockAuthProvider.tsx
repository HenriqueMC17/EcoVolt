"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface MockUser {
  id: string;
  fullName: string;
  primaryEmailAddress: {
    emailAddress: string;
  };
  role: "admin" | "operator" | "provider" | "event_company";
}

interface MockAuthContextType {
  isSignedIn: boolean;
  isLoaded: boolean;
  user: MockUser | null;
  login: (email: string, name: string, role: "admin" | "operator" | "provider" | "event_company") => Promise<void>;
  logout: () => Promise<void>;
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

// Helper to manage cookies client-side in Next.js
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const MockAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // On mount, check if there is an active session in LocalStorage or cookies
    const storedUser = localStorage.getItem("ecovolt_session_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const userData: MockUser = {
          id: parsed._id || parsed.id,
          fullName: parsed.name || parsed.fullName,
          primaryEmailAddress: {
            emailAddress: parsed.email || parsed.primaryEmailAddress.emailAddress,
          },
          role: parsed.role || "admin",
        };
        // Defer state updates to avoid React's synchronous cascading render warning
        setTimeout(() => {
          setUser(userData);
          setIsLoaded(true);
        }, 0);
        return;
      } catch (e) {
        console.error("Failed to parse stored mock session user", e);
      }
    }
    setTimeout(() => {
      setIsLoaded(true);
    }, 0);
  }, []);

  const login = async (
    email: string,
    name: string,
    role: "admin" | "operator" | "provider" | "event_company"
  ) => {
    setIsLoaded(false);
    // Simulate short network delay for premium visual micro-loaders
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUserData: MockUser = {
      id: `user_mock_${role}_${Date.now()}`,
      fullName: name,
      primaryEmailAddress: { emailAddress: email },
      role: role,
    };

    const storageUser = {
      _id: mockUserData.id,
      name: mockUserData.fullName,
      email: mockUserData.primaryEmailAddress.emailAddress,
      role: role,
      companyId: role === "provider" ? "company_ecovolt_provider_001" : "company_ecovolt_client_001",
      createdAt: Date.now(),
    };

    localStorage.setItem("ecovolt_session_user", JSON.stringify(storageUser));
    setCookie("ecovolt-session", JSON.stringify({ userId: mockUserData.id, email }), 7);
    setUser(mockUserData);
    setIsLoaded(true);
  };

  const logout = async () => {
    setIsLoaded(false);
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.removeItem("ecovolt_session_user");
    deleteCookie("ecovolt-session");
    setUser(null);
    setIsLoaded(true);
  };

  return (
    <MockAuthContext.Provider
      value={{
        isSignedIn: !!user,
        isLoaded,
        user,
        login,
        logout,
      }}
    >
      {children}
    </MockAuthContext.Provider>
  );
};

export const useMockAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error("useMockAuth must be used within a MockAuthProvider");
  }
  return context;
};

// Parity hooks with Clerk
export const useAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    return {
      isSignedIn: false,
      isLoaded: true,
      userId: null,
      signOut: async () => {},
    };
  }
  return {
    isSignedIn: context.isSignedIn,
    isLoaded: context.isLoaded,
    userId: context.user?.id || null,
    signOut: context.logout,
  };
};

export const useUser = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    return {
      isSignedIn: false,
      isLoaded: true,
      user: null,
    };
  }
  return {
    isSignedIn: context.isSignedIn,
    isLoaded: context.isLoaded,
    user: context.user,
  };
};
