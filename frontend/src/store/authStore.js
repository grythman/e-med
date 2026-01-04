import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = await authService.login(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Login failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { user, tokens } = await authService.register(userData);
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
          set({ user, isAuthenticated: true, isLoading: false, error: null });
          return { success: true };
        } catch (error) {
          // Handle validation errors from express-validator
          let errorMessage = 'Registration failed';
          
          if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
            // Multiple validation errors
            errorMessage = error.response.data.errors
              .map(err => err.msg || err.message)
              .join(', ');
          } else if (error.response?.data?.error) {
            // Single error message
            errorMessage = error.response.data.error;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Logout
      logout: async () => {
        await authService.logout();
        set({ user: null, isAuthenticated: false, error: null });
      },

      // Get current user
      fetchCurrentUser: async () => {
        set({ isLoading: true });
        try {
          const user = await authService.getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      // Update profile
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.updateProfile(userData);
          set({ user, isLoading: false });
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Update failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;

