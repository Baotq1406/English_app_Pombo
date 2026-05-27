import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const user = {
        name: 'Mr.T',
        email: 'mrt@gmail.com',
        avatar: 'https://lol-skin.weblog.vc/img/wallpaper/tiles/Teemo_0.jpg?1773887081',
        wordsLearned: 200,
        pomCoin: 100,
        gem: 100,
        stats: { streak: 12, courses: 10, words: 200 }
    };

    const SRS_DATA = [
        { level: 1, count: 10 },
        { level: 2, count: 20 },
        { level: 3, count: 30 },
        { level: 4, count: 40 },
        { level: 5, count: 50 },
    ];

    const getRankInfo = (words: number) => {
        if (words <= 100) return { title: 'Nhập môn', max: 100, color: colors.textSecondary };
        if (words <= 500) return { title: 'Tập sự', max: 500, color: colors.primary };
        if (words <= 1000) return { title: 'Học giả', max: 1000, color: colors.secondary };
        if (words <= 3000) return { title: 'Tinh anh', max: 3000, color: colors.warning };
        return { title: 'Bậc thầy', max: words, color: colors.rankMaster };
    };

    const rank = getRankInfo(user.wordsLearned);
    const progressPercent = Math.min((user.wordsLearned / rank.max) * 100, 100);

    const totalActiveWords = SRS_DATA.reduce((sum, d) => sum + d.count, 0);
    const CHART_HEIGHT = 120;

    const getBarColor = (level: number) => {
        if (level === 1) return colors.danger;
        if (level === 2) return colors.warning;
        if (level === 3) return colors.secondary;
        if (level === 4) return colors.primary;
        return colors.rankMaster;
    };

    const MenuItem = ({ icon, title, onPress, hideBorder = false }: any) => (
        <TouchableOpacity
            style={[
                styles.menuItem,
                { borderBottomWidth: hideBorder ? 0 : 1, borderBottomColor: colors.border }
            ]}
            onPress={onPress}
        >
            <View style={[styles.menuIconBox, { backgroundColor: colors.surfaceAlt }]}>
                <Icon name={icon} size={20} color={colors.textPrimary} />
            </View>
            <Typography variant="bodyBase" style={[styles.menuText, { color: colors.textPrimary }]}>{title}</Typography>
            <Icon name="ChevronRight" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>

            <View style={[styles.watermarkTopRight, { opacity: 0.05 }]}>
                <Icon name="Gem" size={180} color={colors.textPrimary} />
            </View>
            <View style={[styles.watermarkBottomLeft, { opacity: 0.05 }]}>
                <Icon name="Coins" size={220} color={colors.textPrimary} />
            </View>

            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Hồ sơ của tôi
                </Typography>
                <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsBtn}>
                    <Icon name="Settings" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={{ marginBottom: 90 + insets.bottom }}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: 20 }]}
                showsVerticalScrollIndicator={false}
            >

                <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    <Typography variant="h3" color={colors.textPrimary} style={{ marginTop: 16 }}>{user.name}</Typography>
                    <Typography variant="caption" color={colors.textSecondary}>{user.email}</Typography>

                    <View style={styles.assetContainer}>
                        <View style={[styles.assetBox, { backgroundColor: colors.surfaceYellow }]}>
                            <View style={styles.assetWatermark}>
                                <Icon name="Coins" size={80} color={colors.warning} />
                            </View>
                            <Typography variant="caption" style={{ color: colors.warning, fontFamily: 'BeVietnamPro-Bold' }}>Coins</Typography>
                            <Typography variant="h3" style={{ color: colors.warning }}>{user.pomCoin}</Typography>
                        </View>
                        <View style={[styles.assetBox, { backgroundColor: colors.surfacePink }]}>
                            <View style={styles.assetWatermark}>
                                <Icon name="Gem" size={80} color={colors.rankMaster} />
                            </View>
                            <Typography variant="caption" style={{ color: colors.rankMaster, fontFamily: 'BeVietnamPro-Bold' }}>Gems</Typography>
                            <Typography variant="h3" style={{ color: colors.rankMaster }}>{user.gem}</Typography>
                        </View>
                    </View>

                    <View style={[styles.rankContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
                        <View style={styles.rankHeader}>
                            <Typography variant="bodySmall" style={{ fontFamily: 'BeVietnamPro-Bold', color: rank.color }}>
                                Danh hiệu: {rank.title}
                            </Typography>
                            <Typography variant="caption" color={colors.textSecondary}>
                                {user.wordsLearned} / {rank.max} từ
                            </Typography>
                        </View>

                        <View style={[styles.progressBarBg, { backgroundColor: colors.disabled }]}>
                            <View style={[styles.progressBarFill, { backgroundColor: rank.color, width: `${progressPercent}%` }]} />
                        </View>

                        <Typography variant="tiny" color={colors.textSecondary} style={{ marginTop: 6, textAlign: 'center' }}>
                            {user.wordsLearned >= 3000 ? 'Bạn đã đạt cảnh giới cao nhất!' : `Cố lên! Còn ${rank.max - user.wordsLearned} từ nữa để thăng hạng`}
                        </Typography>
                    </View>
                </View>

                <View style={styles.statsGrid}>
                    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Icon name="Flame" size={26} color={colors.warning} />
                        <Typography variant="h2" color={colors.textPrimary} style={{ marginTop: 6 }}>{user.stats.streak}</Typography>
                        <Typography variant="caption" color={colors.textSecondary}>Chuỗi ngày</Typography>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Icon name="BookOpen" size={26} color={colors.secondary} />
                        <Typography variant="h2" color={colors.textPrimary} style={{ marginTop: 6 }}>{user.stats.courses}</Typography>
                        <Typography variant="caption" color={colors.textSecondary}>Khóa học</Typography>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Icon name="WholeWord" size={26} color={colors.primary} />
                        <Typography variant="h2" color={colors.textPrimary} style={{ marginTop: 6 }}>{user.stats.words}</Typography>
                        <Typography variant="caption" color={colors.textSecondary}>Từ vựng</Typography>
                    </View>
                </View>

                <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Typography variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>
                        Cấp độ ghi nhớ (SRS)
                    </Typography>

                    <Typography variant="tiny" color={colors.textSecondary} style={{ marginBottom: 12, lineHeight: 18 }}>
                        Đúng tiến 1 bước (Tối đa 5). Sai lùi 1 bước (Tối thiểu 1). Cấp 5 là mức độ ghi nhớ cao nhất.
                    </Typography>

                    <View style={[styles.chartContainer, { marginTop: 20 }]}>
                        {SRS_DATA.map((data, index) => {
                            const percent = Math.round((data.count / totalActiveWords) * 100);
                            const barHeight = (data.count / totalActiveWords) * CHART_HEIGHT;
                            const barColor = getBarColor(data.level);

                            return (
                                <View key={`bar-${index}`} style={styles.barWrapper}>
                                    <Typography variant="tiny" color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold', marginBottom: 6 }}>
                                        {data.count}
                                    </Typography>
                                    <Typography variant="tiny" color={colors.textSecondary} style={{ marginBottom: 8, fontSize: 10 }}>
                                        {percent}%
                                    </Typography>

                                    <View style={[styles.barBg, { backgroundColor: colors.surfaceAlt, height: CHART_HEIGHT }]}>
                                        <View style={[styles.barFill, { backgroundColor: barColor, height: Math.max(barHeight, 5) }]} />
                                    </View>

                                    <Typography variant="caption" color={colors.textPrimary} style={{ marginTop: 8, fontFamily: 'BeVietnamPro-Bold' }}>
                                        Cấp {data.level}
                                    </Typography>
                                </View>
                            );
                        })}
                    </View>
                </View>

                <Typography variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>
                    Hoạt động
                </Typography>
                <View style={[styles.menuContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <MenuItem icon="History" title="Lịch sử học tập" onPress={() => { }} />
                    <MenuItem icon="BarChart2" title="Thống kê chi tiết" onPress={() => { }} />
                    <MenuItem icon="Trophy" title="Thành tựu" onPress={() => router.push('/achievements')} />
                    <MenuItem icon="Users" title="Danh sách bạn bè" onPress={() => router.push('/friends-list')} hideBorder />
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    watermarkTopRight: { position: 'absolute', top: -20, right: -40, zIndex: -1 },
    watermarkBottomLeft: { position: 'absolute', bottom: 100, left: -60, zIndex: -1 },

    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16 },
    headerTitle: { flex: 1 },
    settingsBtn: { width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center' },

    scrollContent: { paddingHorizontal: 20, paddingTop: 8 },

    profileCard: { padding: 24, borderRadius: 20, borderWidth: 1, marginBottom: 24, alignItems: 'center' },
    avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#E2E8F0', borderWidth: 3, borderColor: '#fff' },

    assetContainer: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
    assetBox: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 12, overflow: 'hidden' },
    assetWatermark: { position: 'absolute', right: -10, bottom: -10, opacity: 0.08 },

    rankContainer: { width: '100%', marginTop: 20, padding: 16, borderRadius: 16, borderWidth: 1 },
    rankHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    progressBarBg: { width: '100%', height: 10, borderRadius: 5, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 5 },

    statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    statCard: { flex: 1, alignItems: 'center', paddingVertical: 18, borderRadius: 18, borderWidth: 1 },

    chartCard: { padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 32 },
    chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    barWrapper: { alignItems: 'center', width: 44 },
    barBg: { width: 24, borderRadius: 12, justifyContent: 'flex-end', overflow: 'hidden' },
    barFill: { width: '100%', borderRadius: 12 },

    sectionTitle: { marginBottom: 12, paddingHorizontal: 4 },
    menuContainer: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 20 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    menuIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    menuText: { flex: 1, fontFamily: 'BeVietnamPro-Medium' }
});