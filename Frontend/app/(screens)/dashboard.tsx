import React, { useMemo } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  useColorScheme
} from 'react-native';
import { Bell, Flame, Zap, Crown, ChevronLeft, BookOpen, Headphones, Target } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/theme';
import { Typography } from '@/components/ui/Typography';
import { useTaskStore } from '../../src/store/useTaskStore';

const { width } = Dimensions.get('window');

export default function EnhancedDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);

  const { tasks, claimReward } = useTaskStore();
  const completedTasks = tasks.filter(t => t.status === 'claimed' || t.progress >= t.target).length;
  const totalTasks = tasks.length;
  const top2Tasks = tasks.slice(0, 2);

  const IconMap: Record<string, any> = {
    BookOpen, Headphones, Flame, Target
  };

  const CHART_DATA = useMemo(() => {
    const data = [];
    const today = new Date();
    const mockWords = [5, 15, 8, 4, 12];

    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayOfWeek = d.getDay();
      const dayStr = dayOfWeek === 0 ? 'CN' : `T${dayOfWeek + 1}`;

      data.push({
        day: dayStr,
        words: mockWords[4 - i],
        active: i === 0
      });
    }
    return data;
  }, []);

  const LEADERBOARD = [
    { id: '1', rank: 1, name: 'Eiden', score: 2430, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2000', isCurrentUser: false },
    { id: '2', rank: 2, name: 'Jackson', score: 1847, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974', isCurrentUser: false },
    { id: '3', rank: 3, name: 'Emma', score: 1674, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974', isCurrentUser: false },
    { id: '6', rank: 6, name: 'You', score: 1021, avatar: 'https://lol-skin.weblog.vc/img/wallpaper/tiles/Teemo_0.jpg?1773887081', isCurrentUser: true },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>

      {/* --- HEADER --- */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerSideButton}>
          <ChevronLeft size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
          Bảng điều khiển
        </Typography>
        <View style={styles.headerSideButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >

        {/* --- STATS CARDS --- */}
        <View style={styles.cardsRow}>
          <TouchableOpacity style={[styles.card, styles.streakCard]}>
            <View style={styles.streakHeader}>
              <Flame size={20} color={colors.textOnAction} />
              <View style={styles.streakBadge}>
                <Text style={styles.streakBadgeText}>Streak</Text>
              </View>
            </View>
            <Text style={styles.streakNumber}>7</Text>
            <Text style={styles.streakLabel}>NGÀY LIÊN TIẾP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.reviewCard]}
            activeOpacity={0.8}
            onPress={() => router.push('/review')}
          >
            <View style={{ marginBottom: 8 }}>
              <Zap size={26} color={colors.primary} />
            </View>
            <Text style={styles.reviewTitle}>Ôn tập ngay</Text>
            <Text style={styles.reviewSubtitle}>TIẾP TỤC LỘ TRÌNH</Text>
          </TouchableOpacity>
        </View>

        {/* --- LEARNING CHART --- */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Biểu đồ học tập</Text>
          </View>
          <View style={styles.chartCard}>
            <View style={styles.chartSummary}>
              <Text style={styles.chartSummaryNumber}>12</Text>
              <Text style={styles.chartSummaryText}>từ đã học hôm nay!</Text>
            </View>

            <View style={styles.chartSection}>
              {CHART_DATA.map((item, index) => {
                const MAX_WORDS = 20;
                const percent = Math.min((item.words / MAX_WORDS) * 100, 100);
                const barColor = item.active ? colors.primary : (item.words > 0 ? colors.border : 'transparent');

                return (
                  <View key={index} style={styles.chartColumn}>
                    <Text style={[styles.chartWords, item.active && { color: colors.primary, fontWeight: '800' }]}>
                      {item.words > 0 ? item.words : ''}
                    </Text>

                    <View style={styles.chartBarBackground}>
                      <View
                        style={[
                          styles.chartBarFill,
                          { height: `${percent}%`, backgroundColor: barColor }
                        ]}
                      />
                    </View>

                    <View style={[styles.chartDayPill, item.active && { backgroundColor: colors.primary }]}>
                      <Text style={[styles.chartDay, item.active && { color: colors.textOnAction, fontWeight: '800' }]}>
                        {item.day}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* --- DAILY TASKS --- */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nhiệm vụ hằng ngày</Text>
            <TouchableOpacity onPress={() => router.push('/tasks')}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.tasksCard, { marginBottom: 16 }]}
            onPress={() => router.push('/tasks')}
          >
            <View style={styles.circularProgress}>
              <Text style={styles.progressTextMain}>{completedTasks}/{totalTasks}</Text>
              <Text style={styles.progressTextSub}>NV</Text>
            </View>
            <View style={styles.tasksInfo}>
              <Text style={styles.tasksDescription}>
                {completedTasks === totalTasks
                  ? 'Tuyệt vời! Bạn đã hoàn thành tất cả nhiệm vụ hôm nay.'
                  : `Chỉ còn ${totalTasks - completedTasks} nhiệm vụ nữa là hoàn thành mục tiêu hôm nay!`}
              </Text>
              <View style={styles.progressSteps}>
                {Array.from({ length: totalTasks }).map((_, i) => (
                  <View key={i} style={[styles.stepDot, i >= completedTasks ? styles.stepDotInactive : styles.stepDotActive]} />
                ))}
              </View>
            </View>
          </TouchableOpacity>

          {/* Mini Tasks List */}
          {top2Tasks.map((task, index) => {
            const IconComp = IconMap[task.icon] || BookOpen;
            const percent = Math.min((task.progress / task.target) * 100, 100);
            const bgColors = [colors.surfaceBlue, colors.surfaceYellow, colors.surfacePink];
            const iconColors = [colors.secondary, colors.warning, colors.danger];

            return (
              <TouchableOpacity key={task.id} style={styles.miniTaskCard} onPress={() => router.push('/tasks')}>
                <View style={[styles.miniTaskIcon, { backgroundColor: bgColors[index % bgColors.length] }]}>
                  <IconComp size={20} color={iconColors[index % iconColors.length]} />
                </View>
                <View style={styles.miniTaskInfo}>
                  <Text style={styles.miniTaskTitle}>{task.title}</Text>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${percent}%`, backgroundColor: task.status === 'claimed' ? colors.border : colors.primary }]} />
                  </View>
                </View>

                {task.status === 'claimable' ? (
                  <TouchableOpacity
                    style={styles.miniTaskBtnClaimable}
                    onPress={() => claimReward(task.id, task.coinReward, 'daily')}
                  >
                    <Text style={styles.miniTaskTextClaimable}>Nhận quà</Text>
                  </TouchableOpacity>
                ) : task.status === 'claimed' ? (
                  <View style={styles.miniTaskBtnClaimed}>
                    <Text style={styles.miniTaskTextClaimed}>Đã nhận</Text>
                  </View>
                ) : (
                  <View style={styles.miniTaskBtnProgress}>
                    <Text style={styles.miniTaskTextProgress}>Tiến độ</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* --- LEADERBOARD --- */}
        <View style={[styles.sectionContainer, { marginBottom: 40 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bảng xếp hạng</Text>
            <TouchableOpacity onPress={() => router.push('/leaderboard')}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.leaderboardCard}>
            {LEADERBOARD.map((user, index) => {
              const isMe = user.isCurrentUser;
              return (
                <View
                  key={user.id}
                  style={[
                    styles.leaderboardRow,
                    index !== LEADERBOARD.length - 1 && styles.borderBottom,
                    isMe && { backgroundColor: colors.surfaceGreen, borderRadius: 16, paddingHorizontal: 12, marginHorizontal: -12 }
                  ]}
                >
                  <Text style={[styles.rankText, user.rank === 1 && { color: colors.warning }]}>#{user.rank}</Text>
                  <Image source={{ uri: user.avatar }} style={styles.lbAvatar} />
                  <View style={styles.lbInfo}>
                    <Text style={[styles.lbName, isMe && { color: colors.primary, fontWeight: '800' }]}>
                      {user.name}
                    </Text>
                    <Text style={styles.lbPoints}>{user.score} từ</Text>
                  </View>
                  {user.rank === 1 && <Crown size={24} color={colors.warning} />}
                </View>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const getStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  headerSideButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 40,
    marginTop: 8,
  },
  card: {
    width: (width - 56) / 2,
    borderRadius: 20,
    padding: 16,
    height: 130,
    justifyContent: 'center',
  },
  streakCard: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakBadgeText: {
    color: colors.textOnAction,
    fontSize: 12,
    fontWeight: '700',
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.textOnAction,
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 11,
    color: colors.surfaceGreen,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  reviewTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  reviewSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: 16,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  chartSummary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  chartSummaryNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
    lineHeight: 36,
    marginRight: 8,
  },
  chartSummaryText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    paddingBottom: 4,
  },
  chartSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  chartColumn: {
    alignItems: 'center',
    width: 44,
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartWords: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
    marginBottom: 8,
    height: 16,
  },
  chartBarBackground: {
    width: 14,
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 8,
  },
  chartDayPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartDay: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tasksCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  circularProgress: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 7,
    borderColor: colors.primary,
    borderLeftColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  progressTextMain: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
    transform: [{ rotate: '-45deg' }],
  },
  progressTextSub: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    transform: [{ rotate: '-45deg' }],
    marginTop: -2,
  },
  tasksInfo: {
    flex: 1,
    marginLeft: 20,
  },
  tasksDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 14,
  },
  progressSteps: {
    flexDirection: 'row',
    gap: 8,
  },
  stepDot: {
    height: 6,
    flex: 1,
    borderRadius: 3,
  },
  stepDotActive: {
    backgroundColor: colors.primary,
  },
  stepDotInactive: {
    backgroundColor: colors.border,
  },
  miniTaskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  miniTaskIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  miniTaskInfo: {
    flex: 1,
    marginRight: 12,
  },
  miniTaskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  miniTaskBtnClaimed: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  miniTaskTextClaimed: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.disabled,
  },
  miniTaskBtnClaimable: {
    backgroundColor: colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  miniTaskTextClaimable: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textOnAction,
  },
  miniTaskBtnProgress: {
    backgroundColor: colors.surfaceBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  miniTaskTextProgress: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
  },
  leaderboardCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textSecondary,
    width: 32,
  },
  lbAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  lbInfo: {
    flex: 1,
  },
  lbName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  lbPoints: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});