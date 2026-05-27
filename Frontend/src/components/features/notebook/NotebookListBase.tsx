import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    View, StyleSheet, ScrollView, SafeAreaView,
    TouchableOpacity, useColorScheme, TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { VocabularyItem, VocabularyData } from './VocabularyItem';
import { EmptyState } from './EmptyState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { vocabApi } from '@/services/vocabulary';

interface NotebookListBaseProps {
    title: string;
    themeColor: string;
    isReviewing: boolean;
}

export const NotebookListBase = ({ title, themeColor, isReviewing }: NotebookListBaseProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();

    const [activeLevel, setActiveLevel] = useState(1);
    const [results, setResults] = useState<VocabularyData[]>([]);
    const [originalData, setOriginalData] = useState<VocabularyData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [loading, setLoading] = useState(true);

    const LEVEL_THEME_COLORS = useMemo(() => [
        colors.danger,
        colors.warning,
        colors.secondary,
        colors.primary,
        colors.rankMaster,
    ], [colors]);

    const getLevelGradients = (level: number) => {
        const baseColor = LEVEL_THEME_COLORS[level - 1];
        return [baseColor, `${baseColor}00`] as const;
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await vocabApi.getMine({
                is_reviewing: isReviewing,
                review_level: activeLevel,
                search: searchQuery || undefined,
            });
            const mapped: VocabularyData[] = data.map((r) => ({
                id: r.id,
                word: r.word,
                type: r.type || '',
                isReviewing: r.is_reviewing ?? isReviewing,
                level: r.review_level ?? r.vocab_level ?? 1,
                phonetic: r.phonetic || undefined,
                shortDefinition: r.meaning_vi || '',
                detailedDefinition: r.definition_vi || undefined,
                examples: [r.example_en, r.example_vi].filter(Boolean) as string[] || undefined,
            }));
            setResults(mapped);
            setOriginalData(JSON.parse(JSON.stringify(mapped)));
        } catch (e) {
            console.error('Failed to fetch vocabulary:', e);
            setResults([]);
            setOriginalData([]);
        } finally {
            setLoading(false);
        }
    }, [isReviewing, activeLevel, searchQuery]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredData = useMemo(() => {
        if (searchQuery.trim().length > 0) return results;
        return results.filter(item => item.level === activeLevel);
    }, [results, activeLevel, searchQuery]);

    const hasChanges = useMemo(() => {
        return results.some(item => {
            const original = originalData.find(o => o.id === item.id);
            return original ? item.isReviewing !== original.isReviewing : false;
        });
    }, [results, originalData]);

    const toggleStatus = (id: string) => {
        setResults(prev => prev.map(item =>
            item.id === id ? { ...item, isReviewing: !item.isReviewing } : item
        ));
    };

    const handleSave = async () => {
        const changed = results.filter(item => {
            const original = originalData.find(o => o.id === item.id);
            return original ? item.isReviewing !== original.isReviewing : false;
        });
        try {
            await Promise.all(changed.map(item => vocabApi.toggle(item.id)));
            setOriginalData(JSON.parse(JSON.stringify(results)));
            setIsSelectionMode(false);
            fetchData();
        } catch (e) {
            console.error('Failed to save:', e);
        }
    };

    const handleToggleAndSave = async (id: string) => {
        try {
            await vocabApi.toggle(id);
            fetchData();
        } catch (e) {
            console.error('Failed to toggle:', e);
        }
    };

    const insets = useSafeAreaInsets();
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 20), backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => router.back()}><Icon name="ChevronLeft" size={28} color={colors.textPrimary} /></TouchableOpacity>
                <Typography variant="h2" style={[styles.headerTitle, { color: colors.textPrimary }]}>{title}</Typography>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.searchSection}>
                <View style={styles.searchRow}>
                    <View style={[
                        styles.searchBar,
                        {
                            backgroundColor: colors.surface,
                            borderColor: isFocused ? colors.primary : colors.border
                        }
                    ]}>
                        <Icon
                            name="Search"
                            size={18}
                            color={isFocused ? colors.primary : colors.textSecondary}
                        />
                        <TextInput
                            style={[
                                styles.searchInput,
                                { color: isFocused ? colors.textPrimary : colors.textSecondary }
                            ]}
                            placeholder="tìm kiếm..."
                            placeholderTextColor={colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                        {searchQuery !== '' ? (
                            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                                <Icon name="XCircle" size={18} color={colors.textSecondary} />
                            </TouchableOpacity>
                        ) : null}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.saveBtn,
                            { backgroundColor: hasChanges ? colors.secondary : colors.disabled }
                        ]}
                        disabled={!hasChanges}
                        onPress={handleSave}
                    >
                        <Typography variant="tiny" color={hasChanges ? '#fff' : colors.textSecondary}>
                            Lưu thay đổi
                        </Typography>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.levelWrapper}>
                <View style={styles.topBarContainer}>
                    {LEVEL_THEME_COLORS.map((color, idx) => (
                        <View key={idx} style={[styles.colorSegment, { backgroundColor: color }]} />
                    ))}
                </View>

                <View style={styles.levelContainer}>
                    {[1, 2, 3, 4, 5].map((lvl) => {
                        const isActive = activeLevel === lvl;
                        return (
                            <TouchableOpacity
                                key={lvl}
                                onPress={() => { setActiveLevel(lvl); setIsSelectionMode(false); }}
                                style={styles.levelTab}
                            >
                                {isActive && (
                                    <LinearGradient
                                        colors={getLevelGradients(lvl)}
                                        style={StyleSheet.absoluteFill}
                                    />
                                )}
                                <Typography
                                    variant="tiny"
                                    style={[
                                        styles.levelText,
                                        { color: colors.textPrimary },
                                        isActive && { fontWeight: 'bold' }
                                    ]}
                                >
                                    Mức độ {lvl}
                                </Typography>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <EmptyState message="Đang tải..." />
                ) : filteredData.length > 0 ? (
                    filteredData.map((item) => (
                        <VocabularyItem
                            key={item.id}
                            data={item}
                            isSelectionMode={isSelectionMode}
                            onLongPress={() => { setIsSelectionMode(true); toggleStatus(item.id); }}
                            onSelect={() => toggleStatus(item.id)}
                            statusColor={themeColor}
                        />
                    ))
                ) : (
                    <EmptyState message={searchQuery ? "Không tìm thấy từ" : "Mức độ này chưa có từ"} />
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 10,
        zIndex: 10,
    },
    headerTitle: { flex: 1, textAlign: 'center' },
    searchSection: {
        paddingTop: 5,
        paddingHorizontal: 24,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    searchBar: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        marginLeft: 10,
        fontSize: 12,
    },
    clearBtn: {
        padding: 4,
    },
    saveBtn: {
        paddingHorizontal: 12,
        height: 38,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    levelWrapper: { marginHorizontal: 20, marginBottom: 20 },
    topBarContainer: {
        flexDirection: 'row',
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
        gap: 0
    },
    colorSegment: { flex: 1 },
    levelContainer: {
        flexDirection: 'row',
        height: 40,
        gap: 0
    },
    levelTab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: -1,
        padding: 0
    },
    levelText: { zIndex: 1 },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 40 }
});
