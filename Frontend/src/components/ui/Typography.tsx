import React from 'react';
import { Text, TextProps, useColorScheme } from 'react-native';
import { Typography as ThemeTypography, Colors } from '@/constants/theme';

type VariantType = keyof typeof ThemeTypography;

interface TypographyProps extends TextProps {
    variant?: VariantType;
    color?: string;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Typography = ({
    variant = 'bodyBase',
    color,
    align = 'left',
    style,
    children,
    ...rest
}: TypographyProps) => {
    const colorScheme = useColorScheme() ?? 'light';

    const variantStyle = ThemeTypography[variant];

    const defaultColor = Colors[colorScheme].textPrimary;

    return (
        <Text
            style={[
                variantStyle,
                { color: color || defaultColor, textAlign: align },
                style,
            ]}
            {...rest}
        >
            {children}
        </Text>
    );
};