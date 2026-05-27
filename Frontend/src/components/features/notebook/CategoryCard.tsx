import React from 'react';
import { TouchableOpacity, StyleSheet, Image, ImageSourcePropType, View } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface CategoryCardProps {
    title: string;
    image: ImageSourcePropType;
    borderColor: string;
    onPress: () => void;
}

export const CategoryCard = ({ title, image, borderColor, onPress }: CategoryCardProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    
    return (
        <TouchableOpacity 
            style={[
                styles.container, 
                { borderColor: borderColor, backgroundColor: Colors[colorScheme].surface }
            ]} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Image source={image} style={styles.image} resizeMode="contain" />
            <Typography variant="h3" align="center">
                {title}
            </Typography>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 180,
        borderRadius: 24,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        padding: 16,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 12,
    },
});