import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { ButtonCTA } from '@/components/ui/ButtonCTA';
import { HeaderAuth } from '@/components/ui/HeaderAuth';
import { OTPInput } from '@/components/ui/OTPInput';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export default function VerificationScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const { email } = useLocalSearchParams();

    const [otp, setOtp] = useState('');

    const handleVerify = () => {
        router.push('/(auth)/new-password' as any);
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <HeaderAuth title="Gần được rồi" />

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                    <Typography variant="bodyBase" color={colors.textSecondary} style={styles.subtitle}>
                        Vui lòng nhập mã 6 chữ số đã gửi đến email{' '}
                        <Typography variant="bodyBase" color={colors.primary}>{email || 'của bạn'}</Typography> để xác minh.
                    </Typography>

                    {/* Gọi Component OTP cực xịn vừa tạo */}
                    <OTPInput length={6} value={otp} onChange={setOtp} />

                    <View style={styles.actionContainer}>
                        <ButtonCTA
                            title="Xác minh"
                            onPress={handleVerify}
                            disabled={otp.length < 6}
                        />
                    </View>

                    <View style={styles.resendContainer}>
                        <Typography variant="bodySmall" color={colors.textSecondary}>Chưa nhận được mã? </Typography>
                        <TouchableOpacity>
                            <Typography variant="bodySmall" color={colors.primary}>Gửi lại mã</Typography>
                        </TouchableOpacity>
                    </View>
                    <Typography variant="caption" color={colors.textSecondary} align="center" style={{ marginTop: 8 }}>
                        Yêu cầu mã mới sau 02:00
                    </Typography>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 20 },
    subtitle: { textAlign: 'center', marginBottom: 32, paddingHorizontal: 10, lineHeight: 22 },
    actionContainer: { marginTop: 8, marginBottom: 24 },
    resendContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }
});