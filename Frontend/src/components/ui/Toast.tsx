import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from './Typography';
import { Icon } from './Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export const Toast = ({ visible, message, icon = "Check", bottomOffset = 100 }: any) => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    if (!visible) return null;

    return (
        <View style={[styles.toast, { backgroundColor: colors.textPrimary, bottom: bottomOffset }]}>
            <Icon name={icon as any} size={16} color={colors.background} />
            <Typography variant="bodySmall" style={{ color: colors.background, marginLeft: 8 }}>
                {message}
            </Typography>
        </View>
    );
};

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 9999,
    }
});