import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { ButtonCTA } from '@/components/ui/ButtonCTA';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PasswordUpdatedScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const handleBackToLogin = () => {
        router.dismissAll();
        router.replace('/(auth)/login');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: Math.max(insets.bottom, 24) }]}>

            <View style={styles.content}>
                <Typography variant="h2" color={colors.primary} style={styles.title}>
                    Mật khẩu cập nhật{'\n'}thành công
                </Typography>

                <Image
                    source={require('@/assets/images/dragon-nobg.png')}
                    style={styles.image}
                    resizeMode="contain"
                />

                <Typography variant="bodyBase" color={colors.textSecondary} style={styles.description}>
                    Mật khẩu của bạn đã được cập nhật
                </Typography>
            </View>

            <View style={styles.footer}>
                <ButtonCTA title="Đăng nhập" onPress={handleBackToLogin} style={{ width: '100%' }} />
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
    },
    footer: {
        width: '100%',
        marginTop: 'auto',
    }
});