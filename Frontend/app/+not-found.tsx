import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Typography } from '@/components/ui/Typography';

export default function NotFoundScreen() {
    return (
        <View style={styles.container}>
            <Typography variant="h2">Ôi hỏng! Không tìm thấy trang.</Typography>
            <Link href="/" style={styles.link}>
                <Typography color="#0EA5E9">Quay lại trang chủ</Typography>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    link: { marginTop: 15, paddingVertical: 15 },
});