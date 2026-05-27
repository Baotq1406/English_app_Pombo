import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COMBO_PACKS = [
    { id: 1, title: 'Khởi đầu rực rỡ', desc: '1000 Gem + 5000 Coin', price: '199.000đ', originalPrice: '350.000đ', icon: 'Rocket', colorKey: 'secondary', bgKey: 'surfaceBlue' },
    { id: 2, title: 'Chiến Thần', desc: 'Gói từ vựng Vip + 2000 Gem', price: '499.000đ', originalPrice: '800.000đ', icon: 'Crown', colorKey: 'warning', bgKey: 'surfaceYellow' },
    { id: 3, title: 'Học bá', desc: 'Mở khóa tất cả khóa học', price: '999.000đ', originalPrice: '1.500.000đ', icon: 'BookOpen', colorKey: 'rankMaster', bgKey: 'surfacePink' },
];

export default function StoreScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [balances] = useState({
        coin: 1255,
        gem: 5000,
    });

    const StoreCard = ({ title, subtitle, actionText, icon, color, bgColor, onPress }: any) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: bgColor, borderColor: color }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.cardTop}>
                <Typography variant="caption" style={{ color: color, fontFamily: 'BeVietnamPro-Bold' }}>{subtitle}</Typography>
                <Typography variant="bodyLarge" style={{ color: color, fontFamily: 'Baloo2-Bold', marginTop: -2 }}>{title}</Typography>
            </View>
            <View style={styles.iconContainer}>
                <Icon name={icon} size={64} color={color} strokeWidth={1.5} />
            </View>
            <View style={styles.cardBottom}>
                <Typography variant="bodySmall" style={{ color: color, textAlign: 'center' }}>{actionText}</Typography>
            </View>
        </TouchableOpacity>
    );

    const ComboCard = ({ item }: { item: typeof COMBO_PACKS[0] }) => {
        const itemColor = colors[item.colorKey as keyof typeof colors] as string;
        const itemBg = colors[item.bgKey as keyof typeof colors] as string;

        return (
            <TouchableOpacity style={[styles.comboCard, { backgroundColor: itemBg, borderColor: itemColor }]} activeOpacity={0.8}>
                <View style={[styles.comboIconBox, { backgroundColor: colors.surface }]}>
                    <Icon name={item.icon as any} size={28} color={itemColor} />
                </View>
                <View style={styles.comboInfo}>
                    <Typography variant="bodySmall" style={{ fontFamily: 'BeVietnamPro-Bold', color: colors.textPrimary }}>{item.title}</Typography>
                    <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 2, fontSize: 11 }}>{item.desc}</Typography>
                    <View style={styles.comboPriceRow}>
                        <Typography variant="bodyBase" style={{ color: itemColor, fontFamily: 'Baloo2-Bold' }}>{item.price}</Typography>
                        <Typography variant="tiny" style={{ textDecorationLine: 'line-through', color: colors.textSecondary, marginLeft: 6 }}>{item.originalPrice}</Typography>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingBottom: insets.bottom }}>

            {/* --- HEADER --- */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), justifyContent: 'center' }]}>
                <Typography variant="h2" color={colors.textPrimary} style={{ textAlign: 'center' }}>
                    Cửa hàng POMBO
                </Typography>
            </View>

            {/* --- THANH TÀI SẢN (BALANCES) --- */}
            <View style={[styles.balanceContainer, { borderBottomColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.balancePill, { borderColor: colors.border, backgroundColor: colors.surface }]}
                    onPress={() => router.push('/resource-shop?type=coin')}
                >
                    <Icon name="Coins" size={16} color={colors.warning} />
                    <Typography variant="bodySmall" color={colors.textPrimary} style={{ marginLeft: 6, fontFamily: 'BeVietnamPro-Bold' }}>{balances.coin.toLocaleString()}</Typography>
                    <View style={{ marginLeft: 4 }}><Icon name="Plus" size={14} color={colors.textSecondary} /></View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.balancePill, { borderColor: colors.border, backgroundColor: colors.surface }]}
                    onPress={() => router.push('/resource-shop?type=gem')}
                >
                    <Icon name="Gem" size={16} color={colors.rankMaster} />
                    <Typography variant="bodySmall" color={colors.textPrimary} style={{ marginLeft: 6, fontFamily: 'BeVietnamPro-Bold' }}>{balances.gem.toLocaleString()}</Typography>
                    <View style={{ marginLeft: 4 }}><Icon name="Plus" size={14} color={colors.textSecondary} /></View>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingTop: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >

                {/* --- GRID 4 NÚT CHÍNH --- */}
                <View style={styles.gridContainer}>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <StoreCard
                                subtitle="Cửa hàng" title="Gói từ vựng" actionText="Thử vận may ngay"
                                icon="Package" color={colors.primary} bgColor={colors.surfaceGreen}
                                onPress={() => router.push('/vocab-shop')}
                            />
                        </View>
                        <View style={styles.col}>
                            <StoreCard
                                subtitle="Cửa hàng" title="Khóa học" actionText="Khám phá ngay"
                                icon="GraduationCap" color={colors.secondary} bgColor={colors.surfaceBlue}
                                onPress={() => router.push('/course-shop')}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.col}>
                            <StoreCard
                                subtitle="Cửa hàng" title="Coin" actionText="Thiếu coin ư?"
                                icon="Coins" color={colors.warning} bgColor={colors.surfaceYellow}
                                onPress={() => router.push('/resource-shop?type=coin')}
                            />
                        </View>
                        <View style={styles.col}>
                            <StoreCard
                                subtitle="Cửa hàng" title="Gem" actionText="Lấp lánh"
                                icon="Gem" color={colors.rankMaster} bgColor={colors.surfacePink}
                                onPress={() => router.push('/resource-shop?type=gem')}
                            />
                        </View>
                    </View>
                </View>

                {/* --- COMBO HẤP DẪN --- */}
                <View style={styles.sectionHeader}>
                    <Typography variant="h3" color={colors.textPrimary}>Combo Hấp Dẫn</Typography>
                    <TouchableOpacity>
                        <Typography variant="bodySmall" color={colors.primary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>Xem tất cả</Typography>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    nestedScrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.comboScrollContainer}
                >
                    {COMBO_PACKS.map((combo) => (
                        <ComboCard key={combo.id} item={combo} />
                    ))}
                </ScrollView>

                <View style={{ height: 60 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { flex: 1, textAlign: 'center' },
    balanceContainer: { flexDirection: 'row', justifyContent: 'center', gap: 12, paddingBottom: 16, borderBottomWidth: 1, paddingHorizontal: 20 },
    balancePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
    scrollContent: { paddingTop: 24 },

    gridContainer: { gap: 16, paddingHorizontal: 20 },
    row: { flexDirection: 'row', gap: 16 },
    col: { flex: 1 },
    card: { borderRadius: 24, borderWidth: 2, padding: 16, height: 200, justifyContent: 'space-between' },
    cardTop: { alignItems: 'flex-start' },
    iconContainer: { alignItems: 'center', justifyContent: 'center', flex: 1 },
    cardBottom: { alignItems: 'center', marginTop: 8 },

    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, marginBottom: 16, paddingHorizontal: 20 },
    comboScrollContainer: { gap: 16, paddingHorizontal: 20 },
    comboCard: { flexDirection: 'row', width: 280, padding: 16, borderRadius: 20, borderWidth: 1.5, alignItems: 'center' },
    comboIconBox: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    comboInfo: { flex: 1, justifyContent: 'center' },
    comboPriceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
});