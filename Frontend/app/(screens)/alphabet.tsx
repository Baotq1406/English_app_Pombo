import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { ButtonCTA } from '@/components/ui/ButtonCTA';
import { Icon } from '@/components/ui/Icon';
import { IPACard } from '@/components/ui/IPACard';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';

const VOWELS = [
    { ipa: 'iː', word: 'sheep', progress: 100, audio: require('@/assets/sounds/ipa-i-long.mp3') },
    { ipa: 'ɪ', word: 'ship', progress: 75, audio: require('@/assets/sounds/ipa-i-short.mp3') },
    { ipa: 'ʊ', word: 'good', progress: 50, audio: require('@/assets/sounds/ipa-u-short.mp3') },
    { ipa: 'uː', word: 'shoot', progress: 25, audio: require('@/assets/sounds/ipa-u-long.mp3') },
    { ipa: 'ɪə', word: 'here', progress: 0, audio: require('@/assets/sounds/ipa-ia.mp3') },
    { ipa: 'eɪ', word: 'wait', progress: 100, audio: require('@/assets/sounds/ipa-ei.mp3') },
    { ipa: 'e', word: 'bed', progress: 80, audio: require('@/assets/sounds/ipa-e.mp3') },
    { ipa: 'ə', word: 'teacher', progress: 60, audio: require('@/assets/sounds/ipa-schwa.mp3') },
    { ipa: 'ɜː', word: 'bird', progress: 40, audio: require('@/assets/sounds/ipa-er.mp3') },
    { ipa: 'ɔː', word: 'door', progress: 20, audio: require('@/assets/sounds/ipa-o-long.mp3') },
    { ipa: 'ʊə', word: 'tourist', progress: 95, audio: require('@/assets/sounds/ipa-ua.mp3') },
    { ipa: 'ɔɪ', word: 'boy', progress: 15, audio: require('@/assets/sounds/ipa-oi.mp3') },
    { ipa: 'əʊ', word: 'show', progress: 70, audio: require('@/assets/sounds/ipa-ou.mp3') },
    { ipa: 'æ', word: 'cat', progress: 88, audio: require('@/assets/sounds/ipa-ae.mp3') },
    { ipa: 'ʌ', word: 'up', progress: 10, audio: require('@/assets/sounds/ipa-wedge.mp3') },
    { ipa: 'ɑː', word: 'far', progress: 30, audio: require('@/assets/sounds/ipa-a-long.mp3') },
    { ipa: 'ɒ', word: 'on', progress: 90, audio: require('@/assets/sounds/ipa-o-short.mp3') },
    { ipa: 'eə', word: 'hair', progress: 50, audio: require('@/assets/sounds/ipa-ea.mp3') },
    { ipa: 'aɪ', word: 'my', progress: 77, audio: require('@/assets/sounds/ipa-ai.mp3') },
    { ipa: 'aʊ', word: 'cow', progress: 12, audio: require('@/assets/sounds/ipa-au.mp3') },
];

const CONSONANTS = [
    { ipa: 'p', word: 'pea', progress: 30, audio: require('@/assets/sounds/ipa-p.mp3') },
    { ipa: 'b', word: 'boat', progress: 90, audio: require('@/assets/sounds/ipa-b.mp3') },
    { ipa: 't', word: 'tea', progress: 10, audio: require('@/assets/sounds/ipa-t.mp3') },
    { ipa: 'd', word: 'dog', progress: 100, audio: require('@/assets/sounds/ipa-d.mp3') },
    { ipa: 'tʃ', word: 'cheese', progress: 50, audio: require('@/assets/sounds/ipa-ch.mp3') },
    { ipa: 'dʒ', word: 'june', progress: 0, audio: require('@/assets/sounds/ipa-j.mp3') },
    { ipa: 'k', word: 'car', progress: 77, audio: require('@/assets/sounds/ipa-k.mp3') },
    { ipa: 'g', word: 'go', progress: 12, audio: require('@/assets/sounds/ipa-g.mp3') },
    { ipa: 'f', word: 'fly', progress: 65, audio: require('@/assets/sounds/ipa-f.mp3') },
    { ipa: 'v', word: 'video', progress: 85, audio: require('@/assets/sounds/ipa-v.mp3') },
    { ipa: 'θ', word: 'think', progress: 99, audio: require('@/assets/sounds/ipa-theta.mp3') },
    { ipa: 'ð', word: 'this', progress: 45, audio: require('@/assets/sounds/ipa-eth.mp3') },
    { ipa: 's', word: 'see', progress: 22, audio: require('@/assets/sounds/ipa-s.mp3') },
    { ipa: 'z', word: 'zoo', progress: 33, audio: require('@/assets/sounds/ipa-z.mp3') },
    { ipa: 'ʃ', word: 'shall', progress: 100, audio: require('@/assets/sounds/ipa-esh.mp3') },
    { ipa: 'ʒ', word: 'television', progress: 10, audio: require('@/assets/sounds/ipa-ezh.mp3') },
    { ipa: 'm', word: 'man', progress: 55, audio: require('@/assets/sounds/ipa-m.mp3') },
    { ipa: 'n', word: 'now', progress: 66, audio: require('@/assets/sounds/ipa-n.mp3') },
    { ipa: 'ŋ', word: 'sing', progress: 77, audio: require('@/assets/sounds/ipa-ng.mp3') },
    { ipa: 'h', word: 'hat', progress: 88, audio: require('@/assets/sounds/ipa-h.mp3') },
    { ipa: 'l', word: 'love', progress: 99, audio: require('@/assets/sounds/ipa-l.mp3') },
    { ipa: 'r', word: 'red', progress: 5, audio: require('@/assets/sounds/ipa-r.mp3') },
    { ipa: 'w', word: 'wet', progress: 40, audio: require('@/assets/sounds/ipa-w.mp3') },
    { ipa: 'j', word: 'yes', progress: 60, audio: require('@/assets/sounds/ipa-y.mp3') },
];

export default function AlphabetScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [currentPlayer, setCurrentPlayer] = useState<AudioPlayer | null>(null);

    function playSound(audioFileModule: any) {
        try {
            if (currentPlayer) {
                currentPlayer.release();
            }

            const newPlayer = createAudioPlayer(audioFileModule);
            newPlayer.play();

            setCurrentPlayer(newPlayer);
        } catch (error) {
            console.log('Lỗi phát audio:', error);
        }
    }

    useEffect(() => {
        return () => {
            if (currentPlayer) {
                currentPlayer.release();
            }
        };
    }, [currentPlayer]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingBottom: insets.bottom }}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Bảng chữ cái
                </Typography>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Typography variant="bodyBase" color={colors.textSecondary} style={styles.subtitle}>
                    Tập nghe và học phát âm các âm trong tiếng Anh
                </Typography>

                <View style={styles.buttonContainer}>
                    <ButtonCTA title="Bắt đầu" onPress={() => { }} style={{ width: '100%' }} />
                </View>

                {/* --- Section: Nguyên Âm --- */}
                <View style={styles.dividerContainer}>
                    <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                    <Typography variant="caption" style={[styles.dividerText, { color: colors.textPrimary }]}>
                        Nguyên âm
                    </Typography>
                    <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                </View>

                <View style={styles.grid}>
                    {VOWELS.map((item, index) => (
                        <IPACard
                            key={`vowel-${index}`}
                            ipa={item.ipa}
                            word={item.word}
                            progress={item.progress}
                            onPress={() => playSound(item.audio)}
                        />
                    ))}
                    {VOWELS.length % 4 !== 0 && Array.from({ length: 4 - (VOWELS.length % 4) }).map((_, i) => (
                        <View key={`hidden-vowel-${i}`} style={styles.hiddenCard} />
                    ))}
                </View>

                {/* --- Section: Phụ Âm --- */}
                <View style={[styles.dividerContainer, { marginTop: 16 }]}>
                    <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                    <Typography variant="caption" style={[styles.dividerText, { color: colors.textPrimary }]}>
                        Phụ âm
                    </Typography>
                    <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                </View>

                <View style={styles.grid}>
                    {CONSONANTS.map((item, index) => (
                        <IPACard
                            key={`cons-${index}`}
                            ipa={item.ipa}
                            word={item.word}
                            progress={item.progress}
                            onPress={() => playSound(item.audio)}
                        />
                    ))}
                    {CONSONANTS.length % 4 !== 0 && Array.from({ length: 4 - (CONSONANTS.length % 4) }).map((_, i) => (
                        <View key={`hidden-cons-${i}`} style={styles.hiddenCard} />
                    ))}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'transparent' },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { flex: 1, textAlign: 'center' },
    scrollContent: { paddingHorizontal: 24, paddingTop: 16 },
    subtitle: { textAlign: 'center', marginBottom: 24, paddingHorizontal: 20, lineHeight: 22 },
    buttonContainer: { marginBottom: 32 },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    dividerLine: { flex: 1, height: 1 },
    dividerText: { marginHorizontal: 12, fontFamily: 'BeVietnamPro-Bold' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    hiddenCard: { width: '22%', marginBottom: 12 }
});