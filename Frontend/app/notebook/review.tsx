import { NotebookListBase } from '@/components/features/notebook/NotebookListBase';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export default function ReviewScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <NotebookListBase
            title="Từ ôn tập"
            themeColor={colors.primary}
            isReviewing={true}
        />
    );
}
