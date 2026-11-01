import { create } from "zustand";
import { API_URL } from "@/lib/config";
import api from "@/lib/api";
import { signOut } from "@/lib/auth-client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  firmId: string;
  firmName?: string;
  role: "owner" | "staff";
  onboardingCompleted?: boolean;
  userRole?: string | null;
  booksSoftware?: string | null;
  gstinCountRange?: string | null;
  phone?: string | null;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setAuth: (user: UserProfile | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setAuth: (user) => set({ user, isAuthenticated: !!user }),
  logout: async () => {
    try {
      // 1. Call Better Auth client signOut if session exists
      await signOut().catch(() => {});
    } catch {
      // Non-blocking fallback
    }

    try {
      // 2. Clear HTTP-Only cookies and session row on the backend
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error("Failed to call logout on backend:", err);
    } finally {
      // 3. Always clear local Zustand state
      set({ user: null, isAuthenticated: false });

      // 4. Force clear client cookies across paths and root domain
      const cookiesToClear = [
        "accessToken",
        "refreshToken",
        "better-auth.session_token",
        "__Secure-better-auth.session_token",
        "better-auth.session_data",
        "__Secure-better-auth.session_data",
        "better-auth.csrf_token",
        "__Secure-better-auth.csrf_token",
      ];

      cookiesToClear.forEach((name) => {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        if (typeof window !== "undefined") {
          document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
      });

      // 5. Force redirect to login page
      window.location.href = "/login";
    }
  },
}));
