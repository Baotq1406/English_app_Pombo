import React from 'react';
import { TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { Icon } from '@/components/ui/Icon';

interface StudyCardProps {
    title: string;
    description: string;
    borderColor: string;
    onPress: () => void;
    iconName?: any;
}

export const StudyCard = ({ title, description, borderColor, onPress, iconName = 'Brain' }: StudyCardProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: colors.surface,
                    borderColor: borderColor,
                }
            ]}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View style={styles.textContainer}>
                <Typography variant="h3" style={{ color: borderColor, marginBottom: 4 }}>
                    {title}
                </Typography>
                <Typography variant="bodySmall" color={colors.textSecondary}>
                    {description}
                </Typography>
            </View>

            <View style={styles.iconContainer}>
                <Icon name={iconName} size={40} color={borderColor} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    textContainer: {
        flex: 1,
        paddingRight: 16,
    },
    iconContainer: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 12,
    }
});