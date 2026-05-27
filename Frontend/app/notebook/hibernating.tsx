import { NotebookListBase } from '@/components/features/notebook/NotebookListBase';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export default function HibernatingScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <NotebookListBase 
            title="Từ ngủ đông"
            themeColor={colors.secondary} // Màu xanh dương
            initialData={[
                { id: 'h1', word: 'obsolete', type: 'adj', level: 1, isReviewing: false, shortDefinition: 'lỗi thời', phonetic: '/ˌɒb.səlˈiːt/' },
                { id: 'h2', word: 'redundant', type: 'adj', level: 1, isReviewing: false, shortDefinition: 'dư thừa', phonetic: '/rɪˈdʌn.dənt/' },
                { id: 'h3', word: 'tedious', type: 'adj', level: 2, isReviewing: false, shortDefinition: 'tẻ nhạt', phonetic: '/ˈtiː.di.əs/' },
                { id: 'h4', word: 'vague', type: 'adj', level: 2, isReviewing: false, shortDefinition: 'mơ hồ', phonetic: '/veɪɡ/' },
                { id: 'h5', word: 'superficial', type: 'adj', level: 3, isReviewing: false, shortDefinition: 'nông cạn', phonetic: '/ˌsuː.pəˈfɪʃ.əl/' },
                { id: 'h6', word: 'trivial', type: 'adj', level: 3, isReviewing: false, shortDefinition: 'tầm thường', phonetic: '/ˈtrɪv.i.əl/' },
                { id: 'h7', word: 'skeptical', type: 'adj', level: 4, isReviewing: false, shortDefinition: 'hoài nghi', phonetic: '/ˈskep.tɪ.kəl/' },
                { id: 'h8', word: 'rigid', type: 'adj', level: 4, isReviewing: false, shortDefinition: 'cứng nhắc', phonetic: '/ˈrɪdʒ.ɪd/' },
                { id: 'h9', word: 'cynical', type: 'adj', level: 5, isReviewing: false, shortDefinition: 'hoài nghi', phonetic: '/ˈsɪn.ɪ.kəl/' },
                { id: 'h10', word: 'stubborn', type: 'adj', level: 5, isReviewing: false, shortDefinition: 'bướng bỉnh', phonetic: '/ˈstʌb.ən/' },
            ]}
        />
    );
}