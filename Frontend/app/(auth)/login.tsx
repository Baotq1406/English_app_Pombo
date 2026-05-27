import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { InputField } from '@/components/ui/InputField';
import { ButtonCTA } from '@/components/ui/ButtonCTA';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();
    const login = useAuthStore(state => state.login);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    {
                        paddingTop: Math.max(insets.top, 20),
                        paddingBottom: Math.max(insets.bottom, 24)
                    }
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Typography variant="display" color={colors.primary}>POMBO</Typography>
                    <Typography variant="h2" style={styles.title}>Đăng nhập</Typography>
                    <Typography variant="bodyBase" color={colors.textSecondary}>Chào mừng bạn quay trở lại!</Typography>
                </View>

                <View style={styles.form}>
                    <InputField
                        placeholder="Email của bạn"
                        leftIcon="Mail"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <InputField
                        placeholder="Mật khẩu của bạn"
                        leftIcon="Lock"
                        isPassword
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={() => router.push('/(auth)/forgot-password' as any)}
                    >
                        <Typography variant="bodySmall" color={colors.primary}>Quên mật khẩu?</Typography>
                    </TouchableOpacity>
                </View>

                <View style={styles.actionContainer}>
                    <ButtonCTA title="Đăng nhập" onPress={() => login()} />

                    <View style={styles.dividerContainer}>
                        <View style={[styles.divider, { backgroundColor: colors.disabled }]} />
                        <Typography variant="bodySmall" color={colors.textSecondary} style={styles.dividerText}>Hoặc</Typography>
                        <View style={[styles.divider, { backgroundColor: colors.disabled }]} />
                    </View>

                    <ButtonCTA
                        title="Đăng nhập bằng Google"
                        onPress={() => { }}
                        variant="outline"
                        icon={
                            <Image
                                source={require('@/assets/images/google-logo-nobg.png')}
                                style={{ width: 24, height: 24 }}
                                resizeMode="contain"
                            />
                        }
                    />
                </View>

                <View style={styles.footer}>
                    <Typography variant="bodySmall" color={colors.textSecondary}>Chưa có tài khoản? </Typography>
                    <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                        <Typography variant="bodySmall" color={colors.primary}>Đăng ký ngay</Typography>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24
    },
    header: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 32
    },
    title: {
        marginTop: 16,
        marginBottom: 4
    },
    form: {
        marginBottom: 24,
        gap: 12
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: -4,
        marginBottom: 8,
        paddingVertical: 8
    },
    actionContainer: {
        gap: 16
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16
    },
    divider: {
        flex: 1,
        height: 1
    },
    dividerText: {
        marginHorizontal: 16
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32
    }
});