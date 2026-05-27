import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { InputField } from '@/components/ui/InputField';
import { ButtonCTA } from '@/components/ui/ButtonCTA';
import { HeaderAuth } from '@/components/ui/HeaderAuth';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const [email, setEmail] = useState('');

    const handleContinue = () => {
        router.push({
            pathname: '/(auth)/verification',
            params: { email: email }
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <HeaderAuth title="Quên mật khẩu" />

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
                        Điền thông tin email của bạn bên dưới để khôi phục mật khẩu
                    </Typography>

                    <View style={styles.form}>
                        <InputField
                            placeholder="Email của bạn"
                            leftIcon="Mail"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.actionContainer}>
                        {/* Nút chỉ bấm được khi đã nhập chữ vào ô email */}
                        <ButtonCTA
                            title="Tiếp tục"
                            onPress={handleContinue}
                            disabled={!email.trim()}
                        />
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
        paddingTop: 20
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
        lineHeight: 22
    },
    form: {
        marginBottom: 24,
    },
    actionContainer: {
        marginTop: 8
    }
});