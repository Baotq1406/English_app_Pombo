import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VocabularyListScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const THEME_COLOR = colors.primary;

    const vocabList = [
        { id: '1', word: 'Luggage', ipa: '/ˈlʌɡ.ɪdʒ/', meaning: 'Hành lý', type: 'n' },
        { id: '2', title: 'Boarding pass', ipa: '/ˈbɔːr.dɪŋ ˌpæs/', meaning: 'Thẻ lên máy bay', type: 'n' },
        { id: '3', word: 'Departure', ipa: '/dɪˈpɑːr.tʃɚ/', meaning: 'Sự khởi hành', type: 'n' },
        { id: '4', word: 'Take off', ipa: '/teɪk ɔf/', meaning: 'Cất cánh', type: 'v' },
        { id: '5', word: 'Land', ipa: '/lænd/', meaning: 'Hạ cánh', type: 'v' },
        { id: '6', word: 'Aisle seat', ipa: '/ˈaɪəl ˌsiːt/', meaning: 'Ghế cạnh lối đi', type: 'n' },
        { id: '7', word: 'Customs', ipa: '/ˈkʌs·təmz/', meaning: 'Hải quan', type: 'n' },
    ];

    const handlePlayAudio = (word: string) => {
        console.log(`Playing audio for: ${word}`);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle} numberOfLines={1}>
                    Từ vựng đã học
                </Typography>
                <View style={{ width: 28 }} />
            </View>

            {/* Thông tin tổng quan */}
            <View style={styles.summaryContainer}>
                <Typography variant="bodyLarge" color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                    Chủ đề: Airport & Arrival
                </Typography>
                <Typography variant="bodySmall" color={colors.textSecondary} style={{ marginTop: 4 }}>
                    Tổng cộng: {vocabList.length} từ vựng
                </Typography>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {vocabList.map((item) => (
                    <View key={item.id} style={[styles.vocabCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.vocabInfo}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                <Typography variant="h3" color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold', marginRight: 8 }}>
                                    {item.word || item.title}
                                </Typography>
                                <Typography variant="tiny" color={THEME_COLOR} style={{ fontFamily: 'BeVietnamPro-Medium', fontStyle: 'italic' }}>
                                    ({item.type})
                                </Typography>
                            </View>

                            <Typography variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: 6 }}>
                                {item.ipa}
                            </Typography>

                            <Typography variant="bodyBase" color={colors.textPrimary}>
                                {item.meaning}
                            </Typography>
                        </View>

                        <TouchableOpacity
                            style={[styles.audioButton, { backgroundColor: colors.surfaceAlt }]}
                            onPress={() => handlePlayAudio(item.word || item.title || '')}
                            activeOpacity={0.7}
                        >
                            <Icon name="Volume2" size={20} color={THEME_COLOR} />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
    backButton: { padding: 4 },
    headerTitle: { fontWeight: '700', flex: 1, textAlign: 'center' },

    summaryContainer: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 16 },

    scrollContent: { paddingHorizontal: 20, gap: 12, paddingBottom: 40 },

    vocabCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1.5, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
    vocabInfo: { flex: 1, paddingRight: 12 },

    audioButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
});