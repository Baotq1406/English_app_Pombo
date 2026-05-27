import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function CertificateScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const certData = {
        studentName: 'Mr.T',
        courseName: 'Grammar & Vocab Essentials',
        completionDate: '12/05/2023',
        instructor: 'John Doe',
        certificateId: 'CERT-2023-98765'
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle} numberOfLines={1}>
                    Chứng chỉ của bạn
                </Typography>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Khung Chứng Chỉ */}
                <View style={[styles.certificateWrapper, { backgroundColor: colors.surface, borderColor: colors.warning }]}>
                    {/* Viền trang trí bên trong */}
                    <View style={[styles.innerBorder, { borderColor: colors.border }]}>

                        {/* Icon/Logo phía trên */}
                        <View style={styles.iconWrapper}>
                            <View style={[styles.iconBadge, { backgroundColor: colors.surfaceYellow }]}>
                                <Icon name="Award" size={40} color={colors.warning} />
                            </View>
                        </View>

                        <Typography variant="h1" style={{ color: colors.warning, fontFamily: 'Baloo2-Bold', fontSize: 28, textAlign: 'center', marginBottom: 8 }}>
                            CHỨNG NHẬN
                        </Typography>
                        <Typography variant="bodySmall" color={colors.textSecondary} style={{ textAlign: 'center', letterSpacing: 2, marginBottom: 24, textTransform: 'uppercase' }}>
                            HOÀN THÀNH KHÓA HỌC
                        </Typography>

                        <Typography variant="bodyBase" color={colors.textSecondary} style={{ textAlign: 'center', marginBottom: 8 }}>
                            Chứng nhận này được trao tặng cho:
                        </Typography>

                        <Typography variant="display" color={colors.textPrimary} style={{ fontFamily: 'Baloo2-Bold', fontSize: 32, textAlign: 'center', marginBottom: 16 }}>
                            {certData.studentName}
                        </Typography>

                        <Typography variant="bodySmall" color={colors.textSecondary} style={{ textAlign: 'center', marginBottom: 4 }}>
                            Đã hoàn thành xuất sắc khóa học:
                        </Typography>

                        <Typography variant="h3" color={colors.primary} style={{ fontFamily: 'BeVietnamPro-Bold', textAlign: 'center', marginBottom: 32, paddingHorizontal: 20 }}>
                            {certData.courseName}
                        </Typography>

                        {/* Phần Chữ ký & Ngày tháng */}
                        <View style={styles.signatureRow}>
                            <View style={styles.signatureBlock}>
                                <Typography variant="bodyLarge" color={colors.textPrimary} style={{ fontFamily: 'Baloo2-Bold', fontStyle: 'italic', marginBottom: 4 }}>
                                    {certData.completionDate}
                                </Typography>
                                <View style={[styles.line, { backgroundColor: colors.border }]} />
                                <Typography variant="tiny" color={colors.textSecondary}>Ngày cấp</Typography>
                            </View>

                            <View style={styles.signatureBlock}>
                                <Typography variant="bodyLarge" color={colors.textPrimary} style={{ fontFamily: 'Baloo2-Bold', fontStyle: 'italic', marginBottom: 4 }}>
                                    {certData.instructor}
                                </Typography>
                                <View style={[styles.line, { backgroundColor: colors.border }]} />
                                <Typography variant="tiny" color={colors.textSecondary}>Giảng viên hướng dẫn</Typography>
                            </View>
                        </View>

                        {/* ID Chứng chỉ */}
                        <Typography variant="tiny" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 24, opacity: 0.5 }}>
                            ID: {certData.certificateId}
                        </Typography>

                    </View>
                </View>

                {/* Các nút hành động */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} activeOpacity={0.8}>
                        <Icon name="DownloadCloud" size={20} color="#FFF" />
                        <Typography variant="buttonCTA" style={{ color: '#FFF', marginLeft: 8 }}>Tải chứng chỉ</Typography>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.secondaryButton, { borderColor: colors.primary }]} activeOpacity={0.8}>
                        <Icon name="Share2" size={20} color={colors.primary} />
                        <Typography variant="buttonCTA" style={{ color: colors.primary, marginLeft: 8 }}>Chia sẻ ngay</Typography>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
    backButton: { padding: 4 },
    headerTitle: { fontWeight: '700', flex: 1, textAlign: 'center' },

    scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },

    certificateWrapper: { width: '100%', borderRadius: 24, borderWidth: 4, padding: 8, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12, marginBottom: 32 },
    innerBorder: { borderRadius: 16, borderWidth: 1, paddingVertical: 32, paddingHorizontal: 16, borderStyle: 'dashed' },

    iconWrapper: { alignItems: 'center', marginBottom: 16 },
    iconBadge: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },

    signatureRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingHorizontal: 10 },
    signatureBlock: { alignItems: 'center', width: '45%' },
    line: { width: '100%', height: 1, marginBottom: 8 },

    actionContainer: { gap: 16 },
    primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 24, borderWidth: 2 },
});