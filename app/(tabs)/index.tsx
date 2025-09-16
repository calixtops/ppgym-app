import { ProgramSelector } from '@/components/ProgramSelector';
import UnifiedHomeScreen from '@/components/UnifiedHomeScreen';
import { useWorkoutRotation } from '@/hooks/WorkoutContext';

export default function HomeScreen() {
  const { selectedProgram } = useWorkoutRotation();
  
  // Se nenhum programa foi selecionado, mostra o seletor de programa
  if (!selectedProgram) {
    return <ProgramSelector />;
  }
  
  // Retorna a tela unificada que se adapta ao programa selecionado
  return <UnifiedHomeScreen />;
}