import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

const MOCK_DATA = {
    daily: [
        { id: '1', rank: 1, name: 'Eiden', score: 2430, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2000', isCurrentUser: false },
        { id: '2', rank: 2, name: 'Jackson', score: 1847, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974', isCurrentUser: false },
        { id: '3', rank: 3, name: 'Emma', score: 1674, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974', isCurrentUser: false },
        { id: '4', rank: 4, name: 'Marsha Fisher', score: 1350, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070', isCurrentUser: false },
        { id: '5', rank: 5, name: 'Juanita Cormier', score: 1284, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974', isCurrentUser: false },
        { id: '6', rank: 6, name: 'You', score: 1021, avatar: 'https://lol-skin.weblog.vc/img/wallpaper/tiles/Teemo_0.jpg?1773887081', isCurrentUser: true },
        { id: '7', rank: 7, name: 'Tamara Schmidt', score: 991, avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=2070', isCurrentUser: false },
        { id: '8', rank: 8, name: 'Ricardo Veum', score: 850, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2000', isCurrentUser: false },
        { id: '9', rank: 9, name: 'Gary Sanford', score: 720, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974', isCurrentUser: false },
        { id: '10', rank: 10, name: 'Linda Vance', score: 650, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070', isCurrentUser: false },
    ],
    monthly: [
        { id: '11', rank: 1, name: 'Emma', score: 15400, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974', isCurrentUser: false },
        { id: '12', rank: 2, name: 'Eiden', score: 14200, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2000', isCurrentUser: false },
        { id: '13', rank: 3, name: 'You', score: 12500, avatar: 'https://lol-skin.weblog.vc/img/wallpaper/tiles/Teemo_0.jpg?1773887081', isCurrentUser: true },
        { id: '14', rank: 4, name: 'Jackson', score: 11000, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974', isCurrentUser: false },
        { id: '15', rank: 5, name: 'Marsha Fisher', score: 10500, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070', isCurrentUser: false },
        { id: '16', rank: 6, name: 'Tamara Schmidt', score: 9800, avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=2070', isCurrentUser: false },
        { id: '17', rank: 7, name: 'Juanita Cormier', score: 9100, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974', isCurrentUser: false },
        { id: '18', rank: 8, name: 'Gary Sanford', score: 8700, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974', isCurrentUser: false },
        { id: '19', rank: 9, name: 'Ricardo Veum', score: 8200, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2000', isCurrentUser: false },
        { id: '20', rank: 10, name: 'Linda Vance', score: 7500, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070', isCurrentUser: false },
    ],
    yearly: [
        { id: '21', rank: 1, name: 'You', score: 125000, avatar: 'https://lol-skin.weblog.vc/img/wallpaper/tiles/Teemo_0.jpg?1773887081', isCurrentUser: true },
        { id: '22', rank: 2, name: 'Eiden', score: 118000, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2000', isCurrentUser: false },
        { id: '23', rank: 3, name: 'Emma', score: 105000, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974', isCurrentUser: false },
        { id: '24', rank: 4, name: 'Jackson', score: 98000, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974', isCurrentUser: false },
        { id: '25', rank: 5, name: 'Marsha Fisher', score: 92000, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070', isCurrentUser: false },
        { id: '26', rank: 6, name: 'Tamara Schmidt', score: 85000, avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=2070', isCurrentUser: false },
        { id: '27', rank: 7, name: 'Juanita Cormier', score: 79000, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974', isCurrentUser: false },
        { id: '28', rank: 8, name: 'Gary Sanford', score: 74000, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974', isCurrentUser: false },
        { id: '29', rank: 9, name: 'Ricardo Veum', score: 68000, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2000', isCurrentUser: false },
        { id: '30', rank: 10, name: 'Linda Vance', score: 61000, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070', isCurrentUser: false },
    ]
};

export default function LeaderboardScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [timeFilter, setTimeFilter] = useState<'daily' | 'monthly' | 'yearly'>('daily');

    const currentData = MOCK_DATA[timeFilter];
    const top3 = currentData.slice(0, 3);
    const restList = currentData.slice(3);

    const getRankConfig = (rank: 1 | 2 | 3) => {
        switch (rank) {
            case 1: return { color: colors.warning, bgColor: colors.surfaceYellow, avatarSize: 76, cardHeight: 140, nameVariant: 'bodyBase' as const, scoreVariant: 'h3' as const };
            case 2: return { color: colors.secondary, bgColor: colors.surfaceBlue, avatarSize: 60, cardHeight: 110, nameVariant: 'bodySmall' as const, scoreVariant: 'bodyLarge' as const };
            case 3: return { color: colors.danger, bgColor: colors.surfacePink, avatarSize: 60, cardHeight: 110, nameVariant: 'bodySmall' as const, scoreVariant: 'bodyLarge' as const };
        }
    };

    const PodiumItem = ({ data, rank }: { data: any, rank: 1 | 2 | 3 }) => {
        if (!data) return <View style={{ width: '30%' }} />;

        const config = getRankConfig(rank);
        const isFirst = rank === 1;

        return (
            <View style={[styles.podiumCol, { zIndex: isFirst ? 10 : 5 }]}>
                {isFirst && (
                    <View style={styles.crownContainer}>
                        <Icon name="Crown" size={36} color={config.color} />
                    </View>
                )}

                <View style={[styles.avatarWrapper, { marginBottom: -20 }]}>
                    <Image
                        source={{ uri: data.avatar }}
                        style={[
                            styles.podiumAvatar,
                            { width: config.avatarSize, height: config.avatarSize, borderColor: config.color }
                        ]}
                    />
                    <View style={[styles.rankBadge, { backgroundColor: config.color }]}>
                        <Typography variant="tiny" style={{ color: '#FFF', fontFamily: 'BeVietnamPro-Bold' }}>{rank}</Typography>
                    </View>
                </View>

                {/* Khối Thẻ Bục (Podium Card) */}
                <View style={[
                    styles.podiumCard,
                    {
                        height: config.cardHeight,
                        backgroundColor: config.bgColor,
                        borderTopLeftRadius: rank === 2 ? 16 : isFirst ? 20 : 0,
                        borderTopRightRadius: rank === 3 ? 16 : isFirst ? 20 : 0,
                        shadowColor: isFirst ? config.color : '#000',
                    }
                ]}>
                    <Typography variant={config.nameVariant} color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold', textAlign: 'center', paddingHorizontal: 4 }} numberOfLines={1}>
                        {data.name}
                    </Typography>

                    <Typography variant={config.scoreVariant} color={config.color} style={{ textAlign: 'center', marginTop: 4 }}>
                        {data.score}
                    </Typography>
                    <Typography variant="tiny" color={config.color} style={{ textAlign: 'center', marginTop: -2, opacity: 0.8 }}>
                        từ
                    </Typography>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Bảng xếp hạng
                </Typography>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.filterContainer}>
                <View style={[styles.filterSegment, { backgroundColor: colors.surfaceAlt }]}>
                    {(['daily', 'monthly', 'yearly'] as const).map((filter) => {
                        const isActive = timeFilter === filter;
                        const label = filter === 'daily' ? 'Ngày' : filter === 'monthly' ? 'Tháng' : 'Năm';

                        return (
                            <TouchableOpacity
                                key={filter}
                                style={[styles.filterBtn, isActive && { backgroundColor: colors.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }]}
                                onPress={() => setTimeFilter(filter)}
                                activeOpacity={0.8}
                            >
                                <Typography variant="bodyBase" color={isActive ? colors.primary : colors.textSecondary} style={{ fontFamily: isActive ? 'BeVietnamPro-Bold' : 'BeVietnamPro-Medium' }}>
                                    {label}
                                </Typography>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* --- BỤC VINH QUANG TOP 3 --- */}
                <Animated.View entering={FadeInDown.duration(500)} style={styles.podiumSection}>
                    <PodiumItem data={top3[1]} rank={2} />
                    <PodiumItem data={top3[0]} rank={1} />
                    <PodiumItem data={top3[2]} rank={3} />
                </Animated.View>

                {/* --- DANH SÁCH TOP 4+ --- */}
                <Animated.View entering={FadeInDown.delay(300).duration(500)} style={[styles.listSection, { backgroundColor: colors.surface }]}>
                    {restList.map((user) => {
                        const isMe = user.isCurrentUser;
                        return (
                            <TouchableOpacity
                                key={user.id}
                                activeOpacity={0.7}
                                style={[
                                    styles.listItem,
                                    isMe ? { backgroundColor: colors.surfaceGreen, borderColor: colors.primary, borderWidth: 1 } : { backgroundColor: 'transparent' }
                                ]}
                            >
                                <Typography variant="bodyLarge" color={colors.textSecondary} style={{ width: 24, textAlign: 'center', fontFamily: 'BeVietnamPro-Bold' }}>
                                    {user.rank}
                                </Typography>

                                <Image source={{ uri: user.avatar }} style={styles.listAvatar} />

                                <Typography variant="bodyBase" color={colors.textPrimary} style={{ flex: 1, fontFamily: isMe ? 'BeVietnamPro-Bold' : 'BeVietnamPro-Medium' }} numberOfLines={1}>
                                    {user.name}
                                </Typography>

                                <Typography variant="bodySmall" color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                                    {user.score} từ
                                </Typography>
                            </TouchableOpacity>
                        );
                    })}

                    {restList.length === 0 && (
                        <Typography variant="bodyBase" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 20 }}>
                            Chưa có dữ liệu xếp hạng.
                        </Typography>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
    backButton: { padding: 4 },
    headerTitle: { fontWeight: '700', flex: 1, textAlign: 'center' },

    filterContainer: { paddingHorizontal: 20, marginBottom: 24 },
    filterSegment: { flexDirection: 'row', borderRadius: 24, padding: 4 },
    filterBtn: { flex: 1, paddingVertical: 10, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

    podiumSection: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 24, marginTop: 35 },
    podiumCol: { width: '31%', alignItems: 'center', marginHorizontal: -2 },

    crownContainer: { position: 'absolute', top: -38, zIndex: 20, elevation: 10 },
    avatarWrapper: { position: 'relative', zIndex: 10, alignItems: 'center' },
    podiumAvatar: { borderRadius: 40, borderWidth: 3, backgroundColor: '#FFF' },
    rankBadge: { position: 'absolute', bottom: -6, width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },

    podiumCard: { width: '100%', paddingTop: 32, paddingBottom: 16, elevation: 4, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },

    listSection: { borderRadius: 24, padding: 12, gap: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
    listItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16 },
    listAvatar: { width: 44, height: 44, borderRadius: 22, marginHorizontal: 12 },
});