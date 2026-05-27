import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui/Icon';
import { Typography } from '@/components/ui/Typography';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderAuthProps {
    title?: string;
}

export const HeaderAuth = ({ title }: HeaderAuthProps) => {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
                <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
            </TouchableOpacity>

            {title && (
                <Typography variant="h3" style={styles.title}>
                    {title}
                </Typography>
            )}

            {/* Nút giả để cân bằng layout title ra giữa */}
            <View style={{ width: 40 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: 'transparent',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    title: {
        flex: 1,
        textAlign: 'center',
    },
});