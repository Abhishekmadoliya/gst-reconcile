import { create } from "zustand";

interface DashboardState {
  selectedGstinId: string | null;
  selectedJobId: string | null;
  setSelectedGstinId: (id: string | null) => void;
  setSelectedJobId: (id: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedGstinId: null,
  selectedJobId: null,
  setSelectedGstinId: (id) => set({ selectedGstinId: id }),
  setSelectedJobId: (id) => set({ selectedJobId: id }),
}));
