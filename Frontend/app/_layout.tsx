import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const { isFirstLaunch, isAuthenticated, checkFirstLaunch } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';

    const [loaded, error] = useFonts({
        'BeVietnamPro-Regular': require('@/assets/fonts/Be-Vietnam-Pro/BeVietnamPro-Regular.ttf'),
        'BeVietnamPro-Medium': require('@/assets/fonts/Be-Vietnam-Pro/BeVietnamPro-Medium.ttf'),
        'BeVietnamPro-SemiBold': require('@/assets/fonts/Be-Vietnam-Pro/BeVietnamPro-SemiBold.ttf'),
        'Baloo2-Medium': require('@/assets/fonts/Baloo-2/Baloo2-Medium.ttf'),
        'Baloo2-Bold': require('@/assets/fonts/Baloo-2/Baloo2-Bold.ttf'),
        'Baloo2-ExtraBold': require('@/assets/fonts/Baloo-2/Baloo2-ExtraBold.ttf'),
    });

    useEffect(() => {
        checkFirstLaunch();
    }, []);

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    useEffect(() => {
        if (isFirstLaunch === null || !loaded) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (isFirstLaunch) {
            router.replace('/get-started');
        } else if (!isAuthenticated) {
            if (!inAuthGroup) router.replace('/(auth)/login');
        } else if (isAuthenticated) {
            if (inAuthGroup || !segments[0]) {
                router.replace('/(tabs)');
            }
        }
    }, [isFirstLaunch, isAuthenticated, segments, loaded]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors[colorScheme].background },
                animation: 'fade',
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="get-started" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(screens)" />
        </Stack>
    );
}