import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkoutRotation } from '@/hooks/WorkoutContext';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from './ui/icon-symbol';

export const ProgramSelector: React.FC = () => {
  const { selectedProgram, switchProgram } = useWorkoutRotation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const programs = [
    {
      id: 'pedro' as const,
      name: 'Programa Pedro',
      description: '5 treinos • A→B→C→D→E',
      icon: 'figure.strengthtraining.traditional',
      color: colors.primary,
    },
    {
      id: 'georgia' as const,
      name: 'Programa Georgia',
      description: '4 treinos • A→B→C→D',
      icon: 'figure.mind.and.body',
      color: colors.secondary,
    },
  ];

  const handleProgramChange = async (programId: 'pedro' | 'georgia') => {
    if (programId !== selectedProgram) {
      await switchProgram(programId);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Escolha seu Programa
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Selecione o programa de treino que deseja seguir
          </Text>
        </View>
        
        <View style={styles.programsContainer}>
          {programs.map((program) => (
            <Pressable
              key={program.id}
              style={[
                styles.programCard,
                {
                  backgroundColor: selectedProgram === program.id 
                    ? program.color + '20' 
                    : colors.card,
                  borderColor: selectedProgram === program.id 
                    ? program.color 
                    : colors.border,
                }
              ]}
              onPress={() => handleProgramChange(program.id)}
            >
              <View style={styles.programHeader}>
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: program.color + '20' }
                ]}>
                  <IconSymbol 
                    name={program.icon as any} 
                    size={24} 
                    color={program.color} 
                  />
                </View>
                
                <View style={styles.programInfo}>
                  <Text style={[
                    styles.programName,
                    { 
                      color: selectedProgram === program.id 
                        ? program.color 
                        : colors.text 
                    }
                  ]}>
                    {program.name}
                  </Text>
                  <Text style={[styles.programDescription, { color: colors.textSecondary }]}>
                    {program.description}
                  </Text>
                </View>
                
                {selectedProgram === program.id && (
                  <IconSymbol 
                    name="checkmark.circle.fill" 
                    size={20} 
                    color={program.color} 
                  />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
  },
  programsContainer: {
    gap: Spacing.lg,
  },
  programCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    padding: Spacing.lg,
  },
  programHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  programInfo: {
    flex: 1,
  },
  programName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  programDescription: {
    fontSize: Typography.fontSizes.sm,
  },
});