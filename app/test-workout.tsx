import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TestScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colors);
  
  // Estados para teste das funcionalidades
  const [setsCompleted, setSetsCompleted] = useState([false, false, false, false]);
  const [weights, setWeights] = useState(['20', '22.5', '25', '27.5']);
  const [tempWeight, setTempWeight] = useState('');
  const [editingSet, setEditingSet] = useState<number | null>(null);

  const toggleSet = (index: number) => {
    const newSets = [...setsCompleted];
    newSets[index] = !newSets[index];
    setSetsCompleted(newSets);
    console.log(`Série ${index + 1} ${newSets[index] ? 'marcada' : 'desmarcada'}`);
  };

  const updateWeight = (index: number, newWeight: string) => {
    if (newWeight && !isNaN(parseFloat(newWeight))) {
      const newWeights = [...weights];
      newWeights[index] = newWeight;
      setWeights(newWeights);
      setEditingSet(null);
      setTempWeight('');
      Alert.alert('Sucesso', `Peso da série ${index + 1} atualizado para ${newWeight}kg`);
    } else {
      Alert.alert('Erro', 'Digite um peso válido');
    }
  };

  const startWeightEdit = (index: number) => {
    setEditingSet(index);
    setTempWeight(weights[index]);
  };

  const cancelWeightEdit = () => {
    setEditingSet(null);
    setTempWeight('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>🧪 Teste de Funcionalidades</Text>
          <Text style={styles.subtitle}>Teste os checkboxes e edição de peso</Text>
        </View>

        <Card title="💪 Supino Reto - Teste de Séries" style={styles.card}>
          <Text style={styles.description}>
            Clique nos checkboxes para marcar as séries como concluídas:
          </Text>
          
          <View style={styles.exerciseContainer}>
            {setsCompleted.map((completed, index) => (
              <View key={index} style={[
                styles.setRow,
                completed && styles.setRowCompleted
              ]}>
                <View style={styles.setInfo}>
                  <Text style={[styles.setLabel, completed && styles.completedText]}>
                    Série {index + 1}
                  </Text>
                  <Text style={[styles.setDetails, completed && styles.completedText]}>
                    12 reps • {weights[index]}kg
                  </Text>
                </View>
                
                <View style={styles.setActions}>
                  <Pressable 
                    onPress={() => startWeightEdit(index)}
                    style={styles.weightButton}
                  >
                    <IconSymbol name="scalemass" size={14} color={colors.primary} />
                    <Text style={styles.weightButtonText}>
                      {weights[index]}kg
                    </Text>
                  </Pressable>
                  
                  <Checkbox
                    checked={completed}
                    onPress={() => toggleSet(index)}
                    size="medium"
                  />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              Progresso: {setsCompleted.filter(Boolean).length}/4 séries concluídas
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(setsCompleted.filter(Boolean).length / 4) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </Card>

        {editingSet !== null && (
          <Card title="⚖️ Editar Peso" style={styles.card}>
            <Text style={styles.description}>
              Editando peso da Série {editingSet + 1}:
            </Text>
            
            <Input
              label="Novo peso (kg)"
              value={tempWeight}
              onChangeText={setTempWeight}
              placeholder="Ex: 22.5"
              keyboardType="numeric"
            />
            
            <View style={styles.buttonRow}>
              <Button
                title="Cancelar"
                onPress={cancelWeightEdit}
                variant="outline"
                style={styles.button}
              />
              <Button
                title="Salvar"
                onPress={() => updateWeight(editingSet, tempWeight)}
                variant="primary"
                style={styles.button}
              />
            </View>
          </Card>
        )}

        <Card title="📊 Status do Teste" style={styles.card}>
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Checkbox funcionando:</Text>
              <Text style={[styles.statusValue, { color: colors.success }]}>
                ✅ {setsCompleted.filter(Boolean).length > 0 ? 'SIM' : 'Teste clicando nos checkboxes'}
              </Text>
            </View>
            
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Edição de peso:</Text>
              <Text style={[styles.statusValue, { color: colors.success }]}>
                ✅ {editingSet !== null ? 'Modal aberto' : 'Clique no botão de peso'}
              </Text>
            </View>
            
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Persistência:</Text>
              <Text style={[styles.statusValue, { color: colors.primary }]}>
                💾 Dados mantidos durante a sessão
              </Text>
            </View>
          </View>
        </Card>

        <Card title="🎯 Instruções de Teste" style={styles.card}>
          <View style={styles.instructions}>
            <Text style={styles.instruction}>1. ✅ Clique nos checkboxes para marcar séries</Text>
            <Text style={styles.instruction}>2. ⚖️ Clique nos botões de peso para editar</Text>
            <Text style={styles.instruction}>3. 💾 Digite um novo peso e clique em "Salvar"</Text>
            <Text style={styles.instruction}>4. 📊 Observe o feedback visual nas séries</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  header: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.fontSizes.md,
    color: colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: Typography.lineHeights.md,
  },
  exerciseContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  setRowCompleted: {
    backgroundColor: colors.success + '10',
    borderColor: colors.success,
  },
  setInfo: {
    flex: 1,
  },
  setLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    color: colors.text,
  },
  setDetails: {
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  completedText: {
    color: colors.success,
    textDecorationLine: 'line-through',
  },
  setActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  weightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    backgroundColor: colors.primary + '20',
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  weightButtonText: {
    fontSize: Typography.fontSizes.xs,
    color: colors.primary,
    fontWeight: Typography.fontWeights.medium,
  },
  progressInfo: {
    marginTop: Spacing.md,
  },
  progressText: {
    fontSize: Typography.fontSizes.sm,
    color: colors.text,
    fontWeight: Typography.fontWeights.medium,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: BorderRadius.full,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: BorderRadius.full,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  button: {
    flex: 1,
  },
  statusContainer: {
    gap: Spacing.sm,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: Typography.fontSizes.sm,
    color: colors.text,
  },
  statusValue: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
  },
  instructions: {
    gap: Spacing.sm,
  },
  instruction: {
    fontSize: Typography.fontSizes.sm,
    color: colors.text,
    lineHeight: Typography.lineHeights.sm,
  },
});