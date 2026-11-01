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
  if (!isInitialized.current) {
    useAuthStore.getState().setAuth(initialUser);
    isInitialized.current = true;
  }

  // 2. Client-side fallback sync for Google OAuth redirect or cookie hydration
  useEffect(() => {
    if (!initialUser) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`${API_URL}/api/auth/me`, {
            credentials: "include",
            cache: "no-store",
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setAuth(data.data);
            }
          }
        } catch {
          // Non-blocking background verification
        }
      };

      fetchUser();
    }
  }, [initialUser, setAuth]);

  return <>{children}</>;
}
