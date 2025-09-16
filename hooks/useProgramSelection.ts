import { StorageService } from '@/utils/storage';
import { useEffect, useState } from 'react';

export type ProgramType = 'pedro' | 'georgia' | null;

const SELECTED_PROGRAM_KEY = 'selected_program';

export const useProgramSelection = () => {
  const [selectedProgram, setSelectedProgram] = useState<ProgramType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSelectedProgram();
  }, []);

  const loadSelectedProgram = async () => {
    try {
      const saved = await StorageService.getItem(SELECTED_PROGRAM_KEY);
      if (saved) {
        setSelectedProgram(saved as ProgramType);
      }
    } catch (error) {
      console.error('Erro ao carregar programa selecionado:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectProgram = async (program: ProgramType) => {
    try {
      if (program) {
        await StorageService.setItem(SELECTED_PROGRAM_KEY, program);
      } else {
        await StorageService.removeItem(SELECTED_PROGRAM_KEY);
      }
      setSelectedProgram(program);
    } catch (error) {
      console.error('Erro ao salvar programa selecionado:', error);
    }
  };

  const clearSelection = async () => {
    await selectProgram(null);
  };

  return {
    selectedProgram,
    loading,
    selectProgram,
    clearSelection,
    isPedroProgram: selectedProgram === 'pedro',
    isGeorgiaProgram: selectedProgram === 'georgia',
    hasSelectedProgram: selectedProgram !== null,
  };
};