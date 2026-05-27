import React from 'react';
import { TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface IPACardProps {
    ipa: string;
    word: string;
    progress?: number;
    onPress: () => void;
}

const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = 24;
const GAP = 12;
const CARD_WIDTH = (width - PADDING_HORIZONTAL * 2 - GAP * 3) / 4;

export const IPACard = ({ ipa, word, progress = 0, onPress }: IPACardProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const validatedProgress = Math.max(0, Math.min(100, progress));

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <Typography variant="bodyBase" style={{ fontFamily: 'BeVietnamPro-Bold', color: colors.textPrimary }}>
                {ipa}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary} style={{ marginBottom: 6 }}>
                {word}
            </Typography>

            {/* Thanh tiến trình dải dài (ProgressBar) */}
            <View style={[styles.progressBarBackground, { backgroundColor: colors.disabled }]}>
                <View
                    style={[
                        styles.progressBarFill,
                        {
                            backgroundColor: colors.primary,
                            width: `${validatedProgress}%`,
                        }
                    ]}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 1.15,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: GAP,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        paddingHorizontal: 6,
    },
    progressBarBackground: {
        width: '100%',
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    }
});