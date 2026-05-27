import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TOPIC_GROUPS = [
    {
        id: 'a1',
        title: 'Mức độ A1 - Người mới bắt đầu',
        topics: [
            { id: 1, name: 'Gia đình', icon: 'Users' },
            { id: 2, name: 'Đồ ăn', icon: 'Coffee' },
            { id: 3, name: 'Trường học', icon: 'School' },
            { id: 4, name: 'Động vật', icon: 'PawPrint' },
            { id: 5, name: 'Màu sắc', icon: 'Palette' },
            { id: 6, name: 'Khác', icon: 'LayoutGrid' },
        ]
    },
    {
        id: 'a2',
        title: 'Mức độ A2 - Sơ cấp',
        topics: [
            { id: 7, name: 'Mua sắm', icon: 'ShoppingCart' },
            { id: 8, name: 'Du lịch', icon: 'Plane' },
            { id: 9, name: 'Thời tiết', icon: 'CloudSun' },
            { id: 10, name: 'Sức khỏe', icon: 'HeartPulse' },
            { id: 11, name: 'Thể thao', icon: 'Activity' },
            { id: 12, name: 'Khác', icon: 'LayoutGrid' },
        ]
    },
    {
        id: 'b1',
        title: 'Mức độ B1 - Trung cấp',
        topics: [
            { id: 13, name: 'Môi trường', icon: 'Leaf' },
            { id: 14, name: 'Công nghệ', icon: 'Laptop' },
            { id: 15, name: 'Công việc', icon: 'Briefcase' },
            { id: 16, name: 'Giải trí', icon: 'Film' },
            { id: 17, name: 'Giao thông', icon: 'Car' },
            { id: 18, name: 'Khác', icon: 'LayoutGrid' },
        ]
    },
    {
        id: 'b2',
        title: 'Mức độ B2 - Trung cao cấp',
        topics: [
            { id: 19, name: 'Kinh tế', icon: 'TrendingUp' },
            { id: 20, name: 'Khoa học', icon: 'FlaskConical' },
            { id: 21, name: 'Nghệ thuật', icon: 'Palette' },
            { id: 22, name: 'Chính trị', icon: 'Landmark' },
            { id: 23, name: 'Xã hội', icon: 'Users' },
            { id: 24, name: 'Khác', icon: 'LayoutGrid' },
        ]
    },
    {
        id: 'c1',
        title: 'Mức độ C1 - Cao cấp',
        topics: [
            { id: 25, name: 'Tâm lý', icon: 'Brain' },
            { id: 26, name: 'Luật pháp', icon: 'Scale' },
            { id: 27, name: 'Y học', icon: 'Stethoscope' },
            { id: 28, name: 'Lịch sử', icon: 'Hourglass' },
            { id: 29, name: 'Triết học', icon: 'BookOpen' },
            { id: 30, name: 'Khác', icon: 'LayoutGrid' },
        ]
    },
    {
        id: 'c2',
        title: 'Mức độ C2 - Thành thạo',
        topics: [
            { id: 31, name: 'Học thuật', icon: 'GraduationCap' },
            { id: 32, name: 'Toàn cầu', icon: 'Globe' },
            { id: 33, name: 'Văn chương', icon: 'Feather' },
            { id: 34, name: 'Đạo đức', icon: 'HeartHandshake' },
            { id: 35, name: 'Công nghệ lõi', icon: 'Cpu' },
            { id: 36, name: 'Khác', icon: 'LayoutGrid' },
        ]
    }
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 40;

const BANNERS = [
    { id: '1', uri: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070', label: 'HOT NHẤT', colorKey: 'danger' },
    { id: '2', uri: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098', label: 'MỚI RA MẮT', colorKey: 'primary' },
    { id: '3', uri: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973', label: 'GIẢM 50%', colorKey: 'warning' },
];

export default function VocabStoreScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [balances] = useState({ coin: 1255, gem: 5000 });

    const flatListRef = useRef<FlatList>(null);
    const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            let nextIndex = currentBanner + 1;
            if (nextIndex >= BANNERS.length) nextIndex = 0;

            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            setCurrentBanner(nextIndex);
        }, 3000);

        return () => clearInterval(timer);
    }, [currentBanner]);

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / BANNER_WIDTH);
        setCurrentBanner(index);
    };

    const TopicItem = ({ item, groupId, groupTitle }: { item: any, groupId: string, groupTitle: string }) => (
        <TouchableOpacity
            style={[styles.topicBox, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.7}
            onPress={() => {
                if (item.name === 'Khác') {
                    router.push(`/vocab-categories?levelId=${groupId}&levelName=${groupTitle}` as any);
                } else {
                    router.push(`/vocab-packages?levelId=${groupId}&categoryName=${item.name}` as any);
                }
            }}
        >
            <View style={[styles.iconCircle, { backgroundColor: colors.surfaceAlt }]}>
                <Icon name={item.icon as any} size={24} color={colors.textPrimary} strokeWidth={1.5} />
            </View>
            <Typography variant="caption" color={colors.textPrimary} style={{ marginTop: 8, fontFamily: 'BeVietnamPro-Bold', textAlign: 'center' }} numberOfLines={1}>
                {item.name}
            </Typography>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingBottom: insets.bottom }}>

            {/* --- HEADER: Tích hợp Title và Balances --- */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>

                {/* Tiêu đề nằm ở giữa */}
                <View style={styles.headerTitleWrapper}>
                    <Typography variant="h2" color={colors.textPrimary} numberOfLines={1}>
                        Gói từ vựng
                    </Typography>
                </View>

                {/* Balances thu nhỏ */}
                <View style={styles.miniBalances}>
                    <View style={[styles.miniBalancePill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Icon name="Coins" size={14} color={colors.warning} />
                        <Typography variant="tiny" color={colors.textPrimary} style={{ marginLeft: 4, fontFamily: 'BeVietnamPro-Bold' }}>{balances.coin.toLocaleString()}</Typography>
                    </View>
                    <View style={[styles.miniBalancePill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Icon name="Gem" size={14} color={colors.rankMaster} />
                        <Typography variant="tiny" color={colors.textPrimary} style={{ marginLeft: 4, fontFamily: 'BeVietnamPro-Bold' }}>{balances.gem.toLocaleString()}</Typography>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* --- BANNER ƯU ĐÃI ĐẶC SẮC --- */}
                <View style={styles.sectionHeader}>
                    <Typography variant="bodyLarge" color={colors.textPrimary} style={{ fontFamily: 'Baloo2-Bold' }}>
                        Ưu đãi đặc sắc
                    </Typography>
                </View>

                {/* --- KHỐI BANNER CÓ FLATLIST --- */}
                <View>
                    <View style={styles.bannerContainer}>
                        <FlatList
                            ref={flatListRef}
                            data={BANNERS}
                            keyExtractor={(item) => item.id}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onMomentumScrollEnd={handleScroll}
                            renderItem={({ item }) => {
                                const badgeColor = colors[item.colorKey as keyof typeof colors] as string;

                                return (
                                    <TouchableOpacity style={{ width: BANNER_WIDTH, height: 180 }} activeOpacity={0.9}>
                                        <Image source={{ uri: item.uri }} style={styles.bannerImage} resizeMode="cover" />
                                        <View style={styles.bannerOverlay}>
                                            <View style={[styles.bannerBadge, { backgroundColor: badgeColor }]}>
                                                <Typography variant="tiny" style={{ color: '#FFF', fontFamily: 'BeVietnamPro-Bold' }}>
                                                    {item.label}
                                                </Typography>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>

                    {/* --- PAGINATION DOTS XANH LÁ --- */}
                    <View style={styles.paginationContainer}>
                        {BANNERS.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    { backgroundColor: currentBanner === index ? colors.primary : colors.border },
                                    currentBanner === index && { width: 16 }
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* --- DANH SÁCH MỨC ĐỘ (A1 - C2) --- */}
                {TOPIC_GROUPS.map((group) => (
                    <View key={group.id} style={styles.groupContainer}>
                        <Typography variant="bodySmall" color={colors.textSecondary} style={{ fontFamily: 'BeVietnamPro-Bold', marginBottom: 12 }}>
                            {group.title}
                        </Typography>

                        <View style={styles.gridContainer}>
                            {group.topics.map((topic) => (
                                <View key={topic.id} style={styles.gridItem}>
                                    <TopicItem item={topic} groupId={group.id} groupTitle={group.title} />
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                <View style={{ height: 40 }} />
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitleWrapper: { flex: 1, paddingHorizontal: 8 },

    miniBalances: { flexDirection: 'row', gap: 8 },
    miniBalancePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },

    scrollContent: { paddingHorizontal: 20, paddingTop: 16 },

    sectionHeader: { marginBottom: 12 },
    bannerContainer: { width: '100%', height: 180, borderRadius: 20, overflow: 'hidden', backgroundColor: '#E2E8F0' },
    bannerImage: { width: '100%', height: '100%' },
    bannerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 16 },
    bannerBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    paginationContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12, marginBottom: 24, gap: 6 },
    dot: { width: 6, height: 6, borderRadius: 3 },

    groupContainer: { marginBottom: 24 },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
    gridItem: { width: '33.33%', paddingHorizontal: 6, marginBottom: 12 },

    topicBox: { aspectRatio: 1, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 8 },
    iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
});