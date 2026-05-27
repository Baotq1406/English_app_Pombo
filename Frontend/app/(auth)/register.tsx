import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { InputField } from '@/components/ui/InputField';
import { ButtonCTA } from '@/components/ui/ButtonCTA';
import { HeaderAuth } from '@/components/ui/HeaderAuth';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const handleRegister = () => {
        router.push('/(auth)/welcome' as any);
    };

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <HeaderAuth title="Tạo tài khoản mới" />

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Typography
                        variant="bodyBase"
                        color={colors.textSecondary}
                        style={styles.subtitle}
                    >
                        Điền thông tin của bạn bên dưới hoặc đăng ký bằng tài khoản Google
                    </Typography>

                    <View style={styles.form}>
                        <InputField placeholder="Tên hiển thị của bạn" leftIcon="User" value={name} onChangeText={setName} />
                        <InputField placeholder="Email của bạn" leftIcon="Mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                        <InputField placeholder="Mật khẩu của bạn" leftIcon="Lock" isPassword value={password} onChangeText={setPassword} />
                        <InputField placeholder="Xác nhận mật khẩu của bạn" leftIcon="Lock" isPassword value={confirmPassword} onChangeText={setConfirmPassword} />
                    </View>

                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        activeOpacity={0.7}
                        onPress={() => setAgreeTerms(!agreeTerms)}
                    >
                        <View style={styles.checkboxIcon}>
                            <Icon
                                name={agreeTerms ? "CheckSquare" : "Square"}
                                color={agreeTerms ? colors.primary : colors.textSecondary}
                                size={20}
                            />
                        </View>
                        <Typography variant="caption" color={colors.textSecondary} style={{ flex: 1 }}>
                            Tôi đồng ý với <Typography variant="caption" color={colors.primary}>Điều khoản sử dụng</Typography> và <Typography variant="caption" color={colors.primary}>Chính sách bảo mật</Typography> của hệ thống
                        </Typography>
                    </TouchableOpacity>

                    <View style={styles.actionContainer}>
                        <ButtonCTA title="Đăng ký" onPress={handleRegister} disabled={!agreeTerms} />

                        <View style={styles.dividerContainer}>
                            <View style={[styles.divider, { backgroundColor: colors.disabled }]} />
                            <Typography variant="bodySmall" color={colors.textSecondary} style={styles.dividerText}>Hoặc</Typography>
                            <View style={[styles.divider, { backgroundColor: colors.disabled }]} />
                        </View>

                        <ButtonCTA
                            title="Đăng ký bằng Google"
                            variant="outline"
                            icon={
                                <Image
                                    source={require('@/assets/images/google-logo-nobg.png')}
                                    style={{ width: 24, height: 24 }}
                                    resizeMode="contain"
                                />
                            }
                            onPress={() => { }}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Typography variant="bodySmall" color={colors.textSecondary}>Đã có tài khoản? </Typography>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Typography variant="bodySmall" color={colors.primary}>Đăng nhập</Typography>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 24
    },

    subtitle: {
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24,
        paddingHorizontal: 20
    },

    form: {
        marginBottom: 16,
        gap: 12
    },

    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 4
    },

    checkboxIcon: {
        marginRight: 10
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