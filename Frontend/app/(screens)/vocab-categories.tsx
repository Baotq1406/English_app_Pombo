import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VocabCategoriesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const levelName = params.levelName || 'Mức độ A1 - Người mới bắt đầu';
    const [balances] = useState({ coin: 1255, gem: 5000 });
    const [searchQuery, setSearchQuery] = useState('');

    const CATEGORIES = [
        { id: 1, name: 'Du lịch', count: '150 từ vựng', icon: 'Plane' },
        { id: 2, name: 'Ẩm thực', count: '200 từ vựng', icon: 'Coffee' },
        { id: 3, name: 'Du học', count: '120 từ vựng', icon: 'GraduationCap' },
        { id: 4, name: 'Động vật', count: '80 từ vựng', icon: 'PawPrint' },
        { id: 5, name: 'Công nghệ', count: '300 từ vựng', icon: 'Laptop' },
        { id: 6, name: 'Kinh doanh', count: '250 từ vựng', icon: 'Briefcase' },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingBottom: insets.bottom }}>

            {/* HEADER TỐI GIẢN */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerTitleWrapper}>
                    <Typography variant="h2" color={colors.textPrimary}>Gói từ vựng</Typography>
                </View>

                {/* Balances */}
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
                <Typography variant="bodyBase" color={colors.textSecondary} style={{ marginBottom: 16 }}>
                    {levelName}
                </Typography>

                {/* SEARCH BAR */}
                <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Icon name="Search" size={20} color={colors.textSecondary} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.textPrimary, fontFamily: 'BeVietnamPro-Regular' }]}
                        placeholder="Tìm danh mục..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* DANH SÁCH CATEGORY */}
                <View style={styles.listContainer}>
                    {CATEGORIES.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.categoryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            activeOpacity={0.7}
                            onPress={() => router.push(`/vocab-packages?levelId=${params.levelId}&categoryName=${cat.name}` as any)}
                        >
                            <View style={[styles.iconBox, { backgroundColor: colors.surfaceGreen }]}>
                                <Icon name={cat.icon as any} size={20} color={colors.primary} />
                            </View>
                            <View style={styles.catInfo}>
                                <Typography variant="bodyBase" style={{ fontFamily: 'BeVietnamPro-Bold', color: colors.textPrimary }}>{cat.name}</Typography>
                                <Typography variant="caption" color={colors.textSecondary}>{cat.count}</Typography>
                            </View>
                            <Icon name="ChevronRight" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitleWrapper: { flex: 1, paddingLeft: 8 },
    miniBalances: { flexDirection: 'row', gap: 8 },
    miniBalancePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },

    scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14 },

    listContainer: { gap: 12 },
    categoryCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1 },
    iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    catInfo: { flex: 1 },
});