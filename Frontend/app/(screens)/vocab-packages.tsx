import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSpring, withSequence, withDelay } from 'react-native-reanimated';

const PACKS = [
    { id: 'x50', title: 'Gói Đặc Quyền', amount: 'X50', originalPrice: '5.000', price: '2.500', discount: '-50%', isFeatured: true, label: 'SIÊU LỜI' },
    { id: 'x5', title: 'Gói Khởi Động', amount: 'X5', originalPrice: null, price: '300', discount: null, subLabel: 'Bốc thử xem sao' },
    { id: 'x10', title: 'Gói Cơ Bản', amount: 'X10', originalPrice: '700', price: '500', discount: '-28%', isHot: true, label: 'HOT' },
    { id: 'x15', title: 'Gói Tiêu Chuẩn', amount: 'X15', originalPrice: '1.200', price: '900', discount: '-25%' },
    { id: 'x20', title: 'Gói Nâng Cao', amount: 'X20', originalPrice: '1.500', price: '1.100', discount: '-26%' },
];

export default function VocabPackagesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const categoryName = params.categoryName || 'Du lịch';
    const [balances, setBalances] = useState({ coin: 1255, gem: 5000 });

    const featuredPack = PACKS.find(p => p.isFeatured);
    const normalPacks = PACKS.filter(p => !p.isFeatured);

    const storeColor = colors.primary;

    const [showAnimation, setShowAnimation] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [rewardAmount, setRewardAmount] = useState('');

    const cardScale = useSharedValue(0);
    const cardRotate = useSharedValue(0);
    const stackProgress = useSharedValue(0);
    const resultOpacity = useSharedValue(0);
    const questionOpacity = useSharedValue(1);
    const rotation = useSharedValue(0);

    const handlePurchase = (pack: any) => {
        setRewardAmount(pack.amount);
        setShowAnimation(true);
        setShowResult(false);

        cardScale.value = 0;
        cardRotate.value = 0;
        stackProgress.value = 0;
        resultOpacity.value = 0;
        questionOpacity.value = 1;
        rotation.value = withRepeat(withTiming(360, { duration: 6000, easing: Easing.linear }), -1, false);

        cardScale.value = withSequence(
            withTiming(1.2, { duration: 400 }),
            withTiming(0.9, { duration: 300 })
        );
        questionOpacity.value = withDelay(700, withTiming(0, { duration: 300 }));

        cardRotate.value = withDelay(1000, withRepeat(
            withSequence(withTiming(-3, { duration: 50 }), withTiming(3, { duration: 50 })),
            10, true
        ));
        stackProgress.value = withDelay(1200, withSpring(1, { damping: 12, stiffness: 90 }));

        setTimeout(() => {
            setShowResult(true);
            resultOpacity.value = withTiming(1, { duration: 500 });
        }, 2200);
    };

    const closeAnimation = () => {
        setShowAnimation(false);
    };

    const mainCardStyle = useAnimatedStyle(() => ({
        transform: [{ scale: cardScale.value }, { rotateZ: `${cardRotate.value}deg` }],
        zIndex: 5,
    }));

    const stackCard1Style = useAnimatedStyle(() => ({
        transform: [
            { scale: cardScale.value * 0.9 },
            { translateX: stackProgress.value * -40 },
            { translateY: stackProgress.value * 20 },
            { rotateZ: `${stackProgress.value * -12}deg` }
        ],
        opacity: stackProgress.value * 0.8,
        position: 'absolute',
        zIndex: 3,
    }));

    const stackCard2Style = useAnimatedStyle(() => ({
        transform: [
            { scale: cardScale.value * 0.8 },
            { translateX: stackProgress.value * 40 },
            { translateY: stackProgress.value * 40 },
            { rotateZ: `${stackProgress.value * 15}deg` }
        ],
        opacity: stackProgress.value * 0.5,
        position: 'absolute',
        zIndex: 1,
    }));

    const resultStyle = useAnimatedStyle(() => ({
        opacity: resultOpacity.value,
        transform: [{ translateY: withSpring(resultOpacity.value === 1 ? 0 : 20) }]
    }));

    const animatedRaysStyle = useAnimatedStyle(() => ({
        transform: [{ rotateZ: `${rotation.value}deg` }],
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

            {/* HEADER */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerTitleWrapper}>
                    <Typography variant="h2" color={colors.textPrimary}>Gói từ vựng</Typography>
                </View>

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
                <Typography variant="bodyBase" color={colors.textSecondary} style={{ marginBottom: 24 }}>
                    Chủ đề: <Typography variant="bodyBase" style={{ fontFamily: 'BeVietnamPro-Bold', color: colors.primary }}>{categoryName}</Typography>
                </Typography>

                {/* --- GÓI ĐẶC BIỆT --- */}
                {featuredPack && (
                    <TouchableOpacity
                        style={[styles.premiumCard, { backgroundColor: colors.surfaceGreen, borderColor: storeColor }]}
                        activeOpacity={0.8}
                        onPress={() => handlePurchase(featuredPack)}
                    >
                        <View style={styles.watermarkIcon}>
                            <Icon name="HelpCircle" size={160} color={storeColor} />
                        </View>

                        <View style={[styles.premiumBadge, { backgroundColor: storeColor }]}>
                            <Icon name="Sparkles" size={14} color="#FFF" />
                            <Typography variant="tiny" style={{ color: '#FFF', fontFamily: 'BeVietnamPro-Bold', marginLeft: 4 }}>{featuredPack.label}</Typography>
                        </View>

                        <View style={styles.premiumBody}>
                            <View style={{ flex: 1, zIndex: 2 }}>
                                <Typography variant="h3" color={storeColor} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                                    {featuredPack.title}
                                </Typography>
                                <Typography variant="h1" style={{ color: storeColor, fontFamily: 'Baloo2-ExtraBold', fontSize: 44, lineHeight: 50 }}>
                                    {featuredPack.amount}
                                </Typography>
                                <Typography variant="bodySmall" color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                                    Từ vựng "{categoryName}"
                                </Typography>
                            </View>
                        </View>

                        <View style={[styles.premiumButton, { backgroundColor: storeColor }]}>
                            <View style={{ alignItems: 'center' }}>
                                {featuredPack.discount && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                                        <Typography variant="caption" style={{ textDecorationLine: 'line-through', color: 'rgba(255,255,255,0.7)', marginRight: 6 }}>{featuredPack.originalPrice}</Typography>
                                        <View style={{ backgroundColor: colors.danger, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                                            <Typography variant="tiny" style={{ color: '#FFF', fontFamily: 'BeVietnamPro-Bold', fontSize: 10 }}>{featuredPack.discount}</Typography>
                                        </View>
                                    </View>
                                )}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ marginRight: 6 }}><Icon name="Coins" size={18} color={colors.surfaceYellow} strokeWidth={2.5} /></View>
                                    <Typography variant="buttonCTA" color="#FFF">{featuredPack.price}</Typography>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {/* --- LƯỚI GÓI BÌNH THƯỜNG --- */}
                <View style={styles.gridContainer}>
                    {normalPacks.map((pack) => (
                        <View key={pack.id} style={styles.col}>
                            <TouchableOpacity
                                style={[styles.packCard, { backgroundColor: colors.surface, borderColor: pack.isHot ? storeColor : colors.border }]}
                                activeOpacity={0.7}
                                onPress={() => handlePurchase(pack)}
                            >
                                <View style={[StyleSheet.absoluteFillObject, { borderRadius: 20, overflow: 'hidden' }]}>
                                    <View style={styles.watermarkIconMini}>
                                        <Icon name="HelpCircle" size={100} color={storeColor} />
                                    </View>
                                </View>

                                {pack.isHot && (
                                    <View style={[styles.hotBadge, { backgroundColor: storeColor }]}>
                                        <Typography variant="tiny" style={{ color: '#FFF', fontFamily: 'BeVietnamPro-Bold' }}>{pack.label}</Typography>
                                    </View>
                                )}

                                <View style={[styles.packIconWrapper, { backgroundColor: colors.surfaceGreen }]}>
                                    <Icon name="Package" size={32} color={storeColor} strokeWidth={2} />
                                </View>

                                <Typography variant="h3" color={colors.textPrimary} style={{ marginTop: 8 }}>
                                    {pack.amount.toLocaleString()}
                                </Typography>

                                <View style={[styles.discountWrapper, { marginVertical: 'auto' }]}>
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
                                        <Typography variant="tiny" style={{ color: storeColor, opacity: 0.8, fontFamily: 'BeVietnamPro-Medium', textAlign: 'center' }}>
                                            {pack.subLabel}
                                        </Typography>
                                    ) : null}
                                </View>

                                <View style={[styles.priceButton, { borderColor: storeColor, backgroundColor: colors.surfaceGreen }]}>
                                    <View style={{ marginRight: 4 }}><Icon name="Coins" size={14} color={colors.warning} strokeWidth={2.5} /></View>
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

            {/* --- OVERLAY ANIMATION MỞ GÓI --- */}
            <Modal visible={showAnimation} transparent animationType="fade">
                <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.85)' }]}>
                    <SunburstRays />

                    {/* KHỐI THẺ XẾP CHỒNG */}
                    <View style={styles.gachaContainer}>
                        <Animated.View style={[styles.gachaCard, stackCard2Style, { backgroundColor: storeColor }]} />
                        <Animated.View style={[styles.gachaCard, stackCard1Style, { backgroundColor: storeColor }]} />

                        <Animated.View style={[styles.gachaCard, mainCardStyle, { backgroundColor: storeColor }]}>
                            <Animated.View style={{ opacity: questionOpacity }}>
                                <Icon name="HelpCircle" size={80} color="rgba(255,255,255,0.5)" />
                            </Animated.View>

                            {showResult && (
                                <Animated.View style={[StyleSheet.absoluteFillObject, { justifyContent: 'center', alignItems: 'center' }]}>
                                    <Icon name="PackageOpen" size={60} color="#FFF" strokeWidth={1.5} />
                                </Animated.View>
                            )}
                        </Animated.View>
                    </View>

                    {/* VĂN BẢN & NÚT TƯƠNG TÁC */}
                    <Animated.View style={[styles.resultContent, resultStyle]}>
                        <Typography variant="display" style={{ color: '#FFF', fontFamily: 'Baloo2-ExtraBold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 8 }}>
                            +{rewardAmount.replace('X', '')}
                        </Typography>
                        <Typography variant="h3" style={{ color: storeColor, marginBottom: 32 }}>
                            Từ vựng mới!
                        </Typography>

                        <TouchableOpacity style={[styles.btnAction, { backgroundColor: colors.surfaceGreen }]} onPress={closeAnimation}>
                            <Typography variant="buttonCTA" style={{ color: storeColor }}>Học ngay</Typography>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={closeAnimation} style={{ marginTop: 20 }}>
                            <Typography variant="bodySmall" style={{ color: colors.textSecondary }}>Quay lại</Typography>
                        </TouchableOpacity>
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

    scrollContent: { paddingHorizontal: 20, paddingTop: 8 },

    premiumCard: { borderRadius: 24, borderWidth: 2, padding: 20, paddingTop: 32, marginBottom: 24, position: 'relative', overflow: 'hidden' },
    premiumBadge: { position: 'absolute', top: 0, left: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 6, borderBottomRightRadius: 16, zIndex: 2 },
    premiumBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    premiumButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 16, zIndex: 2 },
    watermarkIcon: { position: 'absolute', right: -30, top: 0, opacity: 0.1, zIndex: 0 },

    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
    col: { width: '47%' },
    packCard: { borderRadius: 20, borderWidth: 1.5, padding: 12, alignItems: 'center', position: 'relative', height: 210 },
    packIconWrapper: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 4, zIndex: 2 },
    hotBadge: { position: 'absolute', top: -12, right: -10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, zIndex: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
    watermarkIconMini: { position: 'absolute', right: -20, top: 10, opacity: 0.05, zIndex: 0 },

    discountWrapper: { minHeight: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
    discountBadge: { paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
    priceButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingVertical: 8, borderRadius: 12, borderWidth: 1.5, marginTop: 'auto', zIndex: 2 },

    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    raysContainer: { position: 'absolute', width: 1000, height: 1000, justifyContent: 'center', alignItems: 'center', opacity: 0.25 },
    rayItem: { position: 'absolute', width: 1000, height: 60, backgroundColor: '#FFFFFF' },

    gachaContainer: { justifyContent: 'center', alignItems: 'center', zIndex: 10, height: 300 },
    gachaCard: { width: 140, height: 200, borderRadius: 20, borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 15, elevation: 10 },
    resultContent: { position: 'absolute', bottom: '15%', alignItems: 'center', width: '100%', zIndex: 20 },
    btnAction: { paddingHorizontal: 40, paddingVertical: 14, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
});