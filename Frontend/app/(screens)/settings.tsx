import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Appearance } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';

export default function SettingsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
    const [isNotifEnabled, setIsNotifEnabled] = useState(true);

    const handleThemeToggle = (val: boolean) => {
        setIsDarkMode(val);
        Appearance.setColorScheme(val ? 'dark' : 'light');
    };

    const SettingItem = ({ icon, title, color, type = 'navigate', isLast = false, value, onToggle, onPress }: any) => (
        <TouchableOpacity
            style={[styles.menuItem, !isLast && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
            onPress={type === 'navigate' || type === 'logout' ? onPress : undefined}
            activeOpacity={type === 'navigate' || type === 'logout' ? 0.7 : 1}
        >
            <View style={[styles.iconBox, { backgroundColor: colors.surfaceAlt }]}>
                <Icon name={icon as any} size={20} color={color} />
            </View>

            <Typography variant="bodyBase" style={[styles.menuTitle, { color: type === 'logout' ? colors.danger : colors.textPrimary }]}>
                {title}
            </Typography>

            {type === 'toggle' ? (
                <Switch
                    trackColor={{ false: colors.disabled, true: colors.primary }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor={colors.disabled}
                    onValueChange={onToggle}
                    value={value}
                />
            ) : type !== 'logout' ? (
                <Icon name="ChevronRight" size={20} color={colors.textSecondary} />
            ) : null}
        </TouchableOpacity>
    );

    const SettingGroup = ({ title, children }: any) => (
        <View style={styles.groupContainer}>
            <Typography variant="bodySmall" color={colors.textSecondary} style={styles.groupTitle}>
                {title}
            </Typography>
            <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {children}
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingBottom: insets.bottom }}>
            {/* --- HEADER --- */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Cài đặt
                </Typography>
                <View style={{ width: 40 }} />
            </View>

            {/* --- CONTENT --- */}
            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Nhóm 1: Tài khoản */}
                <SettingGroup title="Tài khoản">
                    <SettingItem icon="User" title="Thông tin cá nhân" color={colors.textPrimary} onPress={() => router.push('/personal-info')} />
                    <SettingItem icon="ShoppingBag" title="Lịch sử mua hàng" color={colors.textPrimary} onPress={() => { }} />
                    <SettingItem icon="Lock" title="Đổi mật khẩu" color={colors.textPrimary} isLast onPress={() => router.push('/change-password')} />
                </SettingGroup>

                {/* Nhóm 2: Hệ thống & Tùy chỉnh */}
                <SettingGroup title="Hệ thống">
                    <SettingItem
                        type="toggle"
                        icon="Moon"
                        title="Chế độ tối (Dark Mode)"
                        color={colors.textPrimary}
                        value={isDarkMode}
                        onToggle={handleThemeToggle}
                    />
                    <SettingItem
                        type="toggle"
                        icon="Bell"
                        title="Thông báo"
                        color={colors.textPrimary}
                        value={isNotifEnabled}
                        onToggle={(val: boolean) => setIsNotifEnabled(val)}
                    />
                    <SettingItem icon="Globe" title="Ngôn ngữ" color={colors.textPrimary} isLast onPress={() => { }} />
                </SettingGroup>

                {/* Nhóm 3: Khác */}
                <SettingGroup title="Khác">
                    <SettingItem icon="UserPlus" title="Mời bạn bè" color={colors.textPrimary} onPress={() => router.push('/invite-friends')} />
                    <SettingItem icon="LifeBuoy" title="Hỗ trợ & Trợ giúp" color={colors.textPrimary} isLast onPress={() => { }} />
                </SettingGroup>

                {/* Nút Đăng xuất */}
                <View style={{ marginTop: 12 }}>
                    <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <SettingItem
                            type="logout"
                            icon="LogOut"
                            title="Đăng xuất"
                            color={colors.danger}
                            isLast
                            onPress={() => {
                                useAuthStore.getState().logout();
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { flex: 1, textAlign: 'center' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 8 },

    groupContainer: { marginBottom: 24 },
    groupTitle: { textTransform: 'uppercase', fontFamily: 'BeVietnamPro-Bold', letterSpacing: 0.5, marginBottom: 8, marginLeft: 8 },
    groupCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },

    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    menuTitle: { flex: 1, fontFamily: 'BeVietnamPro-Medium' }
});