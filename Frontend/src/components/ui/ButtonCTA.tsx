import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle, useColorScheme, View } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Colors } from '@/constants/theme';

interface ButtonCTAProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    icon?: React.ReactNode;
}

export const ButtonCTA = ({ title, onPress, variant = 'primary', loading = false, disabled = false, style, icon }: ButtonCTAProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const getBackgroundColor = () => {
        if (disabled) return colors.disabled;
        if (variant === 'outline') return 'transparent';
        if (variant === 'secondary') return colors.secondary;
        return colors.primary;
    };

    const getTextColor = () => {
        if (disabled) return colors.textSecondary;
        if (variant === 'outline') return colors.textPrimary;
        return colors.textOnAction;
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                variant === 'outline' && {
                    borderWidth: 1.5,
                    borderColor: colorScheme === 'dark' ? colors.surfaceAlt : colors.disabled
                },
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <View style={styles.contentContainer}>
                    {/* Render icon nếu có truyền vào */}
                    {icon && <View style={styles.iconWrapper}>{icon}</View>}
                    <Typography variant="buttonCTA" color={getTextColor()}>
                        {title}
                    </Typography>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
    contentContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    iconWrapper: { marginRight: 10 },
});