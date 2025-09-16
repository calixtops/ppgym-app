import React from 'react';
import { Pressable, View, StyleSheet, Text } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  label,
  disabled = false,
  size = 'medium',
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 32;
      default:
        return 24;
    }
  };

  const iconSize = getSize();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      opacity: disabled ? 0.6 : 1,
    },
    checkbox: {
      width: iconSize + 8,
      height: iconSize + 8,
      borderRadius: BorderRadius.sm,
      borderWidth: 2,
      borderColor: checked ? colors.success : colors.border,
      backgroundColor: checked ? colors.success : 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: label ? Spacing.sm : 0,
    },
    label: {
      fontSize: size === 'small' ? Typography.fontSizes.sm : Typography.fontSizes.md,
      color: checked ? colors.success : colors.text,
      fontWeight: checked ? Typography.fontWeights.semibold : Typography.fontWeights.normal,
      textDecorationLine: checked ? 'line-through' : 'none',
      opacity: checked ? 0.8 : 1,
    },
  });

  const handlePress = () => {
    console.log('Checkbox pressed:', !checked); // Debug log
    if (!disabled) {
      onPress();
    }
  };

  return (
    <Pressable 
      style={styles.container} 
      onPress={handlePress}
      disabled={disabled}
      android_ripple={{ color: colors.success + '20' }}
    >
      <View style={styles.checkbox}>
        {checked && (
          <IconSymbol 
            name="checkmark" 
            size={iconSize - 6} 
            color="#ffffff" 
          />
        )}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
};