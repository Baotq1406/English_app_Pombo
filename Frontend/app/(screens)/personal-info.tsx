import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LEARNING_GOALS = [
    'Giao tiếp cơ bản', 'Luyện thi TOEIC/IELTS', 'Phục vụ công việc',
    'Đi du lịch/Định cư', 'Cải thiện điểm số', 'Sở thích cá nhân'
];
const CURRENT_LEVELS = [
    'Số 0 / Mới bắt đầu', 'Sơ cấp (A1-A2)', 'Trung cấp (B1-B2)',
    'Cao cấp (C1-C2)', 'Từng học nhưng quên nhiều'
];

const InputField = ({ icon, label, value, onChangeText, keyboardType = 'default', editable = true, colors }: any) => (
    <View style={styles.inputContainer}>
        <Typography variant="caption" color={colors.textSecondary} style={{ marginBottom: 6, marginLeft: 4 }}>{label}</Typography>
        <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.inputIcon}>
                <Icon name={icon as any} size={20} color={colors.textSecondary} />
            </View>
            <TextInput
                style={[styles.input, { color: editable ? colors.textPrimary : colors.textSecondary }]}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                editable={editable}
                placeholder={`Nhập ${label.toLowerCase()}`}
                placeholderTextColor={colors.textSecondary}
            />
        </View>
    </View>
);

const DropdownField = ({ icon, label, value, onPress, colors }: any) => (
    <View style={styles.inputContainer}>
        <Typography variant="caption" color={colors.textSecondary} style={{ marginBottom: 6, marginLeft: 4 }}>{label}</Typography>
        <TouchableOpacity
            style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.inputIcon}>
                <Icon name={icon as any} size={20} color={colors.textSecondary} />
            </View>
            <Typography variant="bodyBase" style={[styles.dropdownText, { color: colors.textPrimary }]}>{value}</Typography>
            <Icon name="ChevronDown" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    </View>
);

const SelectionModal = ({ visible, title, options, selectedValue, onSelect, onClose, colors, insets }: any) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                <TouchableWithoutFeedback>
                    <View style={[styles.modalContent, { backgroundColor: colors.background, paddingBottom: insets.bottom + 20 }]}>
                        <View style={styles.modalHeader}>
                            <Typography variant="h3" color={colors.textPrimary}>{title}</Typography>
                            <TouchableOpacity onPress={onClose} style={styles.closeModalBtn}>
                                <Icon name="X" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        {options.map((option: string, index: number) => {
                            const isSelected = option === selectedValue;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.modalOption, { borderBottomColor: colors.border }]}
                                    onPress={() => { onSelect(option); onClose(); }}
                                >
                                    <Typography variant="bodyBase" style={{ color: isSelected ? colors.primary : colors.textPrimary, fontFamily: isSelected ? 'BeVietnamPro-Bold' : 'BeVietnamPro-Medium' }}>
                                        {option}
                                    </Typography>
                                    {isSelected && <Icon name="Check" size={20} color={colors.primary} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
);

export default function PersonalInfoScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [name, setName] = useState('Mr.T');
    const [email, setEmail] = useState('mrt@gmail.com');
    const [phone, setPhone] = useState('0987654321');
    const [goal, setGoal] = useState(LEARNING_GOALS[0]);
    const [level, setLevel] = useState(CURRENT_LEVELS[1]);

    const [isGoalVisible, setGoalVisible] = useState(false);
    const [isLevelVisible, setLevelVisible] = useState(false);

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background, paddingBottom: insets.bottom }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {/* --- HEADER --- */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Thông tin cá nhân
                </Typography>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 40) }]} showsVerticalScrollIndicator={false}>

                {/* --- AVATAR SECTION --- */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: 'https://lol-skin.weblog.vc/img/wallpaper/tiles/Teemo_0.jpg?1773887081' }} style={styles.avatar} />
                        <TouchableOpacity style={[styles.editAvatarBtn, { backgroundColor: colors.primary, borderColor: colors.surface }]}>
                            <Icon name="Camera" size={16} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <Typography variant="bodySmall" color={colors.textSecondary} style={{ marginTop: 12 }}>Thay đổi ảnh đại diện</Typography>
                </View>

                {/* --- THÔNG TIN CƠ BẢN --- */}
                <Typography variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>Thông tin cơ bản</Typography>
                <InputField icon="User" label="Tên hiển thị" value={name} onChangeText={setName} colors={colors} />
                <InputField icon="Mail" label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" colors={colors} />
                <InputField icon="Phone" label="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" colors={colors} />

                {/* --- HỒ SƠ HỌC TẬP --- */}
                <Typography variant="h3" color={colors.textPrimary} style={[styles.sectionTitle, { marginTop: 16 }]}>Hồ sơ học tập</Typography>
                <DropdownField icon="Target" label="Mục tiêu học tập" value={goal} onPress={() => setGoalVisible(true)} colors={colors} />
                <DropdownField icon="BarChart" label="Trình độ hiện tại" value={level} onPress={() => setLevelVisible(true)} colors={colors} />

                {/* --- NÚT XÁC NHẬN --- */}
                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={() => { router.back(); }}>
                    <Typography variant="buttonCTA" color="#FFF">Lưu thay đổi</Typography>
                </TouchableOpacity>

            </ScrollView>

            {/* --- CÁC BOTTOM SHEET MODALS --- */}
            <SelectionModal
                visible={isGoalVisible}
                title="Mục tiêu học tập"
                options={LEARNING_GOALS}
                selectedValue={goal}
                onSelect={setGoal}
                onClose={() => setGoalVisible(false)}
                colors={colors}
                insets={insets}
            />
            <SelectionModal
                visible={isLevelVisible}
                title="Trình độ hiện tại"
                options={CURRENT_LEVELS}
                selectedValue={level}
                onSelect={setLevel}
                onClose={() => setLevelVisible(false)}
                colors={colors}
                insets={insets}
            />

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { flex: 1, textAlign: 'center' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 16 },

    avatarSection: { alignItems: 'center', marginBottom: 32 },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E2E8F0' },
    editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3 },

    sectionTitle: { marginBottom: 16 },
    inputContainer: { marginBottom: 16 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16 },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontFamily: 'BeVietnamPro-Medium', fontSize: 16, height: '100%' },
    dropdownText: { flex: 1 },

    saveBtn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },

    modalOverlay: { flex: 1, justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    closeModalBtn: { padding: 4 },
    modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 }
});