"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { ReactNode, useMemo } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const { getToken, isSignedIn } = useAuth();

  const convex = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is required");
    }
    return new ConvexReactClient(url, {
      auth: {
        getToken: async () => {
          console.log("ConvexClientProvider getToken called, isSignedIn:", isSignedIn);

          // For development, we'll use a simplified approach
          // In production, you should set up the proper JWT template
          if (!isSignedIn) {
            console.log("User not signed in, returning null token");
            return null;
          }

          try {
            // Try to get token with convex template first
            console.log("Attempting to get token with convex template");
            const token = await getToken({ template: "convex" });
            console.log("Got token with convex template:", token ? "✓" : "✗");
            return token;
          } catch (error) {
            // If convex template doesn't exist, use default token
            console.warn("Convex JWT template not configured, using default token:", error);
            try {
              const defaultToken = await getToken();
              console.log("Got default token:", defaultToken ? "✓" : "✗");
              return defaultToken;
            } catch (defaultError) {
              console.error("Failed to get default token:", defaultError);
              return null;
            }
          }
        }
      }
    });
  }, [getToken, isSignedIn]);

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}