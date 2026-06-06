"use client";

import { ReactNode, useEffect, useState } from "react";
import { ConvexReactClient, useMutation } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { api } from "@convex/_generated/api";
import { MockAuthProvider } from "./MockAuthProvider";
import { isMockMode } from "../lib/convex";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://dummy.convex.cloud";
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function SyncUser() {
  const { isSignedIn } = useAuth();
  const storeUser = useMutation(api.users.storeUser);

  useEffect(() => {
    if (isSignedIn) {
      storeUser().catch((err) => {
        console.error("Erro ao sincronizar usuário no Convex:", err);
      });
    }
  }, [isSignedIn, storeUser]);

  return null;
}

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-bg-main" />;
  }

  const isMock = isMockMode() || !clerkKey || clerkKey === "dummy";

  if (isMock) {
    return (
      <MockAuthProvider>
        {children}
      </MockAuthProvider>
    );
  }

  // Create Convex client instance only when not in mock mode to save sockets and resources
  const convex = new ConvexReactClient(convexUrl);

  return (
    <ClerkProvider publishableKey={clerkKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <SyncUser />
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}


