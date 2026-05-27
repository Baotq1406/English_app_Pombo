import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, useColorScheme, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { VocabularyItem, VocabularyData } from '@/components/features/notebook/VocabularyItem';
import { EmptyState } from '@/components/features/notebook/EmptyState';
import { vocabApi } from '@/services/vocabulary';

export default function SearchScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<(VocabularyData & { isSynced?: boolean })[]>([]);
    const [syncing, setSyncing] = useState<Set<string>>(new Set());
    const [currentOffset, setCurrentOffset] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [syncedIds, setSyncedIds] = useState<Set<string>>(new Set());

    const textInputRef = useRef<TextInput>(null);
    const scrollViewRef = useRef<ScrollView>(null);

    // Load synced vocabulary on mount
    useEffect(() => {
        const loadSyncedVocab = async () => {
            try {
                const mine = await vocabApi.getMine();
                setSyncedIds(new Set(mine.map(v => v.id)));
            } catch (e) {
                console.error('Failed to load synced vocabulary', e);
            }
        };
        loadSyncedVocab();
    }, []);

    useFocusEffect(
        useCallback(() => {
            const timer = setTimeout(() => {
                textInputRef.current?.focus();
            }, 150);
            return () => clearTimeout(timer);
        }, [])
    );

    useEffect(() => {
        setIsLoading(true);
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setIsLoading(false);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        if (debouncedQuery.trim().length > 1) {
            // Search mode
            vocabApi.search(debouncedQuery).then(data => {
                const mapped = data.map(r => ({
                    id: r.id,
                    word: r.word,
                    type: r.type || '',
                    isReviewing: true,
                    level: r.level ?? 1,
                    phonetic: r.phonetic || undefined,
                    shortDefinition: r.meaning_vi || '',
                    detailedDefinition: r.definition_vi || undefined,
                    examples: [r.example_en, r.example_vi].filter(Boolean) as string[] || undefined,
                    isSynced: syncedIds.has(r.id),
                }));
                setResults(mapped);
                setCurrentOffset(0);
                setHasMore(true);
            }).catch(() => setResults([]));
        } else if (debouncedQuery === '') {
            // Empty query - lazy load all vocabulary
            setCurrentOffset(0);
            vocabApi.getVocabulary(0, 50).then(data => {
                const mapped = data.map(r => ({
                    id: r.id,
                    word: r.word,
                    type: r.type || '',
                    isReviewing: true,
                    level: r.level ?? 1,
                    phonetic: r.phonetic || undefined,
                    shortDefinition: r.meaning_vi || '',
                    detailedDefinition: r.definition_vi || undefined,
                    examples: [r.example_en, r.example_vi].filter(Boolean) as string[] || undefined,
                    isSynced: syncedIds.has(r.id),
                }));
                setResults(mapped);
                setCurrentOffset(50);
                setHasMore(data.length === 50);
            }).catch(() => setResults([]));
        } else {
            setResults([]);
        }
    }, [debouncedQuery, syncedIds]);

    const handleSync = async (vocabId: string) => {
        setSyncing(prev => new Set(prev).add(vocabId));
        try {
            await vocabApi.sync(vocabId);
            // Mark as synced, don't remove
            setSyncedIds(prev => new Set(prev).add(vocabId));
            setResults(prev =>
                prev.map(r => r.id === vocabId ? { ...r, isSynced: true } : r)
            );
        } catch (e: any) {
            const msg = e?.payload?.detail || 'Không thể thêm từ này';
            alert(msg);
        } finally {
            setSyncing(prev => {
                const next = new Set(prev);
                next.delete(vocabId);
                return next;
            });
        }
    };

    const loadMore = async () => {
        if (!debouncedQuery || isLoadingMore || !hasMore) return;
        if (debouncedQuery.length > 1) return; // Don't paginate search results
        
        setIsLoadingMore(true);
        try {
            const data = await vocabApi.getVocabulary(currentOffset, 50);
            if (data.length > 0) {
                const mapped = data.map(r => ({
                    id: r.id,
                    word: r.word,
                    type: r.type || '',
                    isReviewing: true,
                    level: r.level ?? 1,
                    phonetic: r.phonetic || undefined,
                    shortDefinition: r.meaning_vi || '',
                    detailedDefinition: r.definition_vi || undefined,
                    examples: [r.example_en, r.example_vi].filter(Boolean) as string[] || undefined,
                    isSynced: syncedIds.has(r.id),
                }));
                setResults(prev => [...prev, ...mapped]);
                setCurrentOffset(prev => prev + 50);
                setHasMore(data.length === 50);
            } else {
                setHasMore(false);
            }
        } catch (e) {
            console.error('Failed to load more', e);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentHeight = event.nativeEvent.contentSize.height;
        const scrollY = event.nativeEvent.contentOffset.y;
        const layoutHeight = event.nativeEvent.layoutMeasurement.height;
        
        if (scrollY + layoutHeight >= contentHeight - 100 && !isLoadingMore && hasMore && debouncedQuery === '') {
            loadMore();
        }
    };

    const renderContent = () => {
        if (isLoading && searchQuery.length > 1) {
            return (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            );
        }

        if (debouncedQuery.length > 1 && results.length === 0) {
            return (
                <EmptyState message={`Từ vựng này tôi không tìm thấy trong sổ tay của bạn, đừng lo lắng\nHãy vào cửa hàng mở gói từ vựng ngay, Hôm nay sẽ là một ngày may mắn của bạn.`} />
            );
        }

        if (results.length > 0) {
            return (
                <View style={styles.resultsList}>
                    {results.map((item) => (
                        <View key={item.id} style={styles.resultRow}>
                            <View style={{ flex: 1 }}>
                                <VocabularyItem
                                    data={item}
                                    isSelectionMode={false}
                                    onLongPress={() => {}}
                                    onSelect={() => {}}
                                    statusColor={colors.primary}
                                />
                            </View>
                            {item.isSynced ? (
                                <View style={[styles.addBtn, { backgroundColor: colors.primary }]}>
                                    <Typography variant="tiny" color="#fff">
                                        ✓ Đã thêm
                                    </Typography>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.addBtn, { backgroundColor: syncing.has(item.id) ? colors.disabled : colors.primary }]}
                                    onPress={() => handleSync(item.id)}
                                    disabled={syncing.has(item.id)}
                                >
                                    <Typography variant="tiny" color="#fff">
                                        {syncing.has(item.id) ? '...' : '+ Thêm'}
                                    </Typography>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                    {isLoadingMore && debouncedQuery === '' && (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="small" color={colors.primary} />
                        </View>
                    )}
                </View>
            );
        }
        return null;
    };

    return (
        <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    Sổ tay của bạn
                </Typography>
                <View style={styles.iconButton} />
            </View>

            <View style={styles.searchSection}>
                <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                    <Icon name="Search" size={18} color={colors.primary} />
                    <TextInput
                        ref={textInputRef}
                        style={[styles.searchInput, { color: colors.textPrimary }]}
                        placeholder="Từ cần tìm"
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchQuery !== '' ? (
                        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                            <Icon name="XCircle" size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>

            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {renderContent()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 15,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: { flex: 1, textAlign: 'center' },
    scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 10, paddingBottom: 40 },
    searchSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        paddingHorizontal: 16,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        marginLeft: 10,
        fontFamily: 'BeVietnamPro-Medium',
        fontSize: 12,
    },
    clearBtn: { padding: 4 },
    resultsList: { flex: 1 },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    resultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    addBtn: {
        paddingHorizontal: 12,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});
