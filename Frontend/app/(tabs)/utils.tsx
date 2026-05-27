import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export default function HomeScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Typography variant="h2">Tiện ích</Typography>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});