import { create } from 'zustand';

export interface Task {
  id: number;
  title: string;
  desc: string;
  progress: number;
  target: number;
  coinReward: number;
  status: 'claimable' | 'in_progress' | 'claimed';
  icon: any;
}

interface TaskState {
  tasks: Task[];
  achievements: Task[];
  totalCoins: number;
  claimReward: (id: number, coinReward: number, type: 'daily' | 'achievements') => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [
    { id: 1, title: 'Học 50 từ vựng mới', desc: 'Hoàn thành bài học từ vựng bất kỳ.', progress: 50, target: 50, coinReward: 20, status: 'claimable', icon: 'BookOpen' },
    { id: 2, title: 'Luyện nghe 15 phút', desc: 'Nghe audio hoặc xem video bài giảng.', progress: 5, target: 15, coinReward: 15, status: 'in_progress', icon: 'Headphones' },
    { id: 3, title: 'Đạt chuỗi 7 ngày học', desc: 'Giữ streak không bị đứt đoạn.', progress: 7, target: 7, coinReward: 50, status: 'claimed', icon: 'Flame' },
    { id: 4, title: 'Hoàn thành bài test tuần', desc: 'Đạt tối thiểu 80% điểm bài test.', progress: 0, target: 1, coinReward: 100, status: 'in_progress', icon: 'Target' },
  ],
  achievements: [
    { id: 101, title: 'Khởi đầu nan', desc: 'Hoàn thành 10 nhiệm vụ hằng ngày đầu tiên.', progress: 10, target: 10, coinReward: 200, status: 'claimable', icon: 'Star' },
    { id: 102, title: 'Bậc thầy từ vựng', desc: 'Học tích lũy 1,000 từ vựng.', progress: 450, target: 1000, coinReward: 1500, status: 'in_progress', icon: 'BookOpen' },
    { id: 103, title: 'Chăm chỉ tột bậc', desc: 'Đạt chuỗi học (streak) 30 ngày liên tục.', progress: 7, target: 30, coinReward: 1000, status: 'in_progress', icon: 'Flame' },
    { id: 104, title: 'Kẻ thống trị', desc: 'Đạt Top 1 Bảng xếp hạng tuần.', progress: 1, target: 1, coinReward: 2000, status: 'claimed', icon: 'Crown' },
    { id: 105, title: 'Cao thủ cày cuốc', desc: 'Tích lũy tổng cộng 10,000 XP.', progress: 8500, target: 10000, coinReward: 5000, status: 'in_progress', icon: 'Trophy' },
  ],
  totalCoins: 1250,
  claimReward: (id, coinReward, type) =>
    set((state) => {
      const listKey = type === 'daily' ? 'tasks' : 'achievements';
      return {
        [listKey]: state[listKey].map((item) =>
          item.id === id ? { ...item, status: 'claimed' } : item
        ),
        totalCoins: state.totalCoins + coinReward,
      };
    }),
}));
