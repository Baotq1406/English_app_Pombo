import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function TestResultScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const testData = {
        title: 'Ôn tập từ vựng Sân bay',
        score: 95,
        totalScore: 100,
        correctAnswers: 19,
        incorrectAnswers: 1,
        totalQuestions: 20,
        timeTaken: '05:20',
        rewardCoins: 50,
        message: 'Xuất sắc! Bạn đã nắm rất vững từ vựng.',
    };

    const StatBox = ({ icon, label, value, iconColor, bgColor }: any) => (
        <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.statIcon, { backgroundColor: bgColor }]}>
                <Icon name={icon} size={20} color={iconColor} />
            </View>
            <Typography variant="h3" color={colors.textPrimary} style={{ marginTop: 12, marginBottom: 4 }}>
                {value}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
                {label}
            </Typography>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle} numberOfLines={1}>
                    Kết quả bài kiểm tra
                </Typography>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Tên bài Test */}
                <Typography variant="h3" color={colors.textPrimary} style={{ textAlign: 'center', marginBottom: 24, fontFamily: 'BeVietnamPro-Bold' }}>
                    {testData.title}
                </Typography>

                {/* Vùng hiển thị Điểm số lớn */}
                <View style={styles.scoreContainer}>
                    <View style={[styles.scoreCircle, { borderColor: colors.primary, backgroundColor: colors.surfaceGreen }]}>
                        <Typography variant="display" color={colors.primary} style={{ fontFamily: 'Baloo2-ExtraBold', fontSize: 56, lineHeight: 64 }}>
                            {testData.score}
                        </Typography>
                        <Typography variant="bodyLarge" color={colors.primary} style={{ fontFamily: 'BeVietnamPro-Bold', opacity: 0.8, marginTop: -8 }}>
                            / {testData.totalScore}
                        </Typography>
                    </View>

                    <Typography variant="h3" color={colors.primary} style={{ marginTop: 24, fontFamily: 'BeVietnamPro-Bold', textAlign: 'center' }}>
                        {testData.message}
                    </Typography>

                    {/* Phần thưởng */}
                    <View style={[styles.rewardBadge, { backgroundColor: colors.surfaceYellow }]}>
                        <Icon name="Coins" size={20} color={colors.warning} />
                        <Typography variant="bodyBase" color={colors.warning} style={{ fontFamily: 'BeVietnamPro-Bold', marginLeft: 8 }}>
                            +{testData.rewardCoins} Coins
                        </Typography>
                    </View>
                </View>

                {/* Grid Thống kê chi tiết */}
                <View style={styles.statsGrid}>
                    <View style={styles.statsRow}>
                        <StatBox
                            icon="CheckCircle"
                            label="Câu đúng"
                            value={testData.correctAnswers}
                            iconColor={colors.primary}
                            bgColor={colors.surfaceGreen}
                        />
                        <StatBox
                            icon="XCircle"
                            label="Câu sai"
                            value={testData.incorrectAnswers}
                            iconColor={colors.danger}
                            bgColor={colors.surfacePink}
                        />
                    </View>
                    <View style={styles.statsRow}>
                        <StatBox
                            icon="Target"
                            label="Tổng số câu"
                            value={testData.totalQuestions}
                            iconColor={colors.secondary}
                            bgColor={colors.surfaceBlue}
                        />
                        <StatBox
                            icon="Clock"
                            label="Thời gian làm"
                            value={testData.timeTaken}
                            iconColor={colors.warning}
                            bgColor={colors.surfaceYellow}
                        />
                    </View>
                </View>

            </ScrollView>

            {/* Bottom Actions */}
            <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20), backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity style={[styles.secondaryButton, { borderColor: colors.primary }]} activeOpacity={0.8}>
                    <Icon name="RefreshCcw" size={20} color={colors.primary} />
                    <Typography variant="buttonCTA" style={{ color: colors.primary, marginLeft: 8 }}>Làm lại</Typography>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} activeOpacity={0.8} onPress={() => router.back()}>
                    <Typography variant="buttonCTA" style={{ color: '#FFF' }}>Tiếp tục học</Typography>
                    <View style={{ marginLeft: 8 }}>
                        <Icon name="ArrowRight" size={20} color="#FFF" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
    backButton: { padding: 4 },
    headerTitle: { fontWeight: '700', flex: 1, textAlign: 'center' },

    scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 },

    scoreContainer: { alignItems: 'center', marginBottom: 40 },
    scoreCircle: { width: width * 0.45, height: width * 0.45, borderRadius: width * 0.25, borderWidth: 8, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
    rewardBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 16 },

    statsGrid: { gap: 16 },
    statsRow: { flexDirection: 'row', gap: 16 },
    statBox: { flex: 1, padding: 16, borderRadius: 20, borderWidth: 1.5, alignItems: 'flex-start' },
    statIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingTop: 16, paddingHorizontal: 20, borderTopWidth: 1, flexDirection: 'row', gap: 12 },
    secondaryButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 24, borderWidth: 2 },
    primaryButton: { flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
});