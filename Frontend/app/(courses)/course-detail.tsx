import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ALL_COURSES } from '@/constants/courses';

export default function CourseDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    // Tìm khóa học theo ID
    const courseData = ALL_COURSES.find(c => c.id === id) || ALL_COURSES[0];

    const getLessonStyle = (status: string) => {
        switch (status) {
            case 'completed':
                return { icon: 'Check', iconBg: colors.surfaceGreen, iconColor: colors.primary, leftBorderColor: colors.primary };
            case 'current':
                return { icon: 'Play', iconBg: colors.surfaceBlue, iconColor: colors.secondary, leftBorderColor: colors.secondary };
            case 'locked':
            default:
                return { icon: 'Lock', iconBg: colors.surfaceAlt, iconColor: colors.textSecondary, leftBorderColor: 'transparent' };
        }
    };

    const handleLessonPress = (lesson: any) => {
        if (lesson.status === 'locked') return;

        if (lesson.status === 'completed') {
            if (lesson.type === 'vocabulary') router.push('/vocabulary-list');
            else router.push('/test-result');
        } else if (lesson.status === 'current') {
        //     if (lesson.type === 'vocabulary') router.push('/learn-new-words');
        //     else router.push('/review');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle} numberOfLines={1}>Chi tiết khóa học</Typography>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: courseData.banner }} style={styles.banner} resizeMode="cover" />
                <View style={styles.courseInfoContainer}>
                    <Typography variant="h2" color={colors.textPrimary} style={styles.courseTitle} numberOfLines={1}>{courseData.title}</Typography>
                    <Typography variant="bodyBase" color={colors.textSecondary}>GV: <Typography variant="bodyBase" style={{ fontFamily: 'BeVietnamPro-Bold', color: colors.textPrimary }}>{courseData.instructor}</Typography></Typography>
                </View>

                <View style={[styles.progressCard, { backgroundColor: colors.surfaceBlue, borderColor: colors.secondary }]}>
                    <View style={styles.progressHeader}>
                        <Typography variant="h3" color={colors.textPrimary}>Tiến độ học tập</Typography>
                        <Typography variant="h3" color={colors.secondary}>{Math.round(courseData.progress * 100)}%</Typography>
                    </View>
                    <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceAlt }]}>
                        <View style={[styles.progressBarFill, { width: `${courseData.progress * 100}%`, backgroundColor: colors.secondary }]} />
                    </View>
                    <View style={styles.progressFooter}>
                        <Typography variant="bodySmall" color={colors.textSecondary}>{courseData.completedLessons}/{courseData.totalLessons} bài học</Typography>
                        <Typography variant="tiny" color={colors.warning} style={{ fontFamily: 'BeVietnamPro-Bold' }}>Thưởng xu khi 100%</Typography>
                    </View>
                </View>

                {courseData.chapters.map((chapter) => (
                    <View key={chapter.id} style={styles.chapterContainer}>
                        <View style={styles.chapterHeader}>
                            <Typography variant="h3" color={colors.textPrimary} style={styles.chapterTitle}>{chapter.title}</Typography>
                            <Typography variant="bodySmall" color={chapter.isCompleted ? colors.primary : colors.textSecondary}>{chapter.progressText}</Typography>
                        </View>
                        {chapter.lessons.map((lesson) => {
                            const stylesConfig = getLessonStyle(lesson.status);
                            return (
                                <TouchableOpacity key={lesson.id} onPress={() => handleLessonPress(lesson)} activeOpacity={lesson.status === 'locked' ? 1 : 0.7} style={[styles.lessonCard, { borderLeftColor: stylesConfig.leftBorderColor, backgroundColor: colors.surface }]}>
                                    <View style={[styles.lessonIconContainer, { backgroundColor: stylesConfig.iconBg }]}><Icon name={stylesConfig.icon as any} size={20} color={stylesConfig.iconColor} /></View>
                                    <View style={styles.lessonInfo}>
                                        <Typography variant="bodyBase" color={lesson.status === 'locked' ? colors.textSecondary : colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold', marginBottom: 2 }}>{lesson.title}</Typography>
                                        <Typography variant="caption" color={colors.textSecondary}>{lesson.meta}</Typography>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </ScrollView>

            <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20), backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity style={[styles.btnAction, { backgroundColor: colors.secondary }]} activeOpacity={0.8} onPress={() => {}}>
                    <Icon name="PlayCircle" size={24} color="#FFF" />
                    <Typography variant="buttonCTA" style={{ color: '#FFF', marginLeft: 8 }}>Tiếp tục học</Typography>
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
    courseInfoContainer: { marginBottom: 24, paddingHorizontal: 8, width: '100%' },
    courseTitle: { fontFamily: 'Baloo2-Bold', fontSize: 26, marginBottom: 4, lineHeight: 32 },

    progressCard: { padding: 20, borderRadius: 24, borderWidth: 1.5, marginBottom: 30 },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    progressBarBg: { height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 12 },
    progressBarFill: { height: '100%', borderRadius: 5 },
    progressFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

    chapterContainer: { marginBottom: 24 },
    chapterHeader: { flexDirection: 'column', alignItems: 'flex-start', marginBottom: 16, paddingHorizontal: 8 },
    chapterTitle: { marginBottom: 4 },

    lessonCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, marginBottom: 12, borderLeftWidth: 4, borderRadius: 16, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
    lessonIconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    lessonInfo: { flex: 1, paddingRight: 8 },
    
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingTop: 16, paddingHorizontal: 20, borderTopWidth: 1 },
    btnAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
});