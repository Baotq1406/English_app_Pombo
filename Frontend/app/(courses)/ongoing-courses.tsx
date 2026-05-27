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

export default function OngoingCoursesScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [searchQuery, setSearchQuery] = useState('');

    const ongoingCourses = ALL_COURSES.filter(c => c.status === 'ongoing');

    const filteredCourses = ongoingCourses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Khóa học đang học
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
                {filteredCourses.map((course) => (
                    <TouchableOpacity
                        key={course.id}
                        activeOpacity={0.8}
                        style={[styles.courseCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={() => router.push({
                            pathname: '/(courses)/course-detail',
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

                            <Typography variant="caption" color={colors.textSecondary} style={{ marginBottom: 8 }}>
                                {course.completedLessons} / {course.totalLessons} Bài học
                            </Typography>

                            <View style={styles.progressRow}>
                                <View style={[styles.progressBg, { backgroundColor: colors.surfaceAlt }]}>
                                    <View style={[styles.progressFill, { width: `${course.progress * 100}%`, backgroundColor: colors.secondary }]} />
                                </View>
                                <Typography variant="tiny" color={colors.secondary} style={{ marginLeft: 8, fontFamily: 'BeVietnamPro-Bold' }}>
                                    {Math.round(course.progress * 100)}%
                                </Typography>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
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
    
    progressRow: { flexDirection: 'row', alignItems: 'center' },
    progressBg: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 3 },
});