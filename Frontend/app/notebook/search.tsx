import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, useColorScheme } from 'react-native';
import { useFocusEffect, useRouter, Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { VocabularyItem, VocabularyData } from '@/components/features/notebook/VocabularyItem';
import { EmptyState } from '@/components/features/notebook/EmptyState';

const initialMockResults: VocabularyData[] = [
    { id: '1', word: 'resilient', type: 'adj', level: 1, isReviewing: true, phonetic: '/rɪˈzɪl.jənt/', shortDefinition: 'kiên cường', detailedDefinition: 'Khả năng phục hồi nhanh chóng.', examples: ["She is resilient."] },
    { id: '2', word: 'optimistic', type: 'adj', level: 1, isReviewing: false, phonetic: '/ˌɒp.tɪˈmɪs.tɪk/', shortDefinition: 'lạc quan', detailedDefinition: 'Tin vào điều tốt đẹp.', examples: ["Stay optimistic."] },
    { id: '3', word: 'consistent', type: 'adj', level: 1, isReviewing: true, phonetic: '/kənˈsɪs.tənt/', shortDefinition: 'kiên định', detailedDefinition: 'Luôn giữ vững phong độ.', examples: ["Be consistent in learning."] },
    { id: '4', word: 'ambitious', type: 'adj', level: 1, isReviewing: false, phonetic: '/æmˈbɪʃ.əs/', shortDefinition: 'tham vọng', detailedDefinition: 'Có ý chí tiến thủ lớn.', examples: ["An ambitious plan."] },
    { id: '5', word: 'discipline', type: 'n', level: 1, isReviewing: true, phonetic: '/ˈdɪs.ə.plɪn/', shortDefinition: 'kỷ luật', detailedDefinition: 'Sự tự giác tuân thủ quy tắc.', examples: ["Self-discipline is key."] },
    { id: '6', word: 'versatile', type: 'adj', level: 1, isReviewing: false, phonetic: '/ˈvɜː.sə.taɪl/', shortDefinition: 'linh hoạt', detailedDefinition: 'Nhiều công dụng, đa năng.', examples: ["A versatile tool."] },
    { id: '7', word: 'empathy', type: 'n', level: 1, isReviewing: true, phonetic: '/ˈem.pə.θi/', shortDefinition: 'thấu cảm', detailedDefinition: 'Thấu hiểu cảm xúc người khác.', examples: ["Show some empathy."] },
    { id: '8', word: 'integrity', type: 'n', level: 1, isReviewing: false, phonetic: '/ɪnˈteɡ.rə.ti/', shortDefinition: 'chính trực', detailedDefinition: 'Sự trung thực và đạo đức.', examples: ["A man of integrity."] },
    { id: '9', word: 'innovative', type: 'adj', level: 1, isReviewing: true, phonetic: '/ˈɪn.ə.veɪ.tɪv/', shortDefinition: 'đột phá', detailedDefinition: 'Có tính sáng tạo mới mẻ.', examples: ["An innovative idea."] },
    { id: '10', word: 'patience', type: 'n', level: 1, isReviewing: false, phonetic: '/ˈpeɪ.ʃəns/', shortDefinition: 'kiên nhẫn', detailedDefinition: 'Khả năng chờ đợi bình tĩnh.', examples: ["Patience is a virtue."] },
];

export default function SearchScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    const [allData, setAllData] = useState<VocabularyData[]>(initialMockResults);
    const [savedData, setSavedData] = useState<VocabularyData[]>(initialMockResults);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const textInputRef = useRef<TextInput>(null);

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

    const results = useMemo(() => {
        if (debouncedQuery.trim().length <= 1) return [];
        return allData.filter(item => 
            item.word.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
    }, [allData, debouncedQuery]);

    const hasChanges = useMemo(() => {
        return allData.some(item => {
            const original = savedData.find(o => o.id === item.id);
            return original ? item.isReviewing !== original.isReviewing : false;
        });
    }, [allData, savedData]);

    const toggleVocabularyStatus = (id: string) => {
        setAllData(prev => prev.map(item => 
            item.id === id ? { ...item, isReviewing: !item.isReviewing } : item
        ));
    };

    const handleLongPress = (id: string) => {
        if (!isSelectionMode) {
            setIsSelectionMode(true);
            toggleVocabularyStatus(id);
        }
    };

    const handleSave = () => {
        setSavedData([...allData]); 
        setIsSelectionMode(false);
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
                <EmptyState message={`Từ vựng này tôi không tìm thấy trong sổ tay của bạn, đừng lo lắng
Hãy vào cửa hàng mở gói từ vựng ngay, Hôm nay sẽ là một ngày may mắn của bạn.`} />
            );
        }

        if (results.length > 0) {
            return (
                <View style={styles.resultsList}>
                    {results.map((item) => (
                        <VocabularyItem 
                            key={item.id} 
                            data={item} 
                            isSelectionMode={isSelectionMode}
                            onLongPress={() => handleLongPress(item.id)}
                            onSelect={() => toggleVocabularyStatus(item.id)}
                            statusColor={item.isReviewing ? colors.primary : colors.secondary}
                        />
                    ))}
                </View>
            );
        }
        return null; 
    };

    return (
        <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
            <Tabs.Screen options={{ tabBarStyle: { display: 'none' } }} />

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
                <View style={styles.searchRow}>
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
                    
                    <TouchableOpacity 
                        style={[
                            styles.saveBtn, 
                            { backgroundColor: hasChanges ? colors.secondary : colors.disabled }
                        ]} 
                        disabled={!hasChanges}
                        onPress={handleSave}
                    >
                        <Typography variant="tiny" color={hasChanges ? colors.textOnAction : colors.textSecondary}>
                            Lưu thay đổi
                        </Typography>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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
        paddingTop: 5,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
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
        fontFamily: 'BeVietnamPro-Medium',
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
    resultsList: {
        flex: 1,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
});