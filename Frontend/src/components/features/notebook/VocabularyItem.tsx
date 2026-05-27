import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Colors } from '@/constants/theme';
// Giả định bạn đã tạo component Icon ở các bước trước

// Định nghĩa kiểu dữ liệu mẫu cho một từ vựng
export interface VocabularyData {
    id: string;
    word: string;
    type: string;
    isReviewing: boolean;
    level: number;
    phonetic?: string; // Ví dụ: /rɪˈzɪl.jənt/
    shortDefinition: string;
    detailedDefinition?: string; // Ví dụ: "Kiên cường, mềm dẻo..."
    examples?: string[]; // Ví dụ: ["Despite facing...", "Mặc dù gặp phải..."]
}

interface VocabularyItemProps {
    data: VocabularyData;
    isSelectionMode: boolean; 
    onLongPress: () => void;  
    onSelect: () => void;
    statusColor?: string; // Màu xanh lá hoặc xanh dương tùy trạng thái ôn tập/ngủ đông
}

export const VocabularyItem = ({ data, isSelectionMode, onLongPress, onSelect, statusColor = Colors.light.primary }: VocabularyItemProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    
    // State để quản lý trạng thái mở rộng/rút gọn
    const [isExpanded, setIsExpanded] = useState(false);

    const handlePress = () => {
        if (isSelectionMode) {
            onSelect(); // Nếu đang ở chế độ chọn, chỉ đổi Radio
        } else {
            setIsExpanded(!isExpanded); // Nếu không, mới cho xổ xuống
        }
    };

    return (
        <TouchableOpacity 
            onPress={handlePress}
            onLongPress={onLongPress}
            delayLongPress={500} // Nhấn giữ 0.5s
            activeOpacity={0.7}
            style={[
                styles.card, 
                { borderColor: data.isReviewing ? colors.primary : colors.secondary }
            ]}
        >
            <View style={styles.headerRow}>
                <View style={styles.leftInfo}>
                    <View style={[
                        styles.radioOuter, 
                        { borderColor: data.isReviewing ? colors.primary : colors.disabled }
                    ]}>
                        {data.isReviewing && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                    </View>
                    <Typography variant="bodyLarge">{data.word}</Typography>
                    <Typography variant="bodySmall" color={colors.textSecondary} style={{marginLeft: 4}}>
                        ({data.type})
                    </Typography>
                </View>
                {!isExpanded && (
                    <Typography variant="bodySmall" style={styles.shortDef}>
                        {data.shortDefinition}
                    </Typography>
                )}
            </View>

            {isExpanded && (
                <View style={styles.detailSection}>
                    <Typography 
                        variant="caption" 
                        color={data.isReviewing ? colors.primary : colors.secondary} 
                        style={{marginBottom: 4}}
                    >
                        {data.phonetic}
                    </Typography>
                    <Typography variant="bodyBase" style={{marginBottom: 8}}>
                        {data.detailedDefinition}
                    </Typography>
                    {data.examples?.map((ex: string, i: number) => (
                        <Typography key={i} variant="caption" color={colors.textSecondary}>
                            • {ex}
                        </Typography>
                    ))}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: { padding: 16, borderRadius: 16, borderWidth: 1.5, marginBottom: 12, width: '100%' },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    leftInfo: { flexDirection: 'row', alignItems: 'center' },
    dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
    shortDef: { flex: 1, textAlign: 'right', marginLeft: 10 },
    detailSection: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#eee' },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});