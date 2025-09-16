import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { workoutTemplates } from '@/constants/workoutTemplates';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

export default function AddWorkoutScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colors);

  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', sets: '', reps: '', weight: '' }
  ]);

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weight: '' }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string) => {
    const updatedExercises = exercises.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    );
    setExercises(updatedExercises);
  };

  const saveWorkout = () => {
    // TODO: Implementar salvamento do treino
    console.log('Treino salvo:', { workoutName, workoutDescription, exercises });
  };

  const getTemplateIcon = (templateName: string) => {
    if (templateName.includes('Pernas')) return 'figure.run';
    if (templateName.includes('Peito')) return 'figure.strengthtraining.traditional';
    if (templateName.includes('Costas')) return 'figure.walk';
    if (templateName.includes('Ombro')) return 'figure.mixed.cardio';
    return 'dumbbell';
  };

  const getTemplateColor = (templateName: string) => {
    if (templateName.includes('Pernas')) return colors.success;
    if (templateName.includes('Peito')) return colors.primary;
    if (templateName.includes('Costas')) return colors.secondary;
    if (templateName.includes('Ombro')) return colors.warning;
    return colors.primary;
  };

  const loadTemplate = (template: any) => {
    setWorkoutName(template.name);
    setWorkoutDescription(template.description || '');
    const templateExercises = template.exercises.map((exercise: any, index: number) => ({
      name: exercise.name,
      sets: exercise.sets.toString(),
      reps: exercise.reps.toString(),
      weight: exercise.weight ? exercise.weight.toString() : '',
    }));
    setExercises(templateExercises);
  };

  const WorkoutTemplates = () => (
    <View style={styles.templatesSection}>
      <Text style={styles.sectionTitle}>Templates Rápidos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesScroll}>
        {workoutTemplates.map((template) => {
          const templateColor = getTemplateColor(template.name);
          const templateIcon = getTemplateIcon(template.name);
          
          return (
            <Pressable 
              key={template.id} 
              style={styles.templateCard}
              onPress={() => loadTemplate(template)}
            >
              <View style={[styles.templateIcon, { backgroundColor: templateColor + '20' }]}>
                <IconSymbol name={templateIcon as any} size={24} color={templateColor} />
              </View>
              <Text style={styles.templateName}>{template.name}</Text>
              <Text style={styles.templateExercises}>{template.exercises.length} exercícios</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );

  const ExerciseInput = ({ exercise, index }: { exercise: Exercise; index: number }) => (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseNumber}>Exercício {index + 1}</Text>
        {exercises.length > 1 && (
          <Pressable onPress={() => removeExercise(index)} style={styles.removeButton}>
            <IconSymbol name="trash" size={16} color={colors.error} />
          </Pressable>
        )}
      </View>
      
      <TextInput
        style={styles.exerciseNameInput}
        placeholder="Nome do exercício"
        placeholderTextColor={colors.textSecondary}
        value={exercise.name}
        onChangeText={(text) => updateExercise(index, 'name', text)}
      />
      
      <View style={styles.exerciseDetailsRow}>
        <View style={styles.exerciseDetailInput}>
          <Text style={styles.inputLabel}>Séries</Text>
          <TextInput
            style={styles.numberInput}
            placeholder="4"
            placeholderTextColor={colors.textSecondary}
            value={exercise.sets}
            onChangeText={(text) => updateExercise(index, 'sets', text)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.exerciseDetailInput}>
          <Text style={styles.inputLabel}>Reps</Text>
          <TextInput
            style={styles.numberInput}
            placeholder="12"
            placeholderTextColor={colors.textSecondary}
            value={exercise.reps}
            onChangeText={(text) => updateExercise(index, 'reps', text)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.exerciseDetailInput}>
          <Text style={styles.inputLabel}>Peso (kg)</Text>
          <TextInput
            style={styles.numberInput}
            placeholder="20"
            placeholderTextColor={colors.textSecondary}
            value={exercise.weight}
            onChangeText={(text) => updateExercise(index, 'weight', text)}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Novo Treino</Text>
        <Pressable onPress={saveWorkout} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Templates rápidos */}
        <WorkoutTemplates />

        {/* Informações básicas do treino */}
        <View style={styles.basicInfoSection}>
          <Text style={styles.sectionTitle}>Informações do Treino</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome do treino</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: Push Day - Peito e Tríceps"
              placeholderTextColor={colors.textSecondary}
              value={workoutName}
              onChangeText={setWorkoutName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Descrição (opcional)</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              placeholder="Descrição do treino..."
              placeholderTextColor={colors.textSecondary}
              value={workoutDescription}
              onChangeText={setWorkoutDescription}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Lista de exercícios */}
        <View style={styles.exercisesSection}>
          <View style={styles.exercisesSectionHeader}>
            <Text style={styles.sectionTitle}>Exercícios</Text>
            <Pressable onPress={addExercise} style={styles.addExerciseButton}>
              <IconSymbol name="plus.circle.fill" size={20} color={colors.primary} />
              <Text style={styles.addExerciseText}>Adicionar</Text>
            </Pressable>
          </View>

          {exercises.map((exercise, index) => (
            <ExerciseInput key={index} exercise={exercise} index={index} />
          ))}
        </View>

        {/* Botões de ação */}
        <View style={styles.actionButtons}>
          <Pressable style={[styles.actionButton, styles.secondaryButton]}>
            <IconSymbol name="square.and.arrow.down" size={20} color={colors.textSecondary} />
            <Text style={styles.secondaryButtonText}>Salvar como Template</Text>
          </Pressable>
          
          <Pressable onPress={saveWorkout} style={[styles.actionButton, styles.primaryButton]}>
            <IconSymbol name="checkmark.circle.fill" size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Criar Treino</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: colors.text,
  },
  saveButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: BorderRadius.md,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: Typography.fontWeights.semibold,
    fontSize: Typography.fontSizes.sm,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    color: colors.text,
    marginBottom: Spacing.md,
  },
  templatesSection: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  templatesScroll: {
    marginHorizontal: -Spacing.sm,
  },
  templateCard: {
    backgroundColor: colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 130,
    elevation: 4,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  templateIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  templateName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
    color: colors.text,
    marginBottom: 2,
    textAlign: 'center',
  },
  templateExercises: {
    fontSize: Typography.fontSizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  basicInfoSection: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    color: colors.text,
    marginBottom: Spacing.sm,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSizes.md,
    color: colors.text,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  exercisesSection: {
    padding: Spacing.md,
  },
  exercisesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  addExerciseText: {
    fontSize: Typography.fontSizes.sm,
    color: colors.primary,
    fontWeight: Typography.fontWeights.medium,
  },
  exerciseCard: {
    backgroundColor: colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 4,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  exerciseNumber: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    color: colors.text,
  },
  removeButton: {
    padding: Spacing.sm,
  },
  exerciseNameInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSizes.md,
    color: colors.text,
    marginBottom: Spacing.md,
  },
  exerciseDetailsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  exerciseDetailInput: {
    flex: 1,
  },
  numberInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSizes.md,
    color: colors.text,
    textAlign: 'center',
  },
  actionButtons: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: Typography.fontWeights.semibold,
    fontSize: Typography.fontSizes.md,
  },
  secondaryButtonText: {
    color: colors.textSecondary,
    fontWeight: Typography.fontWeights.medium,
    fontSize: Typography.fontSizes.md,
  },
});
