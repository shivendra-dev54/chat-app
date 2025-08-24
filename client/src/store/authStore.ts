import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface IUser {
  id: number;
  username: string;
  email: string;
  about: string;
}

interface AuthState {
  user: IUser | null;
  update_user: (user: IUser) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      update_user: (user) => set({ user }),
      reset: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
