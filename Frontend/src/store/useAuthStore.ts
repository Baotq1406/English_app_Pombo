import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, tokenStorage } from '@/services/auth';

interface AuthState {
    isFirstLaunch: boolean | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    profile: any | null;
    completeOnboarding: () => void;
    checkFirstLaunch: () => Promise<void>;
    register: (payload: { name: string; email: string; password: string; confirm_password: string }) => Promise<void>;
    login: (payload: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    bootstrap: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isFirstLaunch: null,
    isAuthenticated: false,
    isLoading: false,
    profile: null,

    checkFirstLaunch: async () => {
        const value = await AsyncStorage.getItem('alreadyLaunched');
        if (value === null) {
            set({ isFirstLaunch: true });
        } else {
            set({ isFirstLaunch: false });
        }
    },

    completeOnboarding: async () => {
        await AsyncStorage.setItem('alreadyLaunched', 'true');
        set({ isFirstLaunch: false });
    },

    register: async (payload) => {
        set({ isLoading: true });
        try {
            const result = await authApi.register(payload);
            await tokenStorage.set(result.access_token, result.refresh_token);
            set({ isAuthenticated: true, profile: result.profile || null });
        } catch (e) {
            set({ isLoading: false });
            throw e;
        }
    },

    login: async (payload) => {
        set({ isLoading: true });
        try {
            const result = await authApi.login(payload);
            await tokenStorage.set(result.access_token, result.refresh_token);
            set({ isAuthenticated: true, profile: result.profile || null });
        } catch (e) {
            set({ isLoading: false });
            throw e;
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            const accessToken = await tokenStorage.getAccessToken();
            const refreshToken = await tokenStorage.getRefreshToken();
            if (accessToken) {
                await authApi.logout(accessToken, refreshToken);
            }
        } finally {
            await tokenStorage.clear();
            set({ isAuthenticated: false, profile: null, isLoading: false });
        }
    },

    bootstrap: async () => {
        set({ isLoading: true });
        try {
            const accessToken = await tokenStorage.getAccessToken();
            if (!accessToken) {
                set({ isAuthenticated: false, profile: null });
                return;
            }
            const me = await authApi.me(accessToken);
            set({ isAuthenticated: true, profile: me.profile });
        } catch {
            await tokenStorage.clear();
            set({ isAuthenticated: false, profile: null });
        } finally {
            set({ isLoading: false });
        }
    },
}));
