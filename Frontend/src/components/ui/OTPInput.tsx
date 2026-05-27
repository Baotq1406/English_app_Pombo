import React, { useRef } from 'react';
import { View, TextInput, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
}

export const OTPInput = ({ length = 6, value, onChange }: OTPInputProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const inputs = useRef<Array<TextInput | null>>([]);

    const handleChangeText = (text: string, index: number) => {
        const newValue = value.split('');
        newValue[index] = text;
        const newOTPString = newValue.join('');
        onChange(newOTPString);

        if (text !== '' && index < length - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && value[index] === undefined && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.container}>
            {Array(length).fill(0).map((_, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => { inputs.current[index] = ref; }}
                    style={[
                        styles.input,
                        {
                            backgroundColor: colors.surfaceAlt,
                            color: colors.textPrimary,
                            borderColor: value[index] ? colors.primary : 'transparent',
                        }
                    ]}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={value[index] || ''}
                    onChangeText={(text) => handleChangeText(text.replace(/[^0-9]/g, ''), index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 24,
    },
    input: {
        width: 48,
        height: 56,
        borderRadius: 12,
        borderWidth: 1.5,
        textAlign: 'center',
        fontSize: 24,
        fontFamily: 'Baloo2-Bold',
    },
});