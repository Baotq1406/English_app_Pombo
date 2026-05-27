import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Icon, IconName } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface InputFieldProps extends TextInputProps {
    label?: string;
    error?: string;
    isPassword?: boolean;
    leftIcon?: IconName;
    containerStyle?: StyleProp<ViewStyle>;
}

export const InputField = ({
    label,
    error,
    isPassword = false,
    leftIcon,
    style,
    containerStyle,
    ...rest
}: InputFieldProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {/* Hiển thị Label (nếu có) */}
            {label && (
                <Typography variant="bodySmall" style={styles.label}>
                    {label}
                </Typography>
            )}

            <View
                style={[
                    styles.inputContainer,
                    {
                        backgroundColor: colors.surfaceAlt,
                        borderColor: error ? colors.danger : isFocused ? colors.primary : 'transparent',
                        borderWidth: 1.5,
                    },
                ]}
            >
                {/* Icon bên trái (nếu có) */}
                {leftIcon && (
                    <View style={styles.iconContainer}>
                        <Icon name={leftIcon} size={20} color={isFocused ? colors.primary : colors.textSecondary} />
                    </View>
                )}

                <TextInput
                    style={[
                        styles.input,
                        { color: colors.textPrimary },
                        !leftIcon && { paddingLeft: 16 },
                        style
                    ]}
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={isPassword && !showPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...rest}
                />

                {/* Nút bật/tắt mật khẩu con mắt */}
                {isPassword && (
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Icon
                            name={showPassword ? 'EyeOff' : 'Eye'}
                            size={20}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Hiển thị lỗi màu đỏ (nếu có) */}
            {error && (
                <Typography variant="tiny" color={colors.danger} style={styles.error}>
                    {error}
                </Typography>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        marginBottom: 6,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderRadius: 16,
    },
    input: {
        flex: 1,
        height: '100%',
        fontFamily: 'BeVietnamPro-Regular',
        fontSize: 16,
    },
    iconContainer: {
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        marginTop: 4,
        marginLeft: 4,
    },
});