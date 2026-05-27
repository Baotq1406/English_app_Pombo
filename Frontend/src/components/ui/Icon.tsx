import React from 'react';
import { useColorScheme } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { Colors } from '@/constants/theme';

export type IconName = keyof typeof LucideIcons;

interface IconProps {
    name: IconName;
    size?: number;
    color?: string;
    fill?: string;
    strokeWidth?: number;
}

export const Icon = ({
    name,
    size = 24,
    color,
    fill = 'none',
    strokeWidth = 2,
}: IconProps) => {
    const IconComponent = LucideIcons[name] as React.ElementType;

    const colorScheme = useColorScheme() ?? 'light';
    
    const defaultColor = color || Colors[colorScheme].textPrimary;

    if (!IconComponent) return null;

    return (
        <IconComponent
            color={defaultColor}
            size={size}
            fill={fill}
            strokeWidth={strokeWidth}
        />
    );
};