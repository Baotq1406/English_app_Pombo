import { Stack } from 'expo-router';

export default function ScreensLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Hệ thống sẽ tự động nhận diện tất cả các file .tsx trong thư mục này */}
        </Stack>
    );
}