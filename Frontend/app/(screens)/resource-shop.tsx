import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSpring } from 'react-native-reanimated';

const GEM_PACKS = [
    { id: 0, amount: 1000, originalPrice: '500.000đ', price: '299.000đ', discount: '-40%', isFeatured: true, label: 'SIÊU HẤP DẪN' },
    { id: 1, amount: 50, originalPrice: '50.000đ', price: '49.000đ', discount: null, subLabel: 'Khởi đầu êm ái' },
    { id: 2, amount: 180, originalPrice: '120.000đ', price: '99.000đ', discount: '-17%', isHot: true, label: 'BÁN CHẠY' },
    { id: 3, amount: 500, originalPrice: '250.000đ', price: '199.000đ', discount: '-20%' },
    { id: 4, amount: 1200, originalPrice: '500.000đ', price: '399.000đ', discount: '-20%', isHot: true, label: 'HOT' },
];

const COIN_PACKS = [
    { id: 0, amount: 10000, originalPrice: '1.500', price: '999', discount: '-33%', isFeatured: true, label: 'TỶ PHÚ COIN' },
    { id: 1, amount: 500, originalPrice: '55', price: '50', discount: null, subLabel: 'Dùng thử ngay' },
    { id: 2, amount: 1200, originalPrice: '150', price: '100', discount: '-33%', isHot: true, label: 'BÁN CHẠY' },
    { id: 3, amount: 3000, originalPrice: '250', price: '200', discount: '-20%' },
    { id: 4, amount: 8000, originalPrice: '700', price: '500', discount: '-28%', isHot: true, label: 'X2 COIN' },
];

export default function ResourceStoreScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const storeType = params.type === 'coin' ? 'coin' : 'gem';

    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [balances, setBalances] = useState({ coin: 1255, gem: 5000 });
    const [showAnimation, setShowAnimation] = useState(false);
    const [rewardAmount, setRewardAmount] = useState(0);

    const isGem = storeType === 'gem';
    const storeColor = isGem ? colors.rankMaster : colors.warning;

    const storeIcon = isGem ? 'Gem' : 'Coins';
    const storeTitle = isGem ? 'Cửa hàng Gem' : 'Cửa hàng Coin';
    const priceCurrencyIcon = isGem ? null : 'Gem';

    const PACKS = isGem ? GEM_PACKS : COIN_PACKS;
    const featuredPack = PACKS.find(p => p.isFeatured);
    const normalPacks = PACKS.filter(p => !p.isFeatured);

    const rotation = useSharedValue(0);
    const scale = useSharedValue(0);

    const startAnimation = () => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 6000, easing: Easing.linear }),
            -1, false
        );
        scale.value = withSpring(1, { damping: 12, stiffness: 90 });
    };

    const stopAnimation = () => {
        rotation.value = 0;
        scale.value = 0;
    };

    const handlePurchase = (pack: any) => {
        setRewardAmount(pack.amount);
        setShowAnimation(true);
        startAnimation();

        setTimeout(() => {
            setShowAnimation(false);
            stopAnimation();
            setBalances(prev => ({
                ...prev,
                [storeType]: prev[storeType as keyof typeof prev] + pack.amount
            }));
        }, 2500);
    };

    const animatedRaysStyle = useAnimatedStyle(() => ({
        transform: [{ rotateZ: `${rotation.value}deg` }],
    }));

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const SunburstRays = () => {
        const rayCount = 12;
        return (
            <Animated.View style={[styles.raysContainer, animatedRaysStyle]}>
                {Array.from({ length: rayCount }).map((_, i) => (
                    <View
                        key={i}
                        style={[styles.rayItem, { transform: [{ rotate: `${(360 / rayCount) * i}deg` }] }]}
                    />
                ))}
            </Animated.View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingBottom: insets.bottom }}>

            {/* --- HEADER --- */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerTitleWrapper}>
                    <Typography variant="h2" color={colors.textPrimary}>{storeTitle}</Typography>
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

                {/* --- GÓI ĐẶC BIỆT LÀM MỚI (PREMIUM LAYOUT) --- */}
                {featuredPack && (
                    <TouchableOpacity
                        style={[
                            styles.premiumCard,
                            { backgroundColor: isGem ? colors.surfacePink : colors.surfaceYellow, borderColor: storeColor }
                        ]}
                        activeOpacity={0.8}
                        onPress={() => handlePurchase(featuredPack)}
                    >
                        {/* Ruy băng góc trái siêu xịn */}
                        <View style={[styles.premiumBadge, { backgroundColor: storeColor }]}>
                            <Icon name="Sparkles" size={14} color="#FFF" />
                            <Typography variant="tiny" style={{ color: '#FFF', fontFamily: 'BeVietnamPro-Bold', marginLeft: 4 }}>
                                {featuredPack.label}
                            </Typography>
                        </View>

                        <View style={styles.premiumBody}>
                            <View style={{ flex: 1 }}>
                                <Typography variant="h1" style={{ color: storeColor, fontFamily: 'Baloo2-ExtraBold', fontSize: 40, lineHeight: 48 }}>
                                    {featuredPack.amount.toLocaleString()}
                                </Typography>
                                <Typography variant="bodySmall" color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                                    {isGem ? 'Gems Lấp Lánh' : 'Coins Khổng Lồ'}
                                </Typography>
                            </View>
                            <Icon name={storeIcon as any} size={80} color={storeColor} strokeWidth={1.5} />
                        </View>

                        {/* Nút thanh toán full width (Có giá gốc & discount) */}
                        <View style={[styles.premiumButton, { backgroundColor: storeColor }]}>
                            <View style={{ alignItems: 'center' }}>
                                {featuredPack.discount && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                                        <Typography variant="caption" style={{ textDecorationLine: 'line-through', color: 'rgba(255,255,255,0.7)', marginRight: 6 }}>
                                            {featuredPack.originalPrice}
                                        </Typography>
                                        <View style={{ backgroundColor: colors.danger, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                                            <Typography variant="tiny" style={{ color: '#FFF', fontFamily: 'BeVietnamPro-Bold', fontSize: 10 }}>
                                                {featuredPack.discount}
                                            </Typography>
                                        </View>
                                    </View>
                                )}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {priceCurrencyIcon && (
                                        <View style={{ marginRight: 6 }}><Icon name={priceCurrencyIcon as any} size={18} color="#FFF" /></View>
                                    )}
                                    <Typography variant="buttonCTA" color="#FFF">
                                        {featuredPack.price}
                                    </Typography>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {/* --- DANH SÁCH GÓI BÌNH THƯỜNG --- */}
                <View style={styles.gridContainer}>
                    {normalPacks.map((pack) => (
                        <View key={pack.id} style={styles.col}>
                            <TouchableOpacity
                                style={[styles.packCard, { backgroundColor: colors.surface, borderColor: pack.isHot ? storeColor : colors.border }]}
                                activeOpacity={0.7}
                                onPress={() => handlePurchase(pack)}
                            >
                                {pack.isHot && (
                                    <View style={[styles.hotBadge, { backgroundColor: storeColor }]}>
                                        <Typography variant="tiny" style={{ color: '#FFF', fontFamily: 'BeVietnamPro-Bold' }}>
                                            {pack.label}
                                        </Typography>
                                    </View>
                                )}

                                <View style={[styles.packIconWrapper, { backgroundColor: isGem ? colors.surfacePink : colors.surfaceYellow }]}>
                                    <Icon name={storeIcon as any} size={32} color={storeColor} strokeWidth={2} />
                                </View>

                                <Typography variant="h3" color={colors.textPrimary} style={{ marginTop: 8 }}>
                                    {pack.amount.toLocaleString()}
                                </Typography>

                                {/* Vùng chứa thông tin phụ (Giảm giá hoặc SubLabel) */}
                                <View style={styles.discountWrapper}>
                                    {pack.discount ? (
                                        <>
                                            <Typography variant="tiny" style={{ textDecorationLine: 'line-through', color: colors.textSecondary, marginRight: 6 }}>
                                                {pack.originalPrice}
                                            </Typography>
                                            <View style={[styles.discountBadge, { backgroundColor: colors.danger }]}>
                                                <Typography variant="tiny" style={{ color: '#FFF', fontSize: 9, fontFamily: 'BeVietnamPro-Bold' }}>
                                                    {pack.discount}
                                                </Typography>
                                            </View>
                                        </>
                                    ) : pack.subLabel ? (
                                        /* HIỂN THỊ SUBLABEL RIÊNG CHO TỪNG GÓI */
                                        <Typography variant="tiny" style={{ color: storeColor, opacity: 0.8, fontFamily: 'BeVietnamPro-Medium' }}>
                                            {pack.subLabel}
                                        </Typography>
                                    ) : null}
                                </View>

                                {/* Nút giá tiền mới */}
                                <View style={[styles.priceButton, { borderColor: storeColor, backgroundColor: isGem ? colors.surfacePink : colors.surfaceYellow }]}>
                                    {priceCurrencyIcon && (
                                        <View style={{ marginRight: 4 }}><Icon name={priceCurrencyIcon as any} size={14} color={storeColor} strokeWidth={2.5} /></View>
                                    )}
                                    <Typography variant="bodySmall" color={storeColor} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                                        {pack.price}
                                    </Typography>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* --- OVERLAY ANIMATION NỔ HŨ --- */}
            <Modal visible={showAnimation} transparent animationType="fade">
                <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.85)' }]}>
                    <SunburstRays />

                    <Animated.View style={[styles.rewardIconWrapper, animatedIconStyle]}>
                        <Icon name={storeIcon as any} size={140} color={storeColor} strokeWidth={2.5} />

                        <Typography variant="display" style={{ color: '#FFF', marginTop: 16, fontFamily: 'Baloo2-ExtraBold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 8 }}>
                            +{rewardAmount}
                        </Typography>
                        <Typography variant="h2" style={{ color: colors.surfaceYellow }}>
                            Tuyệt vời!
                        </Typography>
                    </Animated.View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitleWrapper: { flex: 1, paddingLeft: 8 },

    miniBalances: { flexDirection: 'row', gap: 8 },
    miniBalancePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },

    scrollContent: { paddingHorizontal: 20, paddingTop: 16 },

    premiumCard: { borderRadius: 24, borderWidth: 2, padding: 20, paddingTop: 32, marginBottom: 24, position: 'relative', overflow: 'hidden' },
    premiumBadge: { position: 'absolute', top: 0, left: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 6, borderBottomRightRadius: 16 },
    premiumBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    premiumButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 16 },

    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
    col: { width: '47%' },

    packCard: { borderRadius: 20, borderWidth: 1.5, padding: 12, alignItems: 'center', position: 'relative', height: 210 },
    packIconWrapper: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
    hotBadge: { position: 'absolute', top: -12, right: -10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, zIndex: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },

    discountWrapper: { minHeight: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
    discountBadge: { paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
    priceButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingVertical: 8, borderRadius: 12, borderWidth: 1.5, marginTop: 'auto' },

    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    raysContainer: { position: 'absolute', width: 1000, height: 1000, justifyContent: 'center', alignItems: 'center', opacity: 0.25 },
    rayItem: { position: 'absolute', width: 1000, height: 60, backgroundColor: '#FFFFFF' },
    rewardIconWrapper: { alignItems: 'center', justifyContent: 'center', zIndex: 10 }
});