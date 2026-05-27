import React, { useState, useMemo, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  DimensionValue,
  useColorScheme,
  Animated
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Coins, 
  BookOpen, 
  Flame, 
  Target, 
  CheckCircle2, 
  Headphones,
  Crown,
  Star,
  Trophy
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import { Typography } from '@/components/ui/Typography';
import { useTaskStore } from '../../src/store/useTaskStore';

// Map string icon names to Lucide components
const IconMap: Record<string, any> = {
  BookOpen, Headphones, Flame, Target, Star, Crown, Trophy
};

export default function TasksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [activeTab, setActiveTab] = useState<'daily' | 'achievements'>('daily');
  
  const { tasks, achievements, totalCoins, claimReward } = useTaskStore();

  // --- ANIMATION VALUES ---
  const coinScale = useRef(new Animated.Value(1)).current;
  const floatingOpacity = useRef(new Animated.Value(0)).current;
  const floatingTranslateY = useRef(new Animated.Value(0)).current;
  const [floatingText, setFloatingText] = useState('');

  const handleClaim = (id: number, coinReward: number, type: 'daily' | 'achievements') => {
    // 1. Cập nhật trạng thái thông qua Zustand store
    claimReward(id, coinReward, type);

    // 2. Chạy animation
    setFloatingText(`+${coinReward}`);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(coinScale, { toValue: 1.2, duration: 150, useNativeDriver: true }),
        Animated.spring(coinScale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true })
      ]),
      Animated.sequence([
        Animated.parallel([
          Animated.timing(floatingOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.timing(floatingTranslateY, { toValue: -25, duration: 400, useNativeDriver: true })
        ]),
        Animated.parallel([
          Animated.timing(floatingOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(floatingTranslateY, { toValue: -40, duration: 200, useNativeDriver: true })
        ])
      ])
    ]).start(() => {
      floatingTranslateY.setValue(0);
    });
  };

  // Helper lấy màu dựa trên icon cho cả Task và Achievement
  const getIconColors = (index: number) => {
    const colorPalette = [
      { color: colors.secondary, bg: colors.surfaceBlue },
      { color: colors.warning, bg: colors.surfaceYellow },
      { color: colors.danger, bg: colors.surfacePink },
      { color: colors.primary, bg: colors.surfaceGreen },
      { color: colors.rankMaster, bg: colors.surfacePurple },
    ];
    return colorPalette[index % colorPalette.length];
  };

  const renderActionButton = (item: any, type: 'daily' | 'achievements') => {
    switch (item.status) {
      case 'claimable':
        return (
          <TouchableOpacity style={[styles.taskActionBtn, styles.btnClaimable]} onPress={() => handleClaim(item.id, item.coinReward, type)}>
            <Text style={styles.btnTextClaimable}>Nhận quà</Text>
          </TouchableOpacity>
        );
      case 'claimed':
        return (
          <View style={[styles.taskActionBtn, styles.btnClaimed]}>
            <CheckCircle2 size={16} color={colors.textSecondary} style={{ marginRight: 4 }} />
            <Text style={styles.btnTextClaimed}>Đã nhận</Text>
          </View>
        );
      case 'in_progress':
      default:
        return (
          <TouchableOpacity style={[styles.taskActionBtn, styles.btnInProgress]}>
            <Text style={styles.btnTextInProgress}>Tiến độ</Text>
          </TouchableOpacity>
        );
    }
  };

  // Chọn danh sách hiển thị dựa trên tab
  const currentDataList = activeTab === 'daily' ? tasks : achievements;

  return (
    <View style={styles.container}>
      {/* --- HEADER --- */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerSideButton}>
          <ChevronLeft size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
          Nhiệm vụ
        </Typography>
        
        <View style={[styles.headerSideButton, { alignItems: 'flex-end', position: 'relative' }]}>
          <Animated.View style={[styles.coinBadgeInfo, { transform: [{ scale: coinScale }] }]}>
            <Coins size={16} color={colors.warning} />
            <Text style={styles.coinTotalText}>{totalCoins}</Text>
          </Animated.View>
          <Animated.Text style={[styles.floatingCoinText, { opacity: floatingOpacity, transform: [{ translateY: floatingTranslateY }] }]}>
            {floatingText}
          </Animated.Text>
        </View>
      </View>

      {/* --- TABS --- */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'daily' && styles.tabBtnActive]} onPress={() => setActiveTab('daily')}>
          <Text style={[styles.tabText, activeTab === 'daily' && styles.tabTextActive]}>Hằng ngày</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'achievements' && styles.tabBtnActive]} onPress={() => setActiveTab('achievements')}>
          <Text style={[styles.tabText, activeTab === 'achievements' && styles.tabTextActive]}>Thành tựu</Text>
        </TouchableOpacity>
      </View>

      {/* --- LIST --- */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>
            {activeTab === 'daily' ? 'Hoàn thành nhiệm vụ!' : 'Chinh phục đỉnh cao!'}
          </Text>
          <Text style={styles.bannerSubtitle}>
            {activeTab === 'daily' 
              ? 'Tích lũy Coin để đổi lấy các phần quà hấp dẫn trong cửa hàng nhé.' 
              : 'Ghi danh những cột mốc đáng tự hào trên con đường học tập của bạn.'}
          </Text>
        </View>

        {currentDataList.map((item: any, index: number) => {
          const IconComponent = IconMap[item.icon] || BookOpen;
          const { color, bg } = getIconColors(index);
          const progressPercent = Math.min((item.progress / item.target) * 100, 100);

          return (
            <View key={item.id} style={[styles.taskCard, item.status === 'claimed' && styles.taskCardDisabled]}>
              <View style={styles.taskHeader}>
                <View style={styles.taskTitleRow}>
                  <View style={[styles.iconWrap, { backgroundColor: bg }]}>
                    <IconComponent size={22} color={color} />
                  </View>
                  <View style={styles.taskInfoWrap}>
                    <Text style={styles.taskTitle}>{item.title}</Text>
                    <Text style={styles.taskDesc}>{item.desc}</Text>
                  </View>
                </View>

                <View style={styles.rewardBadge}>
                  <Coins size={14} color={colors.warning} />
                  <Text style={styles.rewardText}>+{item.coinReward}</Text>
                </View>
              </View>

              <View style={styles.taskFooter}>
                <View style={styles.progressSection}>
                  <View style={styles.progressBarBg}>
                    <View style={[
                      styles.progressBarFill, 
                      { width: `${progressPercent}%` as DimensionValue, backgroundColor: item.status === 'claimed' ? colors.disabled : colors.primary }
                    ]} />
                  </View>
                  <Text style={styles.progressText}>
                    {item.progress.toLocaleString()}/{item.target.toLocaleString()}
                  </Text>
                </View>
                {renderActionButton(item, activeTab)}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// --- DYNAMIC STYLES (Không thay đổi) ---
const getStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'transparent', marginBottom: 8 },
  headerSideButton: { width: 80, height: 40, justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center' },
  
  coinBadgeInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceYellow, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.2)' },
  coinTotalText: { fontSize: 14, fontWeight: '800', color: colors.warning, marginLeft: 4 },
  floatingCoinText: { position: 'absolute', right: 10, top: 0, fontSize: 16, fontWeight: '900', color: colors.warning, textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 12 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', backgroundColor: colors.surfaceAlt },
  tabBtnActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: colors.textOnAction },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  banner: { backgroundColor: colors.surfaceBlue, padding: 20, borderRadius: 20, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(14, 165, 233, 0.1)' },
  bannerTitle: { fontSize: 18, fontWeight: '800', color: colors.secondary, marginBottom: 6 },
  bannerSubtitle: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  taskCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  taskCardDisabled: { opacity: 0.6 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  taskTitleRow: { flexDirection: 'row', flex: 1 },
  iconWrap: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  taskInfoWrap: { flex: 1, paddingRight: 8 },
  taskTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  taskDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
  rewardBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceYellow, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  rewardText: { fontSize: 12, fontWeight: '700', color: colors.warning, marginLeft: 4 },
  taskFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressSection: { flex: 1, marginRight: 20 },
  progressBarBg: { height: 8, backgroundColor: colors.border, borderRadius: 4, marginBottom: 6, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  progressText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  taskActionBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minWidth: 90 },
  btnClaimable: { backgroundColor: colors.warning, shadowColor: colors.warning, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  btnTextClaimable: { color: colors.textOnAction, fontSize: 13, fontWeight: '700' },
  btnInProgress: { backgroundColor: colors.surfaceAlt },
  btnTextInProgress: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  btnClaimed: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  btnTextClaimed: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
});