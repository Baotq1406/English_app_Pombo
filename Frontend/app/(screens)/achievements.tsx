import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MOCK_ACHIEVEMENTS = [
    { id: 1, title: 'Học giả chăm chỉ', description: 'Giữ chuỗi học tập liên tục', current: 14, target: 30, stars: 2, reward: 50, rewardType: 'coin', icon: 'Flame' },
    { id: 2, title: 'Bậc thầy từ vựng', description: 'Sở hữu số lượng từ vựng mới', current: 150, target: 200, stars: 3, reward: 10, rewardType: 'gem', icon: 'BookOpen' },
    { id: 3, title: 'Chuyên gia thi cử', description: 'Đạt điểm tuyệt đối trong bài thi', current: 5, target: 5, stars: 5, reward: 100, rewardType: 'gem', icon: 'Trophy' },
    { id: 4, title: 'Nhà sưu tầm', description: 'Hoàn thành các khóa học', current: 0, target: 1, stars: 0, reward: 100, rewardType: 'coin', icon: 'GraduationCap' },
    { id: 5, title: 'Người truyền lửa', description: 'Mời bạn bè tham gia ứng dụng', current: 2, target: 5, stars: 1, reward: 20, rewardType: 'gem', icon: 'Users' },
];

export default function AchievementsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const AchievementCard = ({ data }: { data: typeof MOCK_ACHIEVEMENTS[0] }) => {
        const isUnlocked = data.stars > 0;
        const isMaxed = data.stars === 5;
        const progressPercent = Math.min((data.current / data.target) * 100, 100);

        const getIconColor = (iconName: string) => {
            switch (iconName) {
                case 'Flame': return colors.warning;
                case 'BookOpen': return colors.secondary || colors.textSecondary;
                case 'Trophy': return colors.primary;
                case 'GraduationCap': return colors.danger;
                case 'Users': return colors.rankMaster;
                default: return colors.primary;
            }
        };

        const iconColor = isUnlocked ? getIconColor(data.icon) : colors.textSecondary;
        const iconBgColor = isUnlocked ? colors.surfaceAlt : colors.surface;
        const rewardColor = data.rewardType === 'coin' ? colors.warning : colors.rankMaster;
        const progressColor = progressPercent < 100 ? colors.secondary : colors.primary;

        return (
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, opacity: isUnlocked ? 1 : 0.7 }]}>

                {/* Phần Header Thẻ: Icon + Info + Reward Tag */}
                <View style={styles.cardHeader}>
                    <View style={[styles.iconBox, { backgroundColor: iconBgColor, borderColor: isUnlocked ? 'transparent' : colors.border, borderWidth: isUnlocked ? 0 : 1 }]}>
                        <Icon name={data.icon as any} size={28} color={iconColor} />
                    </View>

                    <View style={styles.infoBox}>
                        <Typography variant="bodyBase" color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                            {data.title}
                        </Typography>
                        <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                            {data.description}
                        </Typography>
                    </View>

                    {/* Badge Phần thưởng */}
                    {!isMaxed && (
                        <View style={[styles.rewardBadge, { backgroundColor: isUnlocked ? rewardColor : colors.surfaceAlt }]}>
                            <Typography variant="tiny" style={{ color: isUnlocked ? '#FFF' : colors.textSecondary, fontFamily: 'BeVietnamPro-Bold' }}>
                                +{data.reward} {data.rewardType === 'coin' ? 'Coins' : 'Gems'}
                            </Typography>
                        </View>
                    )}
                    {isMaxed && (
                        <View style={[styles.rewardBadge, { backgroundColor: colors.primary }]}>
                            <Typography variant="tiny" style={{ color: '#FFF', fontFamily: 'BeVietnamPro-Bold' }}>
                                TỐI ĐA
                            </Typography>
                        </View>
                    )}
                </View>

                {/* Thanh Tiến Trình (Progress Bar) */}
                <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                        <Typography variant="caption" color={colors.textSecondary}>Tiến độ</Typography>
                        <Typography variant="caption" color={progressColor} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                            {data.current} / {data.target}
                        </Typography>
                    </View>
                    <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                        <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: progressColor }]} />
                    </View>
                </View>

                {/* Dải 5 Ngôi Sao */}
                <View style={styles.starsWrapper}>
                    {[1, 2, 3, 4, 5].map((star) => {
                        const isHighlighted = star <= data.stars;

                        return (
                            <View key={star} style={{ marginHorizontal: 2 }}>
                                <Icon
                                    name="Star"
                                    size={20}
                                    color={isHighlighted ? colors.warning : colors.border}
                                    fill={isHighlighted ? colors.warning : 'none'}
                                />
                            </View>
                        );
                    })}
                </View>

            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingBottom: insets.bottom }}>

            {/* --- HEADER --- */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Thành tựu
                </Typography>
                <View style={{ width: 40 }} />
            </View>

            {/* --- DANH SÁCH THÀNH TỰU --- */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header minh họa nhỏ (Tùy chọn) */}
                <View style={styles.heroSection}>
                    <View style={[styles.heroIconBg, { backgroundColor: colors.surfaceAlt }]}>
                        <Icon name="Trophy" size={40} color={colors.primary} />
                    </View>
                    <Typography variant="bodyBase" color={colors.textSecondary} style={{ marginTop: 12, textAlign: 'center' }}>
                        Hoàn thành nhiệm vụ để thu thập sao và nhận thưởng giá trị!
                    </Typography>
                </View>

                {/* Render Cards */}
                {MOCK_ACHIEVEMENTS.map((achievement) => (
                    <AchievementCard key={achievement.id} data={achievement} />
                ))}

                <View style={{ height: 40 }} />
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { flex: 1, textAlign: 'center' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 8 },

    heroSection: { alignItems: 'center', marginBottom: 24, paddingHorizontal: 20 },
    heroIconBg: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },

    card: { borderRadius: 20, borderWidth: 1, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
    iconBox: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    infoBox: { flex: 1, justifyContent: 'center' },

    rewardBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 8 },

    progressSection: { marginBottom: 16 },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    progressTrack: { height: 8, borderRadius: 4, width: '100%', overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 4 },

    starsWrapper: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' }
});