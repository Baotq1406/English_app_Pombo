import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Typography } from '@/components/ui/Typography';

interface EmptyStateProps {
    message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
    return (
        <View style={styles.container}>
            <Image 
                source={require('@/assets/images/dragon-nobg.png')} // Path đến ảnh con rồng
                style={styles.image} 
                resizeMode="contain" 
            />
            <Typography variant="bodyBase" align="center" style={styles.messageText}>
                {message}
            </Typography>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 24,
    },
    messageText: {
        lineHeight: 24,
    },
});