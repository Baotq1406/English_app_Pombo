import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InputField } from '@/components/ui/InputField';
import { ALL_COURSES } from '@/constants/courses';

export default function CompletedCoursesScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [searchQuery, setSearchQuery] = useState('');

    const completedCourses = ALL_COURSES.filter(c => c.status === 'completed');

    const filteredCourses = completedCourses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Khóa học đã hoàn thành
                </Typography>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.searchContainer}>
                <InputField
                    placeholder="Tìm kiếm khóa học"
                    leftIcon={"Search" as any}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {filteredCourses.map((course) => {
                    const isGem = course.rewardType === 'gem';
                    const rewardBgColor = isGem ? colors.surfacePink : colors.surfaceYellow;
                    const rewardTextColor = isGem ? colors.rankMaster : colors.warning;
                    const rewardIcon = isGem ? 'Gem' : 'Coins';

                    return (
                        <TouchableOpacity
                            key={course.id}
                            activeOpacity={0.8}
                            style={[styles.courseCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            onPress={() => router.push({
                                pathname: '/(courses)/completed-course-detail',
                                params: { id: course.id }
                            })}
                        >
                            <Image source={{ uri: course.image }} style={styles.courseImage} resizeMode="cover" />

                            <View style={styles.infoContainer}>
                                <Typography variant="bodyLarge" color={colors.textPrimary} style={styles.courseTitle} numberOfLines={2}>
                                    {course.title}
                                </Typography>

                                <Typography variant="caption" color={colors.textSecondary} style={{ marginBottom: 4 }}>
                                    GV: <Typography variant="caption" style={{ fontFamily: 'BeVietnamPro-Medium', color: colors.textPrimary }}>{course.instructor}</Typography>
                                </Typography>

                                <Typography variant="caption" color={colors.textSecondary} style={{ marginBottom: 12 }}>
                                    Hoàn thành vào {course.completionDate}
                                </Typography>

                                <View style={styles.actionRow}>
                                    <View style={styles.badgeGroup}>
                                        <View style={[styles.badge, { backgroundColor: colors.surfaceGreen }]}>
                                            <Icon name="CheckCircle" size={12} color={colors.primary} />
                                            <Typography variant="tiny" color={colors.primary} style={{ marginLeft: 4, fontFamily: 'BeVietnamPro-Bold' }}>Đã xong</Typography>
                                        </View>
                                        {course.rewardAmount && (
                                            <View style={[styles.badge, { backgroundColor: rewardBgColor }]}>
                                                <Icon name={rewardIcon as any} size={12} color={rewardTextColor} />
                                                <Typography variant="tiny" color={rewardTextColor} style={{ marginLeft: 4, fontFamily: 'BeVietnamPro-Bold' }}>+{course.rewardAmount}</Typography>
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.reviewBtn}>
                                        <Typography variant="caption" color={colors.secondary} style={{ fontFamily: 'BeVietnamPro-Bold', marginRight: 4 }}>Xem lại</Typography>
                                        <Icon name="ChevronRight" size={14} color={colors.secondary} />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
                {filteredCourses.length === 0 && (
                    <Typography variant="bodyBase" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 40 }}>
                        Không tìm thấy khóa học nào.
                    </Typography>
                )}
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

    scrollContent: { paddingHorizontal: 20, paddingTop: 8, gap: 16 },

    courseCard: { flexDirection: 'row', padding: 16, borderRadius: 24, borderWidth: 1.5, alignItems: 'center' },
    courseImage: { width: 80, height: 80, borderRadius: 16 },
    infoContainer: { flex: 1, marginLeft: 16, justifyContent: 'center' },
    courseTitle: { fontFamily: 'BeVietnamPro-Bold', marginBottom: 2, lineHeight: 20 },
    
    actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    badgeGroup: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6 },
    reviewBtn: { flexDirection: 'row', alignItems: 'center' }
});