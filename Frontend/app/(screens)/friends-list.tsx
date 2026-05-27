import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Toast } from '@/components/ui/Toast';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MOCK_FRIENDS = [
    { id: '1', name: 'Nguyễn Hải Nam', streak: 15, needsReminder: false, avatar: 'https://statics.koreanbuilds.net/tile_200x200/Braum.webp' },
    { id: '2', name: 'Trần Minh Tuấn', streak: 0, needsReminder: true, avatar: 'https://cdn.modelviewer.lol/lol/tiles/111000.webp' },
    { id: '3', name: 'Lê Thu Hà', streak: 120, needsReminder: false, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFVc4lLOozeYG3OPDSx1ZjKe40HthBmyQR1Q&s' },
    { id: '4', name: 'Phạm Văn Đức', streak: 2, needsReminder: true, avatar: 'https://i1.sndcdn.com/artworks-000239464700-mm5rhr-t500x500.jpg' },
    { id: '5', name: 'Hoàng Mai Anh', streak: 45, needsReminder: false, avatar: 'https://lol-skin.weblog.vc/img/wallpaper/tiles/Yuumi_0.jpg?1773887081' },
    { id: '6', name: 'Vũ Quốc Khánh', streak: 7, needsReminder: false, avatar: 'https://lol-skin.weblog.vc/img/wallpaper/tiles/XinZhao_0.jpg?1775019579' },
];

export default function FriendsListScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [searchQuery, setSearchQuery] = useState('');

    const filteredFriends = MOCK_FRIENDS.filter(friend =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [toastConfig, setToastConfig] = useState({ visible: false, message: '', icon: 'Check' });

    const handleAction = (friendName: string, type: 'fire' | 'remind') => {
        const message = type === 'fire'
            ? `Đã gửi 🔥 cho ${friendName}!`
            : `Đã nhắc ${friendName} vào học!`;

        setToastConfig({ visible: true, message, icon: type === 'fire' ? 'Flame' : 'BellRing' });
        setTimeout(() => setToastConfig(prev => ({ ...prev, visible: false })), 2000);
    };

    const renderFriendItem = ({ item }: { item: typeof MOCK_FRIENDS[0] }) => (
        <View style={[styles.friendItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />

            <View style={styles.infoWrapper}>
                <Typography variant="bodyBase" color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                    {item.name}
                </Typography>
                <View style={styles.streakWrapper}>
                    <Icon name="Flame" size={16} color={item.streak > 0 ? colors.warning : colors.textSecondary} />
                    <Typography variant="caption" color={item.streak > 0 ? colors.warning : colors.textSecondary} style={{ marginLeft: 4, fontFamily: 'BeVietnamPro-Medium' }}>
                        {item.streak} ngày
                    </Typography>
                </View>
            </View>

            {/* Nút Hành động */}
            {item.needsReminder ? (
                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, borderWidth: 1 }]}
                    onPress={() => handleAction(item.name, 'remind')}
                >
                    <Icon name="BellRing" size={16} color={colors.textPrimary} />
                    <Typography variant="caption" color={colors.textPrimary} style={{ marginLeft: 6, fontFamily: 'BeVietnamPro-Medium' }}>Nhắc học</Typography>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: colors.surfacePink }]}
                    onPress={() => handleAction(item.name, 'fire')}
                >
                    <Icon name="Flame" size={16} color={colors.rankMaster} />
                    <Typography variant="caption" color={colors.rankMaster} style={{ marginLeft: 6, fontFamily: 'BeVietnamPro-Medium' }}>Gửi lửa</Typography>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background, paddingBottom: insets.bottom }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

            {/* --- HEADER --- */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Danh sách bạn bè
                </Typography>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => {
                        setToastConfig({ visible: true, message: "Tính năng đang phát triển!", icon: 'UserPlus' });
                        setTimeout(() => setToastConfig(prev => ({ ...prev, visible: false })), 2000);
                    }}
                >
                    <Icon name="UserPlus" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            {/* --- THANH TÌM KIẾM (STICKY) --- */}
            <View style={styles.searchContainer}>
                <View style={[styles.searchInputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Icon name="Search" size={20} color={colors.textSecondary} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.textPrimary }]}
                        placeholder="Tìm kiếm bạn bè..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Icon name="XCircle" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* --- DANH SÁCH BẠN BÈ --- */}
            <FlatList
                data={filteredFriends}
                keyExtractor={(item) => item.id}
                renderItem={renderFriendItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={{ alignItems: 'center', marginTop: 40 }}>
                        <View style={{ opacity: 0.5, marginBottom: 16 }}>
                            <Icon name="Users" size={48} color={colors.textSecondary} />
                        </View>
                        <Typography variant="bodyBase" color={colors.textSecondary}>Không tìm thấy người bạn nào.</Typography>
                    </View>
                )}
            />

            <Toast
                visible={toastConfig.visible}
                message={toastConfig.message}
                icon={toastConfig.icon}
            />

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { flex: 1, textAlign: 'center' },
    addBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },

    searchContainer: { paddingHorizontal: 20, paddingBottom: 16 },
    searchInputWrapper: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16 },
    searchInput: { flex: 1, fontFamily: 'BeVietnamPro-Medium', fontSize: 16, height: '100%', marginHorizontal: 12 },

    listContent: { paddingHorizontal: 20, paddingBottom: 40 },
    friendItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
    avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E2E8F0' },

    infoWrapper: { flex: 1, marginLeft: 12 },
    streakWrapper: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },

    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        paddingVertical: 8,
        borderRadius: 12
    },
});