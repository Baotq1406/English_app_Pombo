import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InputField } from '@/components/ui/InputField';
import { ALL_COURSES } from '@/constants/courses';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

export default function MyCoursesScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');

    const ongoingCourses = ALL_COURSES.filter(c => c.status === 'ongoing');
    const completedCourses = ALL_COURSES.filter(c => c.status === 'completed');

    const filteredOngoing = ongoingCourses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredCompleted = completedCourses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const CourseSection = ({ title, data, onSeeAll, isCompleted = false }: any) => {
        const themeColor = isCompleted ? colors.primary : colors.secondary;

        return (
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Typography variant="h3" color={colors.textPrimary}>{title}</Typography>
                    <TouchableOpacity onPress={onSeeAll}>
                        <Typography variant="bodySmall" color={themeColor} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                            Xem tất cả
                        </Typography>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                    {data.map((item: any) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.horizontalCard, { backgroundColor: colors.surface, borderColor: themeColor }]}
                            activeOpacity={0.8}
                            onPress={() => router.push({
                                pathname: isCompleted ? '/completed-course-detail' : '/course-detail',
                                params: { id: item.id }
                            })}
                        >
                            <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
                            <Typography variant="bodyBase" color={colors.textPrimary} style={styles.cardTitle} numberOfLines={1}>
                                {item.title}
                            </Typography>
                            {isCompleted ? (
                                <Typography variant="tiny" color={colors.textSecondary}>
                                    Hoàn thành vào {item.completionDate}
                                </Typography>
                            ) : (
                                <View style={styles.progressRow}>
                                    <View style={[styles.progressBg, { backgroundColor: colors.surfaceAlt }]}>
                                        <View style={[styles.progressFill, { width: `${item.progress * 100}%`, backgroundColor: themeColor }]} />
                                    </View>
                                    <Typography variant="tiny" color={colors.textSecondary}>{Math.round(item.progress * 100)}%</Typography>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>Khóa học của tôi</Typography>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.searchContainer}>
                <InputField
                    placeholder="Tìm kiếm khóa học của tôi"
                    leftIcon={"Search"}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                    style={[styles.miniBanner, { backgroundColor: colors.surfaceBlue, borderColor: colors.secondary }]}
                    activeOpacity={0.8}
                    onPress={() => router.push('/course-shop')}
                >
                    <View style={styles.bannerInfo}>
                        <Typography variant="bodyBase" style={{ fontFamily: 'BeVietnamPro-Bold', color: colors.secondary }}>
                            Khám phá thêm khóa học mới
                        </Typography>
                        <Typography variant="tiny" color={colors.textSecondary}>Học thêm kiến thức, nhận thêm quà tặng</Typography>
                    </View>
                    <Icon name="ArrowRightCircle" size={24} color={colors.secondary} />
                </TouchableOpacity>

                <CourseSection title="Khóa học đang học" data={filteredOngoing} onSeeAll={() => router.push('/ongoing-courses')} />
                <CourseSection title="Khóa học đã hoàn thành" data={filteredCompleted} onSeeAll={() => router.push('/completed-courses')} isCompleted />
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10 },
    backButton: { padding: 4 },
    headerTitle: { fontWeight: '700' },
    searchContainer: { paddingHorizontal: 20, marginBottom: 16 },

    miniBanner: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 24 },
    bannerInfo: { flex: 1 },
    
    sectionContainer: { marginBottom: 30 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
    horizontalList: { paddingHorizontal: 20, gap: 16 },
    horizontalCard: { width: CARD_WIDTH, padding: 16, borderRadius: 24, borderWidth: 1.5 },
    cardImage: { width: '100%', height: 120, borderRadius: 12, marginBottom: 12 },
    cardTitle: { fontFamily: 'BeVietnamPro-Bold', marginBottom: 8 },
    
    progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    progressBg: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%' },
});