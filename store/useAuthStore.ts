import { create } from "zustand";
import { API_URL } from "@/lib/config";
import api from "@/lib/api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  firmId: string;
  firmName?: string;
  role: "owner" | "staff";
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
      // Clear HTTP-Only cookies on the backend
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error("Failed to call logout on backend:", err);
    } finally {
      // Always clear local state
      set({ user: null, isAuthenticated: false });

      // Clear cookies client-side (for fallbacks)
      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Force reload or redirect to trigger middleware check and update navbar
      window.location.href = "/";
    }
  },
}));
