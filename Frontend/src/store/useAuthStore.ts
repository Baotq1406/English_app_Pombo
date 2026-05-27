import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
    isFirstLaunch: boolean | null;
    isAuthenticated: boolean;
    completeOnboarding: () => void;
    login: () => void;
    logout: () => void;
    checkFirstLaunch: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    isFirstLaunch: null,
    isAuthenticated: false,

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

    login: () => set({ isAuthenticated: true }),
    logout: () => set({ isAuthenticated: false }),
}));