import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 40;

const POMBO_BANNERS = [
    { id: '1', image: require('@/assets/images/banner-intro.png') },
    { id: '2', image: require('@/assets/images/banner-games.png') },
    { id: '3', image: require('@/assets/images/banner-toeic.png') },
];

export const PromoBanner = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= POMBO_BANNERS.length) {
                nextIndex = 0;
            }
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
            setCurrentIndex(nextIndex);
        }, 3000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={POMBO_BANNERS}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ width: BANNER_WIDTH, height: 180 }}>
                        <Image source={item.image} style={styles.image} resizeMode="contain" />
                    </View>
                )}
            />

            <View style={styles.dotsContainer}>
                {POMBO_BANNERS.map((_, index) => (
                    <View
                        key={index.toString()}
                        style={[
                            styles.dot,
                            {
                                backgroundColor:
                                    currentIndex === index
                                        ? colors.primary
                                        : colors.disabled,
                                width: currentIndex === index ? 24 : 8,
                                opacity: currentIndex === index ? 1 : 0.7,
                            }
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: BANNER_WIDTH,
        height: 180,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: BANNER_WIDTH,
        height: '100%',
    },
    dotsContainer: {
        position: 'absolute',
        bottom: 12,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    }
});