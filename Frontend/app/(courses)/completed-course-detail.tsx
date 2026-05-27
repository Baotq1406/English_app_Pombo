import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ALL_COURSES } from '@/constants/courses';

export default function CompletedCourseDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const courseData = ALL_COURSES.find(c => c.id === id) || ALL_COURSES.find(c => c.status === 'completed');

    if (!courseData) return null;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle} numberOfLines={1}>
                    Chi tiết khóa học
                </Typography>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: courseData.banner }} style={styles.banner} resizeMode="cover" />

                <View style={styles.courseInfoContainer}>
                    <View style={styles.courseTitleRow}>
                        <Typography
                            variant="h2"
                            color={colors.textPrimary}
                            style={styles.courseTitle}
                            numberOfLines={1}
                        >
                            {courseData.title}
                        </Typography>

                        <Icon name="CheckCircle" size={24} color={colors.primary} />
                    </View>

                    <Typography variant="bodyBase" color={colors.textSecondary}>
                        GV: <Typography variant="bodyBase" style={{ fontFamily: 'BeVietnamPro-Bold', color: colors.textPrimary }}>{courseData.instructor}</Typography>
                    </Typography>
                </View>

                <View style={[styles.progressCard, { backgroundColor: colors.surfaceGreen, borderColor: colors.primary }]}>
                    <View style={styles.progressHeader}>
                        <Typography variant="h3" color={colors.primary}>Khóa học đã hoàn thành!</Typography>
                        <Typography variant="bodySmall" color={colors.primary} style={{ opacity: 0.8, marginTop: 2, marginBottom: 12 }}>
                            Hoàn thành vào {courseData.completionDate}
                        </Typography>
                        {courseData.rewardText && (
                            <View style={[styles.rewardBadge, { backgroundColor: colors.surfaceYellow }]}>
                                <Icon name={courseData.rewardType === 'gem' ? 'Gem' : 'Coins'} size={16} color={colors.warning} />
                                <Typography variant="caption" color={colors.warning} style={{ fontFamily: 'BeVietnamPro-Bold', marginLeft: 4 }}>
                                    {courseData.rewardText}
                                </Typography>
                            </View>
                        )}
                    </View>
                </View>

                {courseData.chapters.map((chapter) => (
                    <View key={chapter.id} style={styles.chapterContainer}>
                        <View style={styles.chapterHeader}>
                            <Typography variant="h3" color={colors.textPrimary} style={styles.chapterTitle}>
                                {chapter.title}
                            </Typography>
                            <Typography variant="bodySmall" color={colors.primary}>
                                {chapter.progressText}
                            </Typography>
                        </View>

                        {chapter.lessons.map((lesson) => (
                            <TouchableOpacity
                                key={lesson.id}
                                activeOpacity={0.7}
                                style={[styles.lessonCard, { borderLeftColor: colors.primary, backgroundColor: colors.surface }]}
                                onPress={() => {
                                    if (lesson.type === 'vocabulary') router.push('/vocabulary-list' as any);
                                    else if (lesson.type === 'test') router.push('/test-result' as any);
                                }}
                            >
                                <View style={[styles.lessonIconContainer, { backgroundColor: colors.surfaceGreen }]}>
                                    <Icon name="Check" size={20} color={colors.primary} />
                                </View>

                                <View style={styles.lessonInfo}>
                                    <Typography variant="bodyBase" color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold', marginBottom: 2 }}>
                                        {lesson.title}
                                    </Typography>
                                    <Typography variant="caption" color={colors.textSecondary}>
                                        {lesson.meta}
                                    </Typography>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </ScrollView>

            <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20), backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity style={[styles.btnAction, { backgroundColor: colors.primary }]} activeOpacity={0.8} onPress={() => router.push('/certificate' as any)}>
                    <Icon name="Award" size={24} color="#FFF" />
                    <Typography variant="buttonCTA" style={{ color: '#FFF', marginLeft: 8 }}>Xem chứng chỉ</Typography>
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

    scrollContent: { paddingHorizontal: 20 },

    banner: { width: '100%', height: 200, borderRadius: 24, marginBottom: 20 },
    courseInfoContainer: { marginBottom: 24, paddingHorizontal: 8 },
    courseTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, alignSelf: 'flex-start' },
    courseTitle: { fontFamily: 'Baloo2-Bold', fontSize: 26, lineHeight: 32, marginBottom: 0, marginRight: 8, flexShrink: 1 },

    progressCard: { padding: 20, borderRadius: 24, borderWidth: 1.5, marginBottom: 30 },
    progressHeader: { flexDirection: 'column', alignItems: 'flex-start' },
    rewardBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start' },

    chapterContainer: { marginBottom: 24 },
    chapterHeader: { flexDirection: 'column', alignItems: 'flex-start', marginBottom: 16, paddingHorizontal: 8 },
    chapterTitle: { marginBottom: 4 },

    lessonCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, marginBottom: 12, borderLeftWidth: 4, borderRadius: 16, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
    lessonIconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    lessonInfo: { flex: 1, paddingRight: 8 },

    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingTop: 16, paddingHorizontal: 20, borderTopWidth: 1 },
    btnAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
});