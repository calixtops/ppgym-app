import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceVariant?: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error?: string;
  card?: string;
  tint?: string;
  icon?: string;
}

// Constantes para cores dos programas
export const PROGRAM_COLORS = {
  PEDRO: '#f25924', // Laranja
  GEORGIA: '#e91e63', // Rosa vibrante
} as const;

export const createSharedHomeScreenStyles = (colors: ThemeColors, isGeorgia: boolean = false) => {
  // Cores específicas para cada programa
  const programColors = isGeorgia ? {
    accent: PROGRAM_COLORS.GEORGIA, // Rosa vibrante para Georgia
    cardBackground: colors.surface,
    textPrimary: colors.text,
    textSecondary: colors.textSecondary,
    // Melhor contraste para Georgia - cores mais fortes
    heroText: colors.text,
    buttonText: '#FFFFFF',
    statText: colors.text,
    // Garantir contraste adequado nos textos
    primaryTextColor: colors.text,
    secondaryTextColor: colors.textSecondary,
  } : {
    accent: PROGRAM_COLORS.PEDRO, // Laranja para Pedro
    cardBackground: colors.surface,
    textPrimary: colors.text,
    textSecondary: colors.textSecondary,
    heroText: colors.text,
    buttonText: '#FFFFFF',
    statText: colors.text,
    primaryTextColor: colors.text,
    secondaryTextColor: colors.textSecondary,
  };

  return StyleSheet.create({
    // Container principal
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    
    // ScrollView
    scrollView: {
      flex: 1,
    },
    
    scrollContent: {
      paddingBottom: Spacing.xl,
    },

    // Header com botão de trocar programa
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.xs,
    },

    switchProgramButton: {
      backgroundColor: programColors.accent,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
    },

    switchProgramButtonText: {
      color: programColors.buttonText,
      fontSize: Typography.fontSizes.xs,
      fontWeight: Typography.fontWeights.semibold,
    },

    // Hero Section
    heroSection: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.xl,
      backgroundColor: colors.background,
    },

    greeting: {
      fontSize: Typography.fontSizes.xxl,
      fontWeight: Typography.fontWeights.bold,
      color: programColors.textPrimary,
      marginBottom: Spacing.xs,
      // Melhor legibilidade para Georgia
      ...(isGeorgia && {
        fontSize: Typography.fontSizes.xxxl,
        letterSpacing: 0.5,
      }),
    },

    subtitle: {
      fontSize: Typography.fontSizes.md,
      color: programColors.textSecondary,
      marginBottom: Spacing.lg,
      // Melhor legibilidade para Georgia
      ...(isGeorgia && {
        fontSize: Typography.fontSizes.lg,
        fontWeight: Typography.fontWeights.medium,
      }),
    },

    workoutCard: {
      backgroundColor: programColors.cardBackground,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },

    workoutHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },

    workoutTitle: {
      fontSize: Typography.fontSizes.lg,
      fontWeight: Typography.fontWeights.bold,
      color: programColors.textPrimary,
      flex: 1,
      // Melhor legibilidade para Georgia
      ...(isGeorgia && {
        fontSize: Typography.fontSizes.xl,
        letterSpacing: 0.3,
      }),
    },

    workoutStatus: {
      fontSize: Typography.fontSizes.xs,
      fontWeight: Typography.fontWeights.semibold,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
      overflow: 'hidden',
    },

    statusCompleted: {
      backgroundColor: colors.success + '20',
      color: colors.success,
    },

    statusPending: {
      backgroundColor: colors.warning + '20',
      color: colors.warning,
    },

    workoutDescription: {
      fontSize: Typography.fontSizes.md,
      color: programColors.textSecondary,
      marginBottom: Spacing.md,
    },

    workoutActions: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },

    primaryButton: {
      backgroundColor: programColors.accent,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.md,
      flex: 1,
      alignItems: 'center',
    },

    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: programColors.accent,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.md,
      flex: 1,
      alignItems: 'center',
    },

    primaryButtonText: {
      color: programColors.buttonText,
      fontSize: Typography.fontSizes.md,
      fontWeight: Typography.fontWeights.semibold,
    },

    secondaryButtonText: {
      color: programColors.accent,
      fontSize: Typography.fontSizes.md,
      fontWeight: Typography.fontWeights.semibold,
    },

    // Stats Section
    statsSection: {
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.xl,
    },

    sectionTitle: {
      fontSize: Typography.fontSizes.lg,
      fontWeight: Typography.fontWeights.bold,
      color: programColors.textPrimary,
      marginBottom: Spacing.md,
      // Melhor legibilidade para Georgia
      ...(isGeorgia && {
        fontSize: Typography.fontSizes.xl,
        letterSpacing: 0.3,
      }),
    },

    statsGrid: {
      flexDirection: 'row',
      gap: Spacing.md,
    },

    statCard: {
      flex: 1,
      backgroundColor: programColors.cardBackground,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },

    statValue: {
      fontSize: Typography.fontSizes.xxl,
      fontWeight: Typography.fontWeights.bold,
      color: programColors.accent,
      marginBottom: Spacing.xs,
    },

    statLabel: {
      fontSize: Typography.fontSizes.xs,
      color: programColors.textSecondary,
      textAlign: 'center',
    },

    // Quick Actions
    quickActionsSection: {
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.xl,
    },

    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
    },

    quickActionCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: programColors.cardBackground,
      borderRadius: BorderRadius.md,
      padding: Spacing.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },

    quickActionIcon: {
      width: 32,
      height: 32,
      marginBottom: Spacing.sm,
      tintColor: programColors.accent,
    },

    quickActionTitle: {
      fontSize: Typography.fontSizes.md,
      fontWeight: Typography.fontWeights.semibold,
      color: programColors.textPrimary,
      textAlign: 'center',
      marginBottom: Spacing.xs,
      // Melhor legibilidade para Georgia
      ...(isGeorgia && {
        fontSize: Typography.fontSizes.lg,
        fontWeight: Typography.fontWeights.bold,
      }),
    },

    quickActionDescription: {
      fontSize: Typography.fontSizes.xs,
      color: programColors.textSecondary,
      textAlign: 'center',
    },

    // Recent Workouts
    recentWorkoutsSection: {
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.xl,
    },

    recentWorkoutCard: {
      backgroundColor: programColors.cardBackground,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      marginBottom: Spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },

    recentWorkoutHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },

    recentWorkoutName: {
      fontSize: Typography.fontSizes.md,
      fontWeight: Typography.fontWeights.semibold,
      color: programColors.textPrimary,
    },

    recentWorkoutDate: {
      fontSize: Typography.fontSizes.xs,
      color: programColors.textSecondary,
    },

    recentWorkoutStats: {
      flexDirection: 'row',
      gap: Spacing.md,
    },

    recentWorkoutStat: {
      fontSize: Typography.fontSizes.xs,
      color: programColors.textSecondary,
    },

    // Empty states
    emptyState: {
      alignItems: 'center',
      paddingVertical: Spacing.xl,
    },

    emptyStateText: {
      fontSize: Typography.fontSizes.md,
      color: programColors.textSecondary,
      textAlign: 'center',
      marginTop: Spacing.md,
    },

    // Utility classes
    textCenter: {
      textAlign: 'center',
    },

    textBold: {
      fontWeight: Typography.fontWeights.semibold,
    },

    marginBottomMd: {
      marginBottom: Spacing.md,
    },

    marginBottomLg: {
      marginBottom: Spacing.lg,
    },
  });
};

// Tipos para as props dos componentes
export interface HomeScreenStyleProps {
  colors: ThemeColors;
  isGeorgia?: boolean;
}