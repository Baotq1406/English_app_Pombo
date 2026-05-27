import React from 'react';
import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <Tabs
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <CustomTabBar {...props} colors={colors} />}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="shop" />
            <Tabs.Screen name="game" />
            <Tabs.Screen name="utils" />
            <Tabs.Screen name="profile" />
        </Tabs>
    );
}

function CustomTabBar({ state, descriptors, navigation, colors }: any) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.surface,
                    bottom: insets.bottom + 10,
                }
            ]}
        >
            {state.routes.map((route: any, index: number) => {
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                let iconName: any = 'BookOpen';
                if (route.name === 'shop') iconName = 'Store';
                if (route.name === 'game') iconName = 'Gamepad2';
                if (route.name === 'utils') iconName = 'LayoutGrid';
                if (route.name === 'profile') iconName = 'User';

                if (route.name === 'game') {
                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={styles.item}
                        >
                            <View
                                style={[
                                    styles.centerButton,
                                    {
                                        backgroundColor: isFocused
                                            ? colors.primary
                                            : colors.secondary,
                                    },
                                ]}
                            >
                                <Icon name={iconName} color="#fff" size={26} />
                            </View>
                        </TouchableOpacity>
                    );
                }

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={styles.item}
                    >
                        <Icon
                            name={iconName}
                            size={24}
                            color={isFocused ? colors.primary : colors.textSecondary}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 16,
        right: 16,
        height: 70,
        borderRadius: 35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -20,
    },
});