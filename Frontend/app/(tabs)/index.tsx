import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { StudyCard } from '@/components/ui/StudyCard';
import { PromoBanner } from '@/components/ui/PromoBanner';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StudyScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const userName = "Mr.T";

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={{ paddingTop: Math.max(insets.top, 20), paddingHorizontal: 20, backgroundColor: colors.background, zIndex: 10 }}>
                {/* 1. Khu vực Lời chào */}
                <View style={styles.greetingContainer}>
                    <View>
                        <Typography variant="h2" color={colors.textPrimary}>
                            Chào bạn, {userName}
                        </Typography>
                        <Typography variant="bodyBase" color={colors.textSecondary}>
                            Hôm nay bạn muốn học gì?
                        </Typography>
                    </View>
                    <TouchableOpacity style={[styles.notificationBtn, { backgroundColor: colors.surfaceAlt }]}>
                        <Icon name="Bell" size={20} color={colors.textPrimary} />
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>

                {/* Thanh Tìm kiếm (Search Bar) */}
                <View style={styles.searchContainer}>
                    <View style={[styles.searchInputWrapper, { backgroundColor: colors.surface }]}>
                        <Icon name="Search" size={20} color={colors.textSecondary} />
                        <TextInput
                            style={[styles.searchInput, { color: colors.textPrimary }]}
                            placeholder="Tìm kiếm bài học..."
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>

                    {/* Nút Lọc (Filter) */}
                    <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.primary }]}>
                        <Icon name="SlidersHorizontal" size={22} color={colors.surface} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={{
                    marginBottom: 90 + insets.bottom,
                }}
                contentContainerStyle={[
                    styles.scrollContent,
                    {
                        paddingTop: 10,
                        paddingBottom: 20,
                    }
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* 2. Section: Tin nổi bật */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Typography variant="h3" color={colors.textPrimary}>Tin nổi bật</Typography>
                        <TouchableOpacity>
                            <Typography variant="bodySmall" color={colors.primary}>Xem tất cả</Typography>
                        </TouchableOpacity>
                    </View>

                    <PromoBanner />
                </View>

                {/* 3. Section: Học tập */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Typography variant="h3" color={colors.textPrimary}>Học tập</Typography>
                    </View>

                    <StudyCard
                        title="Ôn tập"
                        description="Cốc cốc cốc! Đến giờ ôn tập để lưu giữ từ vựng tốt hơn rồi"
                        borderColor={colors.primary}
                        // onPress={() => router.push('/review')}
                        onPress={() => router.push('/dashboard')}
                        iconName="RefreshCw"
                    />

                    <StudyCard
                        title="Sổ tay"
                        description="Từ vựng đã học sẽ được cất giữ tại nơi này"
                        borderColor={colors.secondary}
                        onPress={() => router.push('/notebook')}
                        iconName="BookOpen"
                    />

                    <StudyCard
                        title="Bảng chữ cái phiên âm"
                        description="Nếu chưa biết phát âm thế nào cho chuẩn? Vào đây ngay !!!"
                        borderColor={colors.rankMaster}
                        onPress={() => router.push('/alphabet')}
                        iconName="Mic"
                    />

                    <StudyCard
                        title="Khóa học"
                        description="Bạn đang muốn có một lộ trình rõ ràng, nhanh chóng, hãy tham khảo thử tại đây"
                        borderColor={colors.warning}
                        onPress={() => { router.push('/my-courses') }}
                        iconName="GraduationCap"
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
    },
    greetingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1.5,
    },

    searchContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    searchInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontFamily: 'BeVietnamPro-Medium',
        fontSize: 16,
        height: '100%',
    },
    filterButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
});