import { NotebookListBase } from '@/components/features/notebook/NotebookListBase';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export default function HibernatingScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <NotebookListBase
            title="Từ ngủ đông"
            themeColor={colors.secondary}
            isReviewing={false}
        />
    );
}
