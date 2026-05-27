import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Toast } from '@/components/ui/Toast';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

const MILESTONES = [
    { id: 1, count: 1, reward: 50, type: 'coin', icon: 'Coins' },
    { id: 2, count: 3, reward: 100, type: 'coin', icon: 'Coins' },
    { id: 3, count: 5, reward: 200, type: 'coin', icon: 'Coins' },
    { id: 4, count: 10, reward: 10, type: 'gem', icon: 'Gem' },
    { id: 5, count: 20, reward: 50, type: 'gem', icon: 'Gem' },
];

const INVITED_FRIENDS = [
    { id: 1, name: 'Nguyễn Hải Nam', date: '04/04/2026', avatar: 'https://statics.koreanbuilds.net/tile_200x200/Braum.webp' },
    { id: 2, name: 'Trần Minh Tuấn', date: '01/04/2026', avatar: 'https://cdn.modelviewer.lol/lol/tiles/111000.webp' },
];

export default function InviteFriendsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [invitedCount, setInvitedCount] = useState(2);
    const [toastConfig, setToastConfig] = useState({ visible: false, message: '', icon: 'Check' });
    const referralCode = "MRT-2026";
    const shareMessage = `Học tiếng Anh cực vui cùng mình! Nhập mã ${referralCode} để cả 2 cùng nhận quà nhé. Tải app tại: https://pombo.com/invite/${referralCode}`;

    const handleCopy = async () => {
        await Clipboard.setStringAsync(shareMessage);
        setToastConfig({ visible: true, message: 'Đã sao chép mã giới thiệu', icon: 'Check' });
        setTimeout(() => setToastConfig(prev => ({ ...prev, visible: false })), 2000);
    };

    const onShare = async () => {
        try {
            await Share.share({ message: shareMessage });
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingBottom: insets.bottom }}>
            {/* --- HEADER --- */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Mời bạn bè
                </Typography>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* --- LỜI CHÀO & MINH HỌA --- */}
                <View style={styles.heroSection}>
                    <View style={[styles.giftIconBg, { backgroundColor: colors.surfaceAlt }]}>
                        <Icon name="Gift" size={48} color={colors.primary} />
                    </View>
                    <Typography variant="h2" color={colors.textPrimary} style={{ marginTop: 16, textAlign: 'center' }}>
                        Cùng học, cùng vui!
                    </Typography>
                    <Typography variant="bodyBase" color={colors.textSecondary} style={{ marginTop: 8, textAlign: 'center', paddingHorizontal: 20 }}>
                        Mời bạn bè tham gia để cả hai cùng nhận xu POM và Gem giá trị nhé.
                    </Typography>
                </View>

                {/* --- KHU VỰC QR CODE & LINK --- */}
                <View style={[styles.qrCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {/* Giả lập QR Code */}
                    <View style={[styles.qrPlaceholder, { backgroundColor: colors.surfaceAlt }]}>
                        <Icon name="QrCode" size={100} color={colors.textPrimary} />
                    </View>

                    <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 16 }}>
                        Mã giới thiệu của bạn
                    </Typography>

                    <View style={styles.codeWrapper}>
                        <Typography variant="h2" color={colors.primary} style={{ letterSpacing: 2 }}>
                            {referralCode}
                        </Typography>
                        <TouchableOpacity style={[styles.copyBtn, { backgroundColor: colors.surfaceAlt }]} onPress={handleCopy}>
                            <Icon name="Copy" size={20} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* --- NÚT NATIVE SHARE --- */}
                <TouchableOpacity style={[styles.shareBtn, { backgroundColor: colors.primary }]} onPress={onShare}>
                    <View style={{ marginRight: 8 }}>
                        <Icon name="Share2" size={20} color="#FFF" />
                    </View>
                    <Typography variant="buttonCTA" color="#FFF">Chia sẻ ngay</Typography>
                </TouchableOpacity>

                {/* --- THANH TIẾN TRÌNH NHẬN THƯỞNG --- */}
                <View style={[styles.milestoneContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.milestoneHeader}>
                        <Typography variant="h3" color={colors.textPrimary}>Tiến trình nhận thưởng</Typography>
                        <Typography variant="bodyBase" color={colors.primary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                            Đã mời: {invitedCount}
                        </Typography>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 4 }}>
                        {MILESTONES.map((milestone, index) => {
                            const isAchieved = invitedCount >= milestone.count;
                            const isNext = invitedCount < milestone.count && (index === 0 || invitedCount >= MILESTONES[index - 1].count);
                            const rewardColor = milestone.type === 'coin' ? colors.warning : (colors.rankMaster);

                            return (
                                <View key={milestone.id} style={styles.milestoneItem}>
                                    {/* Dây nối giữa các mốc */}
                                    {index < MILESTONES.length - 1 && (
                                        <View style={[styles.connectingLine, { backgroundColor: isAchieved ? colors.primary : colors.border }]} />
                                    )}

                                    {/* Hộp quà tặng */}
                                    <View style={[
                                        styles.rewardBox,
                                        {
                                            backgroundColor: isAchieved ? rewardColor : colors.surfaceAlt,
                                            borderColor: isNext ? rewardColor : 'transparent',
                                            borderWidth: isNext ? 2 : 0,
                                            opacity: isAchieved || isNext ? 1 : 0.5
                                        }
                                    ]}>
                                        <Icon name={milestone.icon as any} size={24} color={isAchieved ? '#FFF' : colors.textSecondary} />
                                    </View>

                                    {/* Số phần thưởng */}
                                    <Typography variant="caption" style={{ color: isAchieved ? rewardColor : colors.textSecondary, fontFamily: 'BeVietnamPro-Bold', marginTop: 8 }}>
                                        +{milestone.reward} {milestone.type === 'coin' ? 'Coins' : 'Gems'}
                                    </Typography>

                                    {/* Mốc số người */}
                                    <View style={[styles.countBadge, { backgroundColor: isAchieved ? colors.primary : colors.surfaceAlt }]}>
                                        <Typography variant="tiny" style={{ color: isAchieved ? '#FFF' : colors.textSecondary }}>
                                            {milestone.count} bạn
                                        </Typography>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* --- DANH SÁCH BẠN BÈ ĐÃ MỜI --- */}
                <View style={styles.listContainer}>
                    <Typography variant="h3" color={colors.textPrimary} style={{ marginBottom: 16 }}>
                        Bạn bè đã tham gia ({INVITED_FRIENDS.length})
                    </Typography>

                    {INVITED_FRIENDS.length > 0 ? (
                        INVITED_FRIENDS.map((friend) => (
                            <View key={friend.id} style={[styles.friendItem, { borderBottomColor: colors.border }]}>
                                <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
                                <View style={{ flex: 1 }}>
                                    <Typography variant="bodyBase" color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Medium' }}>
                                        {friend.name}
                                    </Typography>
                                    <Typography variant="caption" color={colors.textSecondary}>
                                        Tham gia: {friend.date}
                                    </Typography>
                                </View>
                                <View style={[styles.successBadge, { backgroundColor: colors.surfaceAlt }]}>
                                    <Icon name="CheckCircle2" size={16} color={colors.primary} />
                                    <Typography variant="tiny" color={colors.primary} style={{ marginLeft: 4, fontFamily: 'BeVietnamPro-Bold' }}>
                                        Thành công
                                    </Typography>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Typography variant="bodyBase" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 16 }}>
                            Chưa có bạn bè nào tham gia.
                        </Typography>
                    )}
                </View>

                {/* Khoảng trống dưới cùng */}
                <View style={{ height: 40 }} />
            </ScrollView>

            <Toast
                visible={toastConfig.visible}
                message={toastConfig.message}
                icon={toastConfig.icon}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { flex: 1, textAlign: 'center' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 16 },

    heroSection: { alignItems: 'center', marginBottom: 24 },
    giftIconBg: { width: 88, height: 88, borderRadius: 44, justifyContent: 'center', alignItems: 'center' },

    qrCard: { borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, marginBottom: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
    qrPlaceholder: { width: 160, height: 160, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    codeWrapper: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 },
    copyBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

    shareBtn: { flexDirection: 'row', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 32, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },

    milestoneContainer: { borderRadius: 24, padding: 20, borderWidth: 1 },
    milestoneHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    milestoneItem: { alignItems: 'center', width: 80, position: 'relative' },
    connectingLine: { position: 'absolute', top: 24, left: 40, right: -40, height: 4, zIndex: -1 },
    rewardBox: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 4 },

    listContainer: { marginTop: 32 },
    friendItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
    friendAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: '#E2E8F0' },
    successBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
});