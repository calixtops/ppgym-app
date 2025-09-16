import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProgramSelectionScreenProps {
  onSelectProgram: (program: 'pedro' | 'georgia') => void;
}

export const ProgramSelectionScreen: React.FC<ProgramSelectionScreenProps> = ({
  onSelectProgram
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo ao PPGym! 💪</Text>
        <Text style={styles.subtitle}>
          Escolha seu programa de treinos para começar sua jornada fitness
        </Text>
      </View>

      <View style={styles.programsContainer}>
        {/* Programa do Pedro */}
        <Pressable 
          style={styles.programCard}
          onPress={() => onSelectProgram('pedro')}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="figure.strengthtraining.traditional" size={32} color={colors.primary} />
            </View>
            <View style={styles.cardBadge}>
              <Text style={styles.badgeText}>COMPLETO</Text>
            </View>
          </View>
          
          <Text style={styles.programName}>Treino do Pedro</Text>
          <Text style={styles.programDescription}>
            Programa completo com 5 treinos (A, B, C, D, E) focados em hipertrofia e força
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
              <Text style={styles.featureText}>5 treinos pré-definidos</Text>
            </View>
            <View style={styles.feature}>
              <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
              <Text style={styles.featureText}>Sistema de rotação automática</Text>
            </View>
            <View style={styles.feature}>
              <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
              <Text style={styles.featureText}>Exercícios para todos os grupos</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.startText}>Começar agora</Text>
            <IconSymbol name="arrow.right.circle.fill" size={20} color={colors.primary} />
          </View>
        </Pressable>

        {/* Programa da Georgia */}
        <Pressable 
          style={[styles.programCard, styles.georgiaCard]}
          onPress={() => onSelectProgram('georgia')}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
              <IconSymbol name="plus.circle.fill" size={32} color={colors.secondary} />
            </View>
            <View style={[styles.cardBadge, { backgroundColor: colors.secondary + '15' }]}>
              <Text style={[styles.badgeText, { color: colors.secondary }]}>PERSONALIZADO</Text>
            </View>
          </View>
          
          <Text style={styles.programName}>Treino da Georgia</Text>
          <Text style={styles.programDescription}>
            Crie seu próprio programa de treinos personalizado do zero
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <IconSymbol name="plus.circle" size={16} color={colors.secondary} />
              <Text style={styles.featureText}>Criar treinos personalizados</Text>
            </View>
            <View style={styles.feature}>
              <IconSymbol name="plus.circle" size={16} color={colors.secondary} />
              <Text style={styles.featureText}>Adicionar exercícios únicos</Text>
            </View>
            <View style={styles.feature}>
              <IconSymbol name="plus.circle" size={16} color={colors.secondary} />
              <Text style={styles.featureText}>Flexibilidade total</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.startText}>Criar programa</Text>
            <IconSymbol name="arrow.right.circle.fill" size={20} color={colors.secondary} />
          </View>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Você pode alterar seu programa a qualquer momento nas configurações
        </Text>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  programsContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  programCard: {
    backgroundColor: colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: colors.border,
    elevation: 3,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  georgiaCard: {
    borderColor: colors.secondary + '30',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.bold,
    color: colors.primary,
  },
  programName: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: colors.text,
    marginBottom: Spacing.sm,
  },
  programDescription: {
    fontSize: Typography.fontSizes.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  featuresContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    fontSize: Typography.fontSizes.sm,
    color: colors.text,
    fontWeight: Typography.fontWeights.medium,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  startText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});