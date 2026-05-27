import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { ButtonCTA } from '@/components/ui/ButtonCTA';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const handleContinue = () => {
        router.dismissAll();
        router.replace('/(auth)/login');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Math.max(insets.top, 40), paddingBottom: Math.max(insets.bottom, 24) }]}>

            <View style={styles.content}>
                <Typography variant="h2" color={colors.primary} style={styles.title}>
                    Chào mừng đến với{'\n'}POMBO
                </Typography>

                <Image
                    source={require('@/assets/images/dragon-nobg.png')}
                    style={styles.image}
                    resizeMode="contain"
                />

                <Typography variant="bodyBase" color={colors.textSecondary} style={styles.description}>
                    Chào mừng bạn đến với hành trình học tiếng Anh. Bắt đầu bài học đầu tiên ngay nhé!
                </Typography>
            </View>

            <View style={styles.footer}>
                <ButtonCTA title="Đăng nhập" onPress={handleContinue} style={{ width: '100%' }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 40,
    },
    image: {
        width: 293,
        height: 391,
        marginBottom: 40,
    },
    description: {
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 24,
    },
    footer: {
        width: '100%',
        marginTop: 'auto',
    }
});