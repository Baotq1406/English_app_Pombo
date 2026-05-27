import { NotebookListBase } from '@/components/features/notebook/NotebookListBase';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export default function ReviewScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <NotebookListBase 
            title="Từ ôn tập"
            themeColor={colors.primary} // Màu xanh lá
            initialData={[
                { id: 'r1', word: 'resilient', type: 'adj', level: 1, isReviewing: true, shortDefinition: 'kiên cường', phonetic: '/rɪˈzɪl.jənt/' },
                { id: 'r2', word: 'consistent', type: 'adj', level: 1, isReviewing: true, shortDefinition: 'kiên định', phonetic: '/kənˈsɪs.tənt/' },
                { id: 'r3', word: 'ambitious', type: 'adj', level: 2, isReviewing: true, shortDefinition: 'tham vọng', phonetic: '/æmˈbɪʃ.əs/' },
                { id: 'r4', word: 'discipline', type: 'n', level: 2, isReviewing: true, shortDefinition: 'kỷ luật', phonetic: '/ˈdɪs.ə.plɪn/' },
                { id: 'r5', word: 'versatile', type: 'adj', level: 3, isReviewing: true, shortDefinition: 'linh hoạt', phonetic: '/ˈvɜː.sə.taɪl/' },
                { id: 'r6', word: 'empathy', type: 'n', level: 3, isReviewing: true, shortDefinition: 'thấu cảm', phonetic: '/ˈem.pə.θi/' },
                { id: 'r7', word: 'integrity', type: 'n', level: 4, isReviewing: true, shortDefinition: 'chính trực', phonetic: '/ɪnˈteɡ.rə.ti/' },
                { id: 'r8', word: 'innovative', type: 'adj', level: 4, isReviewing: true, shortDefinition: 'đột phá', phonetic: '/ˈɪn.ə.veɪ.tɪv/' },
                { id: 'r9', word: 'patience', type: 'n', level: 5, isReviewing: true, shortDefinition: 'kiên nhẫn', phonetic: '/ˈpeɪ.ʃəns/' },
                { id: 'r10', word: 'proactive', type: 'adj', level: 5, isReviewing: true, shortDefinition: 'chủ động', phonetic: '/prəʊˈæk.tɪv/' },
                // ... Thêm tiếp cho đủ 20 từ tương tự với các level rải rác từ 1-5
            ]}
        />
    );
}