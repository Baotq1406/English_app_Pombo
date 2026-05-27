import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, useColorScheme, Modal, Image, ActivityIndicator } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/Icon';
import { ButtonCTA } from '@/components/ui/ButtonCTA';
import { vocabApi, UserVocabularyData } from '@/services/vocabulary';

interface ReviewQuestion {
  word: UserVocabularyData;
  options: { id: string; text: string }[];
  correctId: string;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function buildQuestions(words: UserVocabularyData[]): Promise<ReviewQuestion[]> {
  const questions: ReviewQuestion[] = [];
  
  // Pre-fetch fallback distractor pool in case AI fails
  const excludeIds = words.map(w => w.id).join(',');
  let fallbackDistracters: string[] = [];
  try {
    const distractorData = await vocabApi.getDistracters(excludeIds, Math.min(words.length * 3, 100));
    fallbackDistracters = distractorData.map(d => d.meaning_vi).filter(Boolean) as string[];
  } catch {}
  
  for (const word of words) {
    const correctText = word.meaning_vi || '';
    let distractors: string[] = [];
    
    try {
      const aiDistracters = await vocabApi.getAIDistracters(word.id, 3);
      distractors = aiDistracters.filter(d => d !== correctText);
    } catch {
      console.error('Failed to generate AI distractors');
    }
    
    // Fallback to distractor pool if AI didn't give enough
    if (distractors.length < 3) {
      const pool = fallbackDistracters.filter(d => d !== correctText);
      for (const d of pool) {
        if (distractors.length >= 3) break;
        if (!distractors.includes(d)) distractors.push(d);
      }
    }
    
    // Last resort - any remaining slot gets placeholder
    while (distractors.length < 3) {
      distractors.push('(definition not available)');
    }
    
    const allOptions = shuffleArray([
      { text: correctText, isCorrect: true },
      ...distractors.slice(0, 3).map(m => ({ text: m, isCorrect: false })),
    ]);
    
    const correctOptionIdx = allOptions.findIndex(o => o.isCorrect);
    const correctOptionId = String.fromCharCode(65 + correctOptionIdx);
    
    questions.push({
      word,
      options: allOptions.map((opt, idx) => ({
        id: String.fromCharCode(65 + idx),
        text: opt.text,
      })),
      correctId: correctOptionId,
    });
  }
  
  return questions;
}

export default function ReviewScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const [words, setWords] = useState<UserVocabularyData[]>([]);
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [exitAction, setExitAction] = useState<any>(null);

  const [currentNote, setCurrentNote] = useState<string | null>(null);

  useEffect(() => {
    vocabApi.getReviewWords(10).then(async (data) => {
      if (data.length === 0) {
        setError('Không có từ nào cần ôn tập hôm nay. Hãy thêm từ vào sổ tay trước nhé!');
        setLoading(false);
        return;
      }
      setWords(data);
      try {
        const builtQuestions = await buildQuestions(data);
        setQuestions(builtQuestions);
      } catch (err) {
        console.error('Failed to build questions:', err);
        setError('Không thể chuẩn bị bài ôn tập. Vui lòng thử lại sau.');
      }
      setLoading(false);
    }).catch(err => {
      setError('Không thể tải từ ôn tập. Vui lòng thử lại sau.');
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e: any) => {
      if (isFinished || exitAction) return;
      e.preventDefault();
      setExitAction(e.data.action);
      setShowExitConfirm(true);
    });
    return unsub;
  }, [navigation, isFinished, exitAction]);

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    if (exitAction) navigation.dispatch(exitAction);
    else router.back();
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
    setExitAction(null);
  };

  const question = questions[currentIdx];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentIdx + 1) / totalQuestions) * 100 : 0;
  const accuracy = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
  const isLowAccuracy = accuracy < 50;

  const isCorrect = selectedOption === question?.correctId;

  const handleSubmit = async () => {
    if (!selectedOption || !question) return;
    setIsSubmitted(true);
    setCurrentNote(null);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setTotalAnswered(prev => prev + 1);

    try {
      await vocabApi.submitAnswer(question.word.id, isCorrect);
    } catch {
    }
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const getOptionStyle = (optionId: string) => {
    const isSelected = selectedOption === optionId;

    if (!isSubmitted) {
      if (isSelected) return { borderColor: colors.primary, borderWidth: 2, badgeBg: colors.primary, badgeText: colors.textOnAction, textCol: colors.textPrimary };
      return { borderColor: colors.border, borderWidth: 1, badgeBg: colors.surfaceGreen, badgeText: colors.primary, textCol: colors.textPrimary };
    }

    const isThisCorrect = optionId === question?.correctId;
    const isThisSelected = optionId === selectedOption;

    if (isThisCorrect) {
      return { borderColor: colors.primary, borderWidth: 2, badgeBg: colors.primary, badgeText: colors.textOnAction, textCol: colors.primary };
    }
    if (isThisSelected && !isThisCorrect) {
      return { borderColor: colors.danger, borderWidth: 2, badgeBg: colors.surfacePink, badgeText: colors.danger, textCol: colors.danger };
    }
    return { borderColor: colors.border, borderWidth: 1, badgeBg: colors.disabled, badgeText: colors.textSecondary, textCol: colors.textSecondary };
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Typography variant="bodyBase" color={colors.textSecondary} style={{ marginTop: 16 }}>
          Đang tải từ ôn tập...
        </Typography>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Icon name="BookX" size={48} color={colors.textSecondary} />
        <Typography variant="bodyBase" color={colors.textSecondary} style={{ marginTop: 16, textAlign: 'center', paddingHorizontal: 32 }}>
          {error}
        </Typography>
        <View style={{ marginTop: 24 }}>
          <ButtonCTA title="Quay lại" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

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
              ? 'Hãy ôn tập lại những từ này vào ngày mai nhé.'
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
                {totalQuestions} từ đã ôn tập
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
              <View style={[styles.summaryMiniIcon, { backgroundColor: colorScheme === 'dark' ? colors.surfaceGreen : '#E9FBF0' }]}>
                <Icon name="Flame" size={16} color={colors.primary} />
              </View>
              <Typography variant="bodySmall" color={colors.textSecondary} style={styles.summaryLabel}>
                Đúng
              </Typography>
              <Typography variant="h2" color={colors.textPrimary} style={styles.summaryMiniValue}>
                {score}/{totalAnswered}
              </Typography>
            </View>
          </View>
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
        {question && (
          <>
            <Typography variant="h3" color={colors.textPrimary} style={{ textAlign: 'center', marginBottom: 16 }}>
              Chọn nghĩa đúng cho từ:
            </Typography>

            <Typography variant="display" color={colors.primary} style={{ textAlign: 'center', marginBottom: 8, fontSize: 32 }}>
              {question.word.word}
            </Typography>

            {question.word.phonetic && (
              <Typography variant="bodySmall" color={colors.textSecondary} style={{ textAlign: 'center', marginBottom: 40 }}>
                {question.word.phonetic}
              </Typography>
            )}

            {!question.word.phonetic && <View style={{ height: 68 }} />}

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

            {isSubmitted && question.word.example_en && (
              <View style={[styles.exampleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.bookIconBadge, { backgroundColor: colors.surfaceGreen }]}>
                  <Icon name="BookOpen" size={20} color={colors.primary} />
                </View>
                <Typography variant="bodyBase" color={colors.textSecondary} style={{ textAlign: 'center', fontStyle: 'italic', lineHeight: 24 }}>
                  "{question.word.example_en}"
                </Typography>
                {question.word.example_vi && (
                  <Typography variant="caption" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 8, opacity: 0.7 }}>
                    {question.word.example_vi}
                  </Typography>
                )}
              </View>
            )}
          </>
        )}

        <View style={{ height: 200 }} />
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
                {isCorrect ? "Tốt lắm!" : `Đáp án đúng là: ${question?.correctId}`}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  exampleCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginTop: 24,
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
  completionButton: {
    borderRadius: 10,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 4,
  },
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
  },
});
