import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { CategoryCard } from '@/components/features/notebook/CategoryCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotebookScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            {/* Header: Đã sửa lại để dàn hàng ngang chuẩn */}
            <View style={[
                styles.headerContainer, 
                { paddingTop: Math.max(insets.top, 20), backgroundColor: colors.background }
            ]}>
                <TouchableOpacity 
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Icon name="ChevronLeft" size={28} />
                </TouchableOpacity>
                
                <Typography variant="h2" style={styles.headerTitle}>
                    Sổ tay của bạn
                </Typography>
                
                {/* View rỗng để cân bằng layout cho tiêu đề nằm giữa */}
                <View style={styles.placeholder} /> 
            </View>

            <ScrollView 
                contentContainerStyle={styles.container} 
                showsVerticalScrollIndicator={false}
            >
                {/* Search Bar & Button Row */}
                <View style={styles.searchRow}>
                    <TouchableOpacity 
                        activeOpacity={0.8}
                        style={[
                            styles.searchBar, 
                            { backgroundColor: colors.surface, borderColor: colors.border }
                        ]}
                        onPress={() => router.push('/notebook/search')}
                    >
                        <Icon name="Search" size={18} color={colors.textSecondary} />
                        <Typography 
                            variant="caption" 
                            color={colors.textSecondary} 
                            style={{ marginLeft: 8, flex: 1 }}
                            numberOfLines={1}
                        >
                            tìm kiếm từ vựng trong sổ tay
                        </Typography>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.saveBtn, { backgroundColor: colors.disabled }]} 
                        disabled
                    >
                        <Typography variant="tiny" color={colors.textSecondary}>
                            Lưu thay đổi
                        </Typography>
                    </TouchableOpacity>
                </View>

                {/* Categories */}
                <View style={styles.categoryList}>
                    <CategoryCard 
                        title="Từ vựng đang ôn tập"
                        image={require('@/assets/images/dragon-nobg.png')} 
                        borderColor={colors.primary}
                        onPress={() => router.push('/notebook/review')}
                    />

                    <CategoryCard 
                        title="Từ vựng đang ngủ đông"
                        image={require('@/assets/images/dragon-nobg.png')} 
                        borderColor={colors.secondary}
                        onPress={() => router.push('/notebook/hibernating')}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 10,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: { 
        flex: 1, 
        textAlign: 'center',
    },
    placeholder: { 
        width: 40, // Bằng kích thước nút back để tiêu đề căn giữa tuyệt đối
    },
    container: { 
        paddingHorizontal: 20, 
        paddingTop: 10,
        paddingBottom: 20 
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
    saveBtn: {
        paddingHorizontal: 12,
        height: 38,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryList: { 
        gap: 16 // Sử dụng gap thay vì margin cho các item trong list
    }
});