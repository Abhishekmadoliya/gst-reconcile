"use client";

import { useEffect, useRef } from "react";
import { useAuthStore, UserProfile } from "@/store/useAuthStore";
import { API_URL } from "@/lib/config";

interface AuthInitializerProps {
  initialUser: UserProfile | null;
  children: React.ReactNode;
}

export default function AuthInitializer({ initialUser, children }: AuthInitializerProps) {
  const isInitialized = useRef(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  // 1. Hydrate the store with server-fetched user data BEFORE rendering children.
  // This prevents layout flicker because state is initialized during the SSR phase,
  // preserving SEO and initial page load speed.
  if (!isInitialized.current) {
    useAuthStore.getState().setAuth(initialUser);
    isInitialized.current = true;
  }

  // 2. Client-side verification and persistence
  // Ensures we have the most up-to-date user on each refresh/mount directly from the server.
  // Fetches /me endpoint and saves to Zustand for global data.
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          // credentials: 'include' ensures HttpOnly access/refresh cookies are sent to backend
          credentials: "include", 
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setAuth(data.data);
          } else {
            setAuth(null);
          }
        } else {
          setAuth(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setAuth(null);
      }
    };

    // Trigger the fetch on component mount
    fetchUser();
  }, [setAuth]);

  return <>{children}</>;
}
