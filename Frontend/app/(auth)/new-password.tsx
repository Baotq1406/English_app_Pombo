import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { InputField } from '@/components/ui/InputField';
import { ButtonCTA } from '@/components/ui/ButtonCTA';
import { HeaderAuth } from '@/components/ui/HeaderAuth';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export default function NewPasswordScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleResetPassword = () => {
        router.push('/(auth)/password-updated' as any);
    };

    const isFormValid = password.length >= 6 && password === confirmPassword;

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <HeaderAuth title="Tạo mật khẩu mới" />

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                    <Typography variant="bodyBase" color={colors.textSecondary} style={styles.subtitle}>
                        Điền thông tin một mật khẩu mới
                    </Typography>

                    <View style={styles.form}>
                        <InputField
                            placeholder="Mật khẩu mới của bạn"
                            leftIcon="Lock"
                            isPassword
                            value={password}
                            onChangeText={setPassword}
                        />
                        <InputField
                            placeholder="Xác nhận mật khẩu của bạn"
                            leftIcon="Lock"
                            isPassword
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            error={confirmPassword.length > 0 && password !== confirmPassword ? "Mật khẩu không khớp" : undefined}
                        />
                    </View>

                    <View style={styles.actionContainer}>
                        <ButtonCTA
                            title="Khôi phục mật khẩu"
                            onPress={handleResetPassword}
                            disabled={!isFormValid}
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 20 },
    subtitle: { textAlign: 'center', marginBottom: 32, paddingHorizontal: 20, lineHeight: 22 },
    form: { marginBottom: 24, gap: 12 },
    actionContainer: { marginTop: 8 }
});