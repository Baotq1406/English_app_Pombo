import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PasswordInput = ({ label, value, onChangeText, showPassword, onToggleVisibility, placeholder, colors }: any) => (
    <View style={styles.inputContainer}>
        <Typography variant="caption" color={colors.textSecondary} style={{ marginBottom: 6, marginLeft: 4 }}>
            {label}
        </Typography>
        <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.leftIcon}>
                <Icon name="Lock" size={20} color={colors.textSecondary} />
            </View>
            <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={!showPassword}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
            />
            <TouchableOpacity onPress={onToggleVisibility} style={styles.rightIcon} activeOpacity={0.7}>
                <Icon name={showPassword ? "EyeOff" : "Eye" as any} size={20} color={colors.textSecondary} />
            </TouchableOpacity>
        </View>
    </View>
);

export default function ChangePasswordScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background, paddingBottom: insets.bottom }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {/* --- HEADER --- */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Đổi mật khẩu
                </Typography>
                <View style={{ width: 40 }} />
            </View>

            {/* --- CONTENT --- */}
            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 40) }]} showsVerticalScrollIndicator={false}>

                <View style={styles.iconHeaderWrapper}>
                    <View style={[styles.bigIconBg, { backgroundColor: colors.surfaceAlt }]}>
                        <Icon name="KeyRound" size={48} color={colors.primary} />
                    </View>
                    <Typography variant="bodyBase" color={colors.textSecondary} style={{ marginTop: 16, textAlign: 'center', paddingHorizontal: 20 }}>
                        Mật khẩu mới của bạn phải khác với các mật khẩu đã sử dụng trước đây.
                    </Typography>
                </View>

                {/* --- FORM NHẬP LIỆU --- */}
                <PasswordInput
                    label="Mật khẩu hiện tại"
                    placeholder="Nhập mật khẩu hiện tại"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    showPassword={showCurrent}
                    onToggleVisibility={() => setShowCurrent(!showCurrent)}
                    colors={colors}
                />

                <TouchableOpacity style={styles.forgotPasswordBtn}>
                    <Typography variant="bodySmall" color={colors.primary}>
                        Quên mật khẩu?
                    </Typography>
                </TouchableOpacity>

                <PasswordInput
                    label="Mật khẩu mới"
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    showPassword={showNew}
                    onToggleVisibility={() => setShowNew(!showNew)}
                    colors={colors}
                />

                <PasswordInput
                    label="Xác nhận mật khẩu mới"
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    showPassword={showConfirm}
                    onToggleVisibility={() => setShowConfirm(!showConfirm)}
                    colors={colors}
                />

                {/* --- NÚT XÁC NHẬN --- */}
                <TouchableOpacity
                    style={[
                        styles.submitBtn,
                        {
                            backgroundColor: (currentPassword && newPassword && confirmPassword) ? colors.primary : colors.disabled
                        }
                    ]}
                    onPress={() => {
                        if (currentPassword && newPassword && confirmPassword) {
                            console.log("Tiến hành đổi mật khẩu...");
                            router.back();
                        }
                    }}
                    disabled={!(currentPassword && newPassword && confirmPassword)}
                >
                    <Typography variant="buttonCTA" color="#FFF">Xác nhận</Typography>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { flex: 1, textAlign: 'center' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 16 },

    iconHeaderWrapper: { alignItems: 'center', marginBottom: 32 },
    bigIconBg: { width: 96, height: 96, borderRadius: 48, justifyContent: 'center', alignItems: 'center' },

    inputContainer: { marginBottom: 16 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16 },
    leftIcon: { marginRight: 12 },
    rightIcon: { marginLeft: 12, padding: 4 },
    input: { flex: 1, fontFamily: 'BeVietnamPro-Medium', fontSize: 16, height: '100%' },

    forgotPasswordBtn: { alignSelf: 'flex-end', marginBottom: 24, marginTop: -8 },

    submitBtn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
});