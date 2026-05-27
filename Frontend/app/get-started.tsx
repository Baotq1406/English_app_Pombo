import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { ButtonCTA } from '@/components/ui/ButtonCTA';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ONBOARDING_DATA = [
    {
        id: '1',
        title: 'Bắt đầu thôi nào',
        description: 'Học tiếng Anh dễ dàng cùng POMBO,\nchỉ với một chạm nhé!',
        image: require('@/assets/images/logo-app-nobg.png'),
    },
    {
        id: '2',
        title: 'Học qua Mini Games',
        description: 'Vừa học vừa chơi game cực đỉnh,\ntừ vựng lên trình vèo vèo.',
        image: require('@/assets/images/logo-app-nobg.png'),
    },
    {
        id: '3',
        title: 'Chinh phục TOEIC 600',
        description: 'Hệ thống bài học chuẩn xác,\nchúng tôi sẽ đồng hành cùng bạn!',
        image: require('@/assets/images/logo-app-nobg.png'),
    }
];

export default function GetStarted() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const insets = useSafeAreaInsets();

    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const completeOnboarding = useAuthStore(state => state.completeOnboarding);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems[0]) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const handleNext = () => {
        if (currentIndex < ONBOARDING_DATA.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        }
    };

    const handleStart = async () => {
        completeOnboarding();
    };

    const renderItem = ({ item }: { item: typeof ONBOARDING_DATA[0] }) => {
        return (
            <View style={[styles.slide, { width }]}>
                <Image
                    source={item.image}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Typography variant="h1" style={styles.title} color={colors.primary}>
                    {item.title}
                </Typography>
                <Typography variant="bodyBase" style={styles.description} align="center" color={colors.textSecondary}>
                    {item.description}
                </Typography>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>

            {/* Phần nội dung vuốt ngang */}
            <View style={styles.flatListContainer}>
                <FlatList
                    ref={flatListRef}
                    data={ONBOARDING_DATA}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                    bounces={false}
                />
            </View>

            {/* Cụm điều khiển bên dưới (Dots + Buttons) */}
            <View
                style={[
                    styles.bottomContainer,
                    { paddingBottom: Math.max(insets.bottom + 20, 40) }
                ]}
            >

                {/* Dots Indicator */}
                <View style={styles.dotContainer}>
                    {ONBOARDING_DATA.map((_, index) => (
                        <View
                            key={index.toString()}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: currentIndex === index ? colors.primary : colors.disabled,
                                    width: currentIndex === index ? 24 : 8,
                                    opacity: currentIndex === index ? 1 : 0.7,
                                }
                            ]}
                        />
                    ))}
                </View>

                {/* Nút bấm thay đổi theo Slide */}
                <View style={styles.buttonContainer}>
                    {currentIndex === ONBOARDING_DATA.length - 1 ? (
                        <View style={{ width: '100%', gap: 16 }}>
                            {/* Nút chính: Bắt đầu (Nền xanh đặc) */}
                            <ButtonCTA
                                title="Bắt đầu"
                                onPress={handleStart}
                                style={{ width: '100%' }}
                            />

                            {/* Nút phụ: Đã có tài khoản (Viền xanh, nền trong suốt) */}
                            <ButtonCTA
                                title="Tôi đã có tài khoản rồi"
                                onPress={async () => {
                                    completeOnboarding();
                                }}
                                variant="outline"
                                style={{ width: '100%' }}
                            />
                        </View>
                    ) : (
                        <ButtonCTA title="Tiếp tục" onPress={handleNext} style={{ width: '100%' }} />
                    )}
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatListContainer: {
        flex: 3,
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    image: {
        width: 329,
        height: 370,
        marginBottom: 40,
    },
    title: {
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        paddingHorizontal: 20,
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    linkButton: {
        paddingVertical: 8,
    }
});