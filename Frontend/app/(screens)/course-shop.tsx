import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InputField } from '@/components/ui/InputField';

const { width } = Dimensions.get('window');

export default function CourseShopScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [searchQuery, setSearchQuery] = useState('');

    const SHOP_COURSES = [
        {
            id: 'shop-1',
            title: 'English for Travel',
            description: 'Sẵn sàng cho một chuyến phiêu lưu quốc tế với những mẫu câu thông dụng nhất.',
            price: '500',
            originalPrice: '800',
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071',
        },
        {
            id: 'shop-2',
            title: 'Business English',
            description: 'Nâng tầm tiếng Anh công sở, tự tin giao tiếp và thuyết trình với đối tác nước ngoài.',
            price: '750',
            originalPrice: '1.200',
            image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069',
        }
    ];

    const filteredCourses = SHOP_COURSES.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Cửa hàng khóa học
                </Typography>
                <View style={{ width: 28 }} />
            </View>

            {/* Thanh Search đồng bộ */}
            <View style={styles.searchContainer}>
                <InputField
                    placeholder="Tìm kiếm khóa học mới..."
                    leftIcon={"Search" as any}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {filteredCourses.map((course) => (
                    <TouchableOpacity
                        key={course.id}
                        style={[styles.shopCard, { borderColor: colors.secondary, backgroundColor: colors.surface }]}
                        activeOpacity={0.9}
                        onPress={() => router.push({ pathname: '/course-shop-detail', params: { id: course.id } } as any)}
                    >
                        <Image source={{ uri: course.image }} style={styles.cardImage} resizeMode="cover" />

                        <View style={styles.cardInfo}>
                            <Typography variant="h2" color={colors.textPrimary} style={{ fontFamily: 'Baloo2-Bold', textAlign: 'center', marginBottom: 8 }}>
                                {course.title}
                            </Typography>
                            <Typography variant="bodySmall" color={colors.textSecondary} style={{ textAlign: 'center', marginBottom: 20, paddingHorizontal: 10, lineHeight: 20 }}>
                                {course.description}
                            </Typography>

                            <TouchableOpacity
                                style={[styles.buyBtn, { backgroundColor: colors.secondary }]}
                                activeOpacity={0.8}
                                onPress={() => router.push({ pathname: '/course-shop-detail', params: { id: course.id } } as any)}
                            >
                                <Typography variant="buttonCTA" style={{ color: '#FFF', marginRight: 8 }}>Mua ngay</Typography>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Typography variant="buttonCTA" style={{ color: 'rgba(255,255,255,0.8)' }}>• {course.price}</Typography>
                                    <View style={{ marginLeft: 4 }}><Icon name="Gem" size={14} color="#FFF" /></View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10 },
    backButton: { padding: 4 },
    headerTitle: { fontWeight: '700' },

    searchContainer: { paddingHorizontal: 20, marginBottom: 20 },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 24 },

    shopCard: { width: '100%', borderRadius: 24, borderWidth: 2, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
    cardImage: { width: '100%', height: 180 },
    cardInfo: { padding: 20, alignItems: 'center' },
    buyBtn: { flexDirection: 'row', width: '100%', paddingVertical: 14, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
});