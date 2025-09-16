import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  style,
  padding = 'medium',
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'small':
        return { padding: Spacing.sm };
      case 'large':
        return { padding: Spacing.lg };
      default: // medium
        return { padding: Spacing.md };
    }
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 4,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      ...getPaddingStyle(),
    },
    header: {
      marginBottom: title || subtitle ? Spacing.sm : 0,
    },
    title: {
      fontSize: Typography.fontSizes.lg,
      fontWeight: Typography.fontWeights.semibold,
      color: colors.text,
      marginBottom: subtitle ? 2 : 0,
    },
    subtitle: {
      fontSize: Typography.fontSizes.sm,
      color: colors.textSecondary,
    },
  });

  return (
    <View style={[styles.card, style]}>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      {children}
    </View>
  );
};