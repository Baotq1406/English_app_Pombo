import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, useColorScheme, Modal, Image } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/Icon';
import { ButtonCTA } from '@/components/ui/ButtonCTA';

type QuestionType = 'meaning' | 'fill_blank';

interface Option {
    id: string;
    text: string;
}

interface Question {
    id: number;
    type: QuestionType;
    title: string;
    subtitle?: string;
    content: string;
    options: Option[];
    correctAnswerId: string;
}

const MOCK_QUESTIONS: Question[] = [
    {
        id: 1,
        type: 'meaning',
        title: 'Chọn nghĩa đúng cho từ:',
        content: 'Persistence',
        options: [
            { id: 'A', text: 'Kiên trì' },
            { id: 'B', text: 'Lười biếng' },
            { id: 'C', text: 'Nhanh nhẹn' },
            { id: 'D', text: 'Thông minh' },
        ],
        correctAnswerId: 'A'
    },
    {
        id: 2,
        type: 'fill_blank',
        title: 'Điền vào chỗ trống',
        subtitle: 'Chọn từ đúng nhất để hoàn thành câu bên dưới',
        content: 'She is very _______ about her future.',
        options: [
            { id: 'A', text: 'worried' },
            { id: 'B', text: 'worrying' },
            { id: 'C', text: 'worry' },
        ],
        correctAnswerId: 'A'
    }
];

export default function ReviewScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Thêm state quản lý hoàn thành và điểm số
    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState(0);

    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [exitAction, setExitAction] = useState<any>(null);

    // Xác nhận thoát khi chưa làm xong
    useEffect(() => {
        const unsub = navigation.addListener('beforeRemove', (e) => {
            if (isFinished || exitAction) {
                // Đã hoàn thành hoặc đã xác nhận thoát, cho phép thoát bình thường
                return;
            }
            
            // Ngăn việc thoát ngay lập tức
            e.preventDefault();

            setExitAction(e.data.action);
            setShowExitConfirm(true);
        });

        return unsub;
    }, [navigation, isFinished, exitAction]);

    const handleConfirmExit = () => {
        setShowExitConfirm(false);
        if (exitAction) {
            navigation.dispatch(exitAction);
        } else {
            router.back();
        }
    };

    const handleCancelExit = () => {
        setShowExitConfirm(false);
        setExitAction(null);
    };

    const question = MOCK_QUESTIONS[currentIdx];
    const totalQuestions = MOCK_QUESTIONS.length;
    const progress = ((currentIdx + 1) / totalQuestions) * 100;
    const accuracy = Math.round((score / Math.max(totalQuestions * 5, 1)) * 100);
    const completedWords = totalQuestions * 10;
    const currentStreak = 8;
    const isLowAccuracy = accuracy < 50;

    const isCorrect = selectedOption === question?.correctAnswerId;

    const handleSubmit = () => {
        if (selectedOption) {
            setIsSubmitted(true);
            // Cộng điểm nếu trả lời đúng
            if (isCorrect) {
                setScore(prev => prev + 5);
            }
        }
    };

    const handleNext = () => {
        if (currentIdx < totalQuestions - 1) {
            setCurrentIdx(currentIdx + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
        } else {
            // Hiển thị màn hình hoàn thành thay vì thoát ngay
            setIsFinished(true);
        }
    };

    const getOptionStyle = (optionId: string) => {
        const isSelected = selectedOption === optionId;
        
        if (!isSubmitted) {
            if (isSelected) return { borderColor: colors.primary, borderWidth: 2, badgeBg: colors.primary, badgeText: colors.textOnAction, textCol: colors.textPrimary };
            return { borderColor: colors.border, borderWidth: 1, badgeBg: colors.surfaceGreen, badgeText: colors.primary, textCol: colors.textPrimary };
        }

        const isThisCorrect = optionId === question.correctAnswerId;
        const isThisSelected = optionId === selectedOption;

        if (isThisCorrect) {
            return { borderColor: colors.primary, borderWidth: 2, badgeBg: colors.primary, badgeText: colors.textOnAction, textCol: colors.primary };
        }
        if (isThisSelected && !isThisCorrect) {
            return { borderColor: colors.danger, borderWidth: 2, badgeBg: colors.surfacePink, badgeText: colors.danger, textCol: colors.danger };
        }

        return { borderColor: colors.border, borderWidth: 1, badgeBg: colors.disabled, badgeText: colors.textSecondary, textCol: colors.textSecondary };
    };

    // --- GIAO DIỆN HOÀN THÀNH ---
    if (isFinished) {
        return (
            <View style={[
                styles.completionContainer,
                {
                    backgroundColor: colorScheme === 'dark' ? colors.background : (isLowAccuracy ? '#F2EABF' : '#C7ECD7'),
                    paddingTop: Math.max(insets.top, 20)
                }
            ]}>
                <View style={styles.completionContent}>
                    <Image
                        source={require('@/assets/images/dragon-nobg.png')}
                        style={styles.completionMascot}
                        resizeMode="contain"
                    />
                    
                    <Typography variant="h1" color={colors.textPrimary} style={styles.completionTitle}>
                        {isLowAccuracy ? 'Đừng nản lòng' : 'Chúc mừng!'}
                    </Typography>
                    
                    <Typography variant="bodyBase" color={colors.textSecondary} style={styles.completionSubtitle}>
                        {isLowAccuracy
                            ? 'Bạn chỉ còn một chút nữa thôi.'
                            : 'Bạn đã hoàn thành xuất sắc mục tiêu hôm nay.'}
                    </Typography>

                    <View style={[styles.summaryMainCard, { backgroundColor: colors.surface }]}>
                        <View style={[styles.summaryIcon, { backgroundColor: isLowAccuracy ? '#EF4444' : colors.primary }]}>
                            <Icon name="BookText" size={18} color={colors.textOnAction} />
                        </View>
                        <View>
                            <Typography variant="bodySmall" color={colors.textSecondary}>
                                Từ vựng
                            </Typography>
                            <Typography variant="h3" color={colors.textPrimary} style={styles.summaryMainValue}>
                                {completedWords} từ đã hoàn thành
                            </Typography>
                        </View>
                    </View>

                    <View style={styles.summaryRow}>
                        <View style={[styles.summaryMiniCard, { backgroundColor: colors.surface }]}>
                            <View style={[styles.summaryMiniIcon, { backgroundColor: isLowAccuracy ? '#EF4444' : colors.primary }]}>
                                <Icon name="Check" size={16} color={colors.textOnAction} />
                            </View>
                            <Typography variant="bodySmall" color={colors.textSecondary} style={styles.summaryLabel}>
                                Độ chính xác
                            </Typography>
                            <Typography variant="h2" color={colors.textPrimary} style={styles.summaryMiniValue}>
                                {accuracy}%
                            </Typography>
                        </View>

                        <View style={[styles.summaryMiniCard, { backgroundColor: colors.surface }]}>
                            <View style={[
                                styles.summaryMiniIcon,
                                {
                                    backgroundColor: colorScheme === 'dark' ? colors.surfaceGreen : '#E9FBF0'
                                }
                            ]}>
                                <Icon name="Flame" size={16} color={colors.primary} />
                            </View>
                            <Typography variant="bodySmall" color={colors.textSecondary} style={styles.summaryLabel}>
                                Streak
                            </Typography>
                            <Typography variant="h2" color={colors.textPrimary} style={styles.summaryMiniValue}>
                                {currentStreak} ngày
                            </Typography>
                        </View>
                    </View>

                    {/* <Typography variant="caption" color={colors.textSecondary} style={styles.scoreHint}>
                        Điểm thưởng: {score}
                    </Typography> */}
                </View>

                <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
                    <ButtonCTA
                        title="Quay về"
                        onPress={() => router.back()}
                        style={styles.completionButton}
                    />
                </View>
            </View>
        );
    }

    // --- GIAO DIỆN CÂU HỎI (GIỮ NGUYÊN) ---
    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Ôn tập
                </Typography>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                    <Typography variant="bodySmall" color={colors.textPrimary}>
                        Tiến độ bài học
                    </Typography>
                    <View style={[styles.progressBadge, { backgroundColor: colors.surfaceGreen }]}>
                        <Typography variant="caption" color={colors.primary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                            {`${currentIdx + 1}/${totalQuestions}`}
                        </Typography>
                    </View>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceGreen }]}>
                    <View style={[styles.progressBarFill, { backgroundColor: colors.primary, width: `${progress}%` }]} />
                </View>
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {question.type === 'meaning' && (
                    <>
                        <Typography variant="h3" color={colors.textPrimary} style={{ textAlign: 'center', marginBottom: 16 }}>
                            {question.title}
                        </Typography>
                        
                        <Typography variant="display" color={colors.primary} style={{ textAlign: 'center', marginBottom: 40, fontSize: 32 }}>
                            {question.content}
                        </Typography>
                    </>
                )}

                {question.type === 'fill_blank' && (
                    <>
                        <Typography variant="h3" color={colors.textPrimary} style={{ textAlign: 'center', marginBottom: 4 }}>
                            {question.title}
                        </Typography>
                        {question.subtitle && (
                            <Typography variant="bodySmall" color={colors.primary} style={{ textAlign: 'center', marginBottom: 24, fontSize: 12 }}>
                                {question.subtitle}
                            </Typography>
                        )}
                        
                        <View style={[styles.fillBlankCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={[styles.bookIconBadge, { backgroundColor: colors.surfaceGreen }]}>
                                <Icon name="BookOpen" size={20} color={colors.primary} />
                            </View>
                            <Typography variant="h3" color={colors.textPrimary} style={{ textAlign: 'center', lineHeight: 32 }}>
                                {question.content}
                            </Typography>
                        </View>
                    </>
                )}

                <View style={styles.optionsContainer}>
                    {question.options.map((option) => {
                        const styleInfo = getOptionStyle(option.id);
                        return (
                            <TouchableOpacity
                                key={option.id}
                                activeOpacity={0.8}
                                disabled={isSubmitted}
                                onPress={() => setSelectedOption(option.id)}
                                style={[
                                    styles.optionCard,
                                    { backgroundColor: colors.surface, borderColor: styleInfo.borderColor, borderWidth: styleInfo.borderWidth }
                                ]}
                            >
                                <View style={[styles.optionBadge, { backgroundColor: styleInfo.badgeBg }]}>
                                    <Typography variant="bodyBase" style={{ fontFamily: 'Baloo2-Bold', color: styleInfo.badgeText }}>
                                        {option.id}
                                    </Typography>
                                </View>
                                <Typography variant="h3" color={styleInfo.textCol} style={{ fontSize: 18, alignSelf: 'center', lineHeight: 28, flex: 1 }}>
                                    {option.text}
                                </Typography>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                
                <View style={{ height: 160 }} />
            </ScrollView>

            {!isSubmitted ? (
                <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                    <ButtonCTA
                        title="Gửi câu trả lời"
                        disabled={!selectedOption}
                        onPress={handleSubmit}
                    />
                </View>
            ) : (
                <View style={[
                    styles.resultBottomSheet,
                    { 
                        backgroundColor: isCorrect ? colors.surfaceGreen : colors.surfacePink,
                        paddingBottom: Math.max(insets.bottom, 20)
                    }
                ]}>
                    <View style={styles.resultHeader}>
                        <View style={[
                            styles.resultIconWrapper,
                            { backgroundColor: isCorrect ? colors.primary : colors.danger }
                        ]}>
                            <Icon name={isCorrect ? "Check" : "X"} size={24} color={colors.textOnAction} />
                        </View>
                        <View>
                            <Typography variant="h2" color={isCorrect ? colors.primary : colors.danger}>
                                {isCorrect ? "Chính xác!" : "Chưa đúng rồi!"}
                            </Typography>
                            <Typography variant="bodyBase" color={colors.textPrimary} style={{ fontFamily: 'Baloo2-Bold' }}>
                                {isCorrect ? "Bạn nhận được 5đ" : `Đáp án đúng là: ${question.correctAnswerId}`}
                            </Typography>
                        </View>
                    </View>
                    <ButtonCTA
                        title={isCorrect ? "Tiếp tục" : "Đã hiểu"}
                        onPress={handleNext}
                        style={{ backgroundColor: isCorrect ? colors.primary : colors.danger }}
                    />
                </View>
            )}

            <Modal
                transparent={true}
                visible={showExitConfirm}
                animationType="fade"
                onRequestClose={handleCancelExit}
            >
                <View style={[styles.modalOverlay, { backgroundColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)' }]}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <View style={[styles.modalIconWrapper, { backgroundColor: '#F2A9AE' }]}>
                            <Icon name="CircleX" size={40} color={'#8D404A'} strokeWidth={1.75} />
                        </View>
                        <Typography variant="h2" color={colors.textPrimary} style={{ textAlign: 'center', marginBottom: 12 }}>
                            Xác nhận thoát
                        </Typography>
                        <Typography variant="bodyBase" color={colors.textSecondary} style={{ textAlign: 'center', marginBottom: 24 }}>
                            Bạn có chắc chắn muốn thoát? Kết quả ôn tập sẽ không được lưu.
                        </Typography>
                        <View style={styles.modalActions}>
                            <TouchableOpacity 
                                style={[styles.modalButtonBase, styles.modalButtonCancel, { borderColor: colors.border }]}
                                onPress={handleCancelExit}
                            >
                                <Typography variant="buttonCTA" color={colors.textPrimary}>
                                    Huỷ
                                </Typography>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButtonBase, styles.modalButtonConfirm, { backgroundColor: colors.danger }]}
                                onPress={handleConfirmExit}
                            >
                                <Typography variant="buttonCTA" color={'#FFFFFF'}>
                                    Thoát
                                </Typography>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    // Các style cũ giữ nguyên
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'transparent',
        marginBottom: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
    },
    progressContainer: {
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    progressBarBg: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    fillBlankCard: {
        borderRadius: 24,
        borderWidth: 1,
        padding: 24,
        alignItems: 'center',
        marginBottom: 32,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    bookIconBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    optionsContainer: {
        gap: 16,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
    },
    optionBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 16,
        backgroundColor: 'transparent',
    },
    resultBottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        gap: 16,
    },
    resultIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    // --- Style mới cho màn hình hoàn thành ---
    completionContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    completionContent: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 54,
    },
    completionMascot: {
        width: 200,
        height: 200,
        marginBottom: 18,
    },
    completionTitle: {
        textAlign: 'center',
        marginBottom: 8,
        fontSize: 42,
        lineHeight: 48,
    },
    completionSubtitle: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 20,
        lineHeight: 26,
    },
    summaryMainCard: {
        width: '100%',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 14,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    summaryIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryMainValue: {
        fontSize: 28,
        lineHeight: 34,
    },
    summaryRow: {
        width: '100%',
        flexDirection: 'row',
        gap: 14,
    },
    summaryMiniCard: {
        flex: 1,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 14,
        minHeight: 120,
        justifyContent: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    summaryMiniIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    summaryLabel: {
        marginBottom: 6,
        fontSize: 15,
    },
    summaryMiniValue: {
        fontSize: 36,
        lineHeight: 42,
    },
    scoreHint: {
        marginTop: 14,
        opacity: 0.9,
    },
    completionButton: {
        borderRadius: 10,
        height: 52,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.16,
        shadowRadius: 5,
        elevation: 4,
    },
    
    // --- Style mới cho giao diện Modal ---
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        width: '100%',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    modalIconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    modalButtonBase: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalButtonCancel: {
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    modalButtonConfirm: {
        // backgroundColor is handled via inline style
    },
});