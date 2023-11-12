import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AuthStoreState {
  accessToken: string | null;
  accessTokenExpires: string | null;
  refreshToken: string | null;
  refreshTokenExpires: string | null;
}

interface AuthStoreActions {
  setAccessToken: (accessToken: string) => void;
  setAccessTokenExpires: (accessTokenExpires: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setRefreshTokenExpires: (refreshTokenExpires: string) => void;
}

const useAuthStore = create<AuthStoreState & AuthStoreActions>()(
devtools(
  persist((set) => ({
    // Initialize the store with null values for tokens
    accessToken: null,
    accessTokenExpires: null,
    refreshToken: null,
    refreshTokenExpires: null,

    // Setters to update the state
    setAccessToken: (accessToken: string) => set({ accessToken }),
    setAccessTokenExpires: (accessTokenExpires: string) => set({ accessTokenExpires }),
    setRefreshToken: (refreshToken: string) => set({ refreshToken }),
    setRefreshTokenExpires: (refreshTokenExpires: string) => set({ refreshTokenExpires }),

    // Clear tokens on logout
    logout: () => {
      set({
        accessToken: null,
        accessTokenExpires: null,
        refreshToken: null,
        refreshTokenExpires: null,
      });
    },
  }),
  {
    name: 'auth-storage',
  }
  )
));

export default useAuthStore;
