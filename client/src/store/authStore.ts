import axios from "axios";
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
  setUser: (user: IUser) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      logout: async () => {
        try {
          await axios.delete(
            "http://localhost:64000/api/auth/logout",
            { withCredentials: true }
          );
        } catch (err) {
          if (axios.isAxiosError(err)) {
            console.error("Logout error:", err.response?.data || err.message);
          } else {
            console.error("Unexpected logout error:", err);
          }
        } finally {
          set({ user: null });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
