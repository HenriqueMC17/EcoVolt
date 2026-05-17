"use client";

import { ReactNode, useEffect } from "react";
import { ConvexReactClient, useMutation } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { api } from "@convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://dummy.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

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
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <SyncUser />
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

