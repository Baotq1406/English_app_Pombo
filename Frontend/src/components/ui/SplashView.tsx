import React from 'react';
import { View, Image, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';

const { height } = Dimensions.get('window');

export const SplashView = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>

            {/* 1. Vùng căn giữa màn hình chứa hình rồng */}
            <View style={styles.centerContainer}>
                <Image
                    source={require('@/assets/images/dragon-logo-nobg.png')}
                    style={styles.dragonImage}
                    resizeMode="contain"
                />
            </View>

            {/* 2. Vùng ghim xuống đáy màn hình chứa hình chữ POMBO */}
            <View style={styles.bottomContainer}>
                <Image
                    source={require('@/assets/images/pombo-text-nobg.png')}
                    style={styles.textImage}
                    resizeMode="contain"
                />
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dragonImage: {
        width: 495,
        height: 273,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: height * 0.1,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    textImage: {
        width: 290,
        height: 160,
    },
});