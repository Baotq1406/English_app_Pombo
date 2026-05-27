import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const SHOP_COURSES_DATA = [
    {
        id: 'shop-1',
        title: 'English for Travel',
        description: 'Sẵn sàng cho một chuyến phiêu lưu quốc tế với những mẫu câu thông dụng nhất. Xây dựng nền tảng ngôn ngữ vững chắc với hệ thống học từ vựng thông minh.',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071',
        tag: 'Phổ biến nhất',
        instructor: {
            name: 'Kurnia Majid',
            role: 'Chuyên gia ngôn ngữ',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974',
        },
        stats: { students: '15.8k+', rating: '4.9/5', words: '3,000' },
        benefits: [
            'Chinh phục 3000 từ vựng thông dụng nhất trong du lịch.',
            'Ghi nhớ từ vựng lâu hơn gấp 5 lần với phương pháp lặp lại ngắt quãng (Spaced Repetition).',
            'Nắm vững cách sử dụng từ trong ngữ cảnh cụ thể qua ví dụ và bài tập thực tế.'
        ],
        curriculum: [
            { id: 1, title: 'Từ vựng Sân bay & Nhập cảnh', meta: '600 từ • 20 bài học', locked: true },
            { id: 2, title: 'Giao tiếp Khách sạn & Lưu trú', meta: '1200 từ • 35 bài học', locked: true },
            { id: 3, title: 'Di chuyển & Mua sắm', meta: '800 từ • 25 bài học', locked: true },
        ],
        review: {
            name: 'Lan Anh',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070',
            comment: '"Flashcards của Rồng Nhỏ cực kỳ sinh động! Nhờ phương pháp Spaced Repetition mà mình nhớ từ rất lâu, không còn bị quên sau vài ngày nữa."'
        },
        price: '500',
        originalPrice: '800'
    },
    {
        id: 'shop-2',
        title: 'Business English',
        description: 'Nâng tầm tiếng Anh công sở, tự tin giao tiếp, viết email, đàm phán và thuyết trình với đối tác nước ngoài một cách chuyên nghiệp.',
        image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069',
        tag: 'Mới ra mắt',
        instructor: {
            name: 'Sarah Connor',
            role: 'Giảng viên Business',
            avatar: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070',
        },
        stats: { students: '8.2k+', rating: '4.8/5', words: '2,500' },
        benefits: [
            'Nắm vững 2500 từ vựng chuyên ngành kinh tế, văn phòng.',
            'Tự tin viết email, báo cáo và thuyết trình bằng tiếng Anh.',
            'Phát âm chuẩn giọng Anh-Mỹ giúp giao tiếp lưu loát và chuyên nghiệp.'
        ],
        curriculum: [
            { id: 1, title: 'Giao tiếp công sở cơ bản', meta: '500 từ • 15 bài học', locked: true },
            { id: 2, title: 'Viết Email & Báo cáo', meta: '1000 từ • 25 bài học', locked: true },
            { id: 3, title: 'Đàm phán & Thuyết trình', meta: '1000 từ • 30 bài học', locked: true },
        ],
        review: {
            name: 'Minh Tuấn',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2000',
            comment: '"Khóa học cực kỳ thực tế. Tôi đã áp dụng ngay các mẫu câu email vào công việc hàng ngày và được sếp khen ngợi."'
        },
        price: '750',
        originalPrice: '1.200'
    }
];

export default function CourseShopDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const courseData = SHOP_COURSES_DATA.find(c => c.id === id) || SHOP_COURSES_DATA[0];

    const THEME_COLOR = colors.primary;
    const ACTION_COLOR = colors.secondary;

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const modalScale = useSharedValue(0);
    const modalOpacity = useSharedValue(0);

    const handlePurchase = () => {
        setShowSuccessModal(true);
        modalOpacity.value = withTiming(1, { duration: 300 });
        modalScale.value = withSpring(1, { damping: 12, stiffness: 90 });
    };

    const handleGoToCourse = () => {
        setShowSuccessModal(false);
        modalOpacity.value = 0;
        modalScale.value = 0;
        // Navigate to the "new-words" screen after successful purchase
        router.push({ pathname: '/(screens)/new-words' } as any);
    };

    const animatedModalStyle = useAnimatedStyle(() => ({
        opacity: modalOpacity.value,
        transform: [{ scale: modalScale.value }],
    }));

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Chi tiết khóa học
                </Typography>
                <TouchableOpacity style={styles.backButton}>
                    <Icon name="Share2" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: courseData.image }} style={styles.banner} resizeMode="cover" />

                <View style={[styles.tagBadge, { backgroundColor: colors.surfaceGreen }]}>
                    <View style={{ marginRight: 6 }}>
                        <Icon name="Award" size={14} color={colors.primary} />
                    </View>
                    <Typography variant="tiny" color={colors.primary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                        {courseData.tag}
                    </Typography>
                </View>

                <Typography variant="display" color={colors.textPrimary} style={{ fontFamily: 'Baloo2-Bold', fontSize: 32, marginBottom: 12 }}>
                    {courseData.title}
                </Typography>

                <View style={[styles.instructorCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Image source={{ uri: courseData.instructor.avatar }} style={styles.instructorAvatar} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Typography variant="bodyLarge" color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                            {courseData.instructor.name}
                        </Typography>
                        <Typography variant="caption" color={colors.textSecondary}>
                            {courseData.instructor.role}
                        </Typography>
                    </View>
                </View>

                <Typography variant="bodyBase" color={colors.textSecondary} style={{ lineHeight: 22, marginBottom: 24 }}>
                    {courseData.description}
                </Typography>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <View style={{ marginBottom: 4 }}><Icon name="Users" size={24} color={colors.primary} /></View>
                        <Typography variant="caption" color={colors.textSecondary}>Học viên</Typography>
                        <Typography variant="bodyLarge" color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>{courseData.stats.students}</Typography>
                    </View>
                    <View style={styles.statItem}>
                        <View style={{ marginBottom: 4 }}><Icon name="Star" size={24} color={colors.warning} fill={colors.warning} /></View>
                        <Typography variant="caption" color={colors.textSecondary}>Đánh giá</Typography>
                        <Typography variant="bodyLarge" color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>{courseData.stats.rating}</Typography>
                    </View>
                    <View style={styles.statItem}>
                        <View style={{ marginBottom: 4 }}><Icon name="BookOpen" size={24} color={colors.primary} /></View>
                        <Typography variant="caption" color={colors.textSecondary}>Từ vựng</Typography>
                        <Typography variant="bodyLarge" color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>{courseData.stats.words}</Typography>
                    </View>
                </View>

                <Typography variant="h2" color={colors.textPrimary} style={{ marginTop: 32, marginBottom: 16 }}>Bạn sẽ học được gì</Typography>
                <View style={styles.benefitsContainer}>
                    {courseData.benefits.map((benefit, index) => (
                        <View key={index} style={styles.benefitItem}>
                            <View style={{ marginTop: 2, marginRight: 12 }}>
                                <Icon name="CheckCircle" size={20} color={colors.primary} />
                            </View>
                            <Typography variant="bodyBase" color={colors.textPrimary} style={{ flex: 1, lineHeight: 22 }}>
                                {benefit}
                            </Typography>
                        </View>
                    ))}
                </View>

                <View style={styles.sectionHeader}>
                    <Typography variant="h2" color={colors.textPrimary}>Nội dung khóa học</Typography>
                    <Typography variant="bodySmall" color={colors.primary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>Xem lộ trình</Typography>
                </View>

                <View style={styles.curriculumContainer}>
                    {courseData.curriculum.map((item) => (
                        <View key={item.id} style={[styles.curriculumItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={[styles.levelBadge, { backgroundColor: colors.surfaceGreen }]}>
                                <Typography variant="h3" color={colors.primary}>{item.id}</Typography>
                            </View>
                            <View style={styles.curriculumInfo}>
                                <Typography variant="bodyLarge" color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold', marginBottom: 2 }}>{item.title}</Typography>
                                <Typography variant="caption" color={colors.textSecondary}>{item.meta}</Typography>
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Icon name="Lock" size={20} color={colors.textSecondary} />
                            </View>
                        </View>
                    ))}
                </View>

                <Typography variant="h2" color={colors.textPrimary} style={{ marginTop: 32, marginBottom: 16 }}>Đánh giá từ học viên</Typography>
                <View style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.reviewHeader}>
                        <Image source={{ uri: courseData.review.avatar }} style={styles.reviewAvatar} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Typography variant="bodyLarge" color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>{courseData.review.name}</Typography>
                            <View style={{ flexDirection: 'row', marginTop: 2 }}>
                                {[...Array(5)].map((_, i) => (
                                    <View key={i} style={{ marginRight: 2 }}><Icon name="Star" size={12} color={colors.warning} fill={colors.warning} /></View>
                                ))}
                            </View>
                        </View>
                    </View>
                    <Typography variant="bodyBase" color={colors.textSecondary} style={{ fontStyle: 'italic', lineHeight: 22 }}>
                        {courseData.review.comment}
                    </Typography>
                </View>
            </ScrollView>

            <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20), backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <View style={styles.priceContainer}>
                    <Typography variant="caption" color={colors.textSecondary} style={{ textDecorationLine: 'line-through', marginBottom: -4 }}>
                        {courseData.originalPrice} Gem
                    </Typography>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Typography variant="h1" color={colors.textPrimary} style={{ fontFamily: 'Baloo2-Bold', fontSize: 28 }}>
                            {courseData.price}
                        </Typography>
                        <View style={{ marginLeft: 6 }}>
                            <Icon name="Gem" size={22} color={colors.rankMaster || colors.warning} />
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.buyActionBtn, { backgroundColor: ACTION_COLOR }]} activeOpacity={0.8} onPress={handlePurchase}>
                    <View style={{ marginRight: 8 }}><Icon name="ShoppingCart" size={20} color="#FFF" /></View>
                    <Typography variant="buttonCTA" style={{ color: '#FFF' }}>Mua ngay</Typography>
                </TouchableOpacity>
            </View>

            <Modal visible={showSuccessModal} transparent animationType="fade">
                <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                    <Animated.View style={[styles.successCard, animatedModalStyle, { backgroundColor: colors.surface }]}>
                        <View style={[styles.successIconWrapper, { backgroundColor: colors.surfaceGreen }]}>
                            <Icon name="Check" size={40} color={colors.primary} strokeWidth={3} />
                        </View>
                        <Typography variant="h2" color={colors.textPrimary} style={{ fontFamily: 'Baloo2-Bold', fontSize: 28, marginBottom: 8, textAlign: 'center' }}>
                            Thành công!
                        </Typography>
                        <Typography variant="bodyBase" color={colors.textSecondary} style={{ textAlign: 'center', marginBottom: 24, lineHeight: 22 }}>
                            Bạn đã mở khóa thành công{'\n'}
                            <Typography variant="bodyBase" style={{ fontFamily: 'BeVietnamPro-Bold', color: ACTION_COLOR }}>
                                {courseData.title}
                            </Typography>.
                        </Typography>
                        <TouchableOpacity style={[styles.startLearningBtn, { backgroundColor: ACTION_COLOR }]} activeOpacity={0.8} onPress={handleGoToCourse}>
                            <Typography variant="buttonCTA" style={{ color: '#FFF' }}>Vào học ngay</Typography>
                            <View style={{ marginLeft: 8 }}><Icon name="ArrowRight" size={20} color="#FFF" /></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setShowSuccessModal(false); modalOpacity.value = 0; modalScale.value = 0; }} style={{ padding: 12, marginTop: 8 }}>
                            <Typography variant="bodySmall" color={colors.textSecondary} style={{ textDecorationLine: 'underline' }}>Đóng</Typography>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
    backButton: { padding: 4 },
    headerTitle: { fontWeight: '700' },
    scrollContent: { paddingHorizontal: 20 },
    banner: { width: '100%', height: 220, borderRadius: 24, marginBottom: 16 },
    tagBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 16 },
    instructorCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 20 },
    instructorAvatar: { width: 44, height: 44, borderRadius: 22 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    statItem: { alignItems: 'center', flex: 1 },
    benefitsContainer: { gap: 16 },
    benefitItem: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#F1F5F9' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, marginBottom: 16 },
    curriculumContainer: { gap: 12 },
    curriculumItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1.5 },
    levelBadge: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    curriculumInfo: { flex: 1 },
    reviewCard: { padding: 20, borderRadius: 24, borderWidth: 1.5, marginBottom: 20 },
    reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    reviewAvatar: { width: 48, height: 48, borderRadius: 24 },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingTop: 16, paddingHorizontal: 20, borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    priceContainer: { flex: 1 },
    buyActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    successCard: { width: '100%', borderRadius: 32, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
    successIconWrapper: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20, marginTop: -10 },
    startLearningBtn: { flexDirection: 'row', width: '100%', paddingVertical: 16, borderRadius: 24, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
});