import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { workoutTemplates } from '../constants/workoutTemplates';
import { StorageService } from '../utils/storage';

// Interfaces necessárias (copiadas do hook original)
export interface WorkoutSession {
  id: string;
  workoutId: string;
  date: Date;
  exercises: {
    exerciseId: string;
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    completedSets: number[];
    notes?: string;
    image?: any;
  }[];
  completed: boolean;
  duration?: number; // em minutos
}

export interface WorkoutProgress {
  exerciseId: string;
  lastWeight?: number;
  personalRecord?: number;
  totalSessions: number;
}

export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  schedule: {
    [key: string]: string; // dia da semana -> template id
  };
  isActive: boolean;
}

export interface WorkoutSchedule {
  programId: string;
  currentWeek: number;
  startDate: Date;
  customSchedule?: {
    [key: string]: string; // data -> template id
  };
}

export interface WorkoutHistoryItem extends WorkoutSession {
  workoutName: string;
}

// Define a interface do contexto
interface WorkoutContextType {
  workoutSessions: WorkoutSession[];
  workoutProgress: { [key: string]: WorkoutProgress };
  workoutProgram: WorkoutProgram | null;
  workoutSchedule: WorkoutSchedule | null;
  completedWorkoutsCount: number;

  // Funções básicas
  startWorkoutSession: (workoutId: string) => Promise<WorkoutSession>;
  completeWorkout: (sessionId: string, duration: number) => Promise<void>;
  updateWorkoutProgress: (sessionId: string, exerciseId: string, setIndex: number, completed: boolean, weight?: number) => void;
  deleteWorkoutSession: (sessionId: string) => Promise<void>;
  getCurrentWorkoutTemplate_Simple: () => any;
  getNextWorkoutTemplate_Simple: () => any;
  clearAllData: () => Promise<void>;

  // Funções adicionais necessárias
  getTodaysWorkoutTemplate: () => any;
  isTodaysWorkoutCompleted: () => boolean;
  getNextWorkoutTemplate: () => any;
  getTomorrowsWorkoutTemplate: () => any;
  getStats: () => any;
  getWorkoutHistory: () => WorkoutHistoryItem[];
  getNextWorkoutTemplate_Simple_New: () => any;

  // Funções para compatibilidade com workout-detail
  completeSet: (sessionId: string, exerciseId: string, setIndex: number) => void;
  updateExerciseWeight: (sessionId: string, exerciseId: string, weight: number) => void;

  // Sistema de programas
  selectedProgram: 'pedro' | 'georgia' | null;
  switchProgram: (program: 'pedro' | 'georgia') => Promise<void>;
  getCurrentWorkoutOrder: () => string[];

  // Compatibilidade
  currentWorkoutIndex: number;
}

// Cria o contexto
const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Hook para usar o contexto
export const useWorkoutRotation = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkoutRotation deve ser usado dentro de um WorkoutProvider');
  }
  return context;
};

// Provider do contexto
export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [workoutProgress, setWorkoutProgress] = useState<{ [key: string]: WorkoutProgress }>({});
  const [workoutProgram, setWorkoutProgram] = useState<WorkoutProgram | null>(null);
  const [workoutSchedule, setWorkoutSchedule] = useState<WorkoutSchedule | null>(null);
  const [completedWorkoutsCount, setCompletedWorkoutsCount] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState<'pedro' | 'georgia' | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultWorkoutProgram: WorkoutProgram = {
    id: 'default-program',
    name: 'Programa Padrão',
    description: 'Rotação A-B-C-D-E',
    schedule: {},
    isActive: true
  };

  // Diferentes programas de treino
  const PEDRO_WORKOUT_ORDER = ['template-a', 'template-b', 'template-c', 'template-d', 'template-e'];
  const GEORGIA_WORKOUT_ORDER = ['georgia-template-a', 'georgia-template-b', 'georgia-template-c', 'georgia-template-d'];
  
  // Função para obter a ordem atual baseada no programa selecionado
  const getCurrentWorkoutOrder = (): string[] => {
    if (!selectedProgram) return [];
    return selectedProgram === 'pedro' ? PEDRO_WORKOUT_ORDER : GEORGIA_WORKOUT_ORDER;
  };

  // Função para trocar o programa
  const switchProgram = async (program: 'pedro' | 'georgia'): Promise<void> => {
    setSelectedProgram(program);
    // Salvar preferência no storage
    await StorageService.saveSelectedProgram(program);
    // Resetar contador para começar do início do novo programa
    setCompletedWorkoutsCount(0);
    await StorageService.saveCompletedWorkoutsCount(0);
  };

  // Carregamento inicial dos dados
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [sessions, progress, program, schedule, count, selectedProg] = await Promise.all([
          StorageService.loadWorkoutSessions(),
          StorageService.loadWorkoutProgress(),
          StorageService.loadWorkoutProgram(),
          StorageService.loadWorkoutSchedule(),
          StorageService.loadCompletedWorkoutsCount(),
          StorageService.loadSelectedProgram(),
        ]);
        
        setWorkoutSessions(sessions || []);
        setWorkoutProgress(progress || {});
        setWorkoutProgram(program || defaultWorkoutProgram);
        setWorkoutSchedule(schedule || null);
        setCompletedWorkoutsCount(count || 0);
        setSelectedProgram(selectedProg || null);
        setIsInitialized(true);
      } catch (error) {
        console.error('❌ Erro no carregamento inicial do contexto:', error);
        setWorkoutSessions([]);
        setWorkoutProgress({});
        setWorkoutProgram(defaultWorkoutProgram);
        setWorkoutSchedule(null);
        setCompletedWorkoutsCount(0);
        setSelectedProgram(null);
        setIsInitialized(true);
      }
    };

    loadInitialData();
  }, []);

  // Salvar sessões quando mudarem
  useEffect(() => {
    if (isInitialized && workoutSessions.length >= 0) {
      StorageService.saveWorkoutSessions(workoutSessions);
    }
  }, [workoutSessions, isInitialized]);

  // Salvar progresso quando mudar
  useEffect(() => {
    if (isInitialized && Object.keys(workoutProgress).length > 0) {
      StorageService.saveWorkoutProgress(workoutProgress);
    }
  }, [workoutProgress, isInitialized]);

  // Funções do contexto
  const startWorkoutSession = async (workoutId: string): Promise<WorkoutSession> => {
    // Clean the workoutId to handle any potential serialization issues
    const cleanWorkoutId = String(workoutId).trim();

    if (!cleanWorkoutId || cleanWorkoutId === '[object Object]') {
      throw new Error(`ID do treino inválido: ${cleanWorkoutId}`);
    }

    const template = workoutTemplates.find(t => t.id === cleanWorkoutId);
    if (!template) {
      const availableIds = workoutTemplates.map(t => t.id);
      throw new Error(`Template não encontrado para ID: ${cleanWorkoutId}. IDs disponíveis: ${availableIds.join(', ')}`);
    }

    const sessionId = `session-${Date.now()}`;

    const session: WorkoutSession = {
      id: sessionId,
      workoutId: cleanWorkoutId,
      date: new Date(),
      exercises: template.exercises.map(exercise => ({
        exerciseId: `exercise-${Date.now()}-${Math.random()}`,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight || 0,
        notes: exercise.notes,
        image: exercise.image,
        completedSets: Array(exercise.sets).fill(0)
      })),
      completed: false
    };

    setWorkoutSessions(prev => [...prev, session]);
    return session;
  };

  const completeWorkout = async (sessionId: string, duration: number): Promise<void> => {
    const sessionExists = workoutSessions.find(s => s.id === sessionId);
    if (!sessionExists) {
      console.error('Sessão não encontrada:', sessionId);
      return;
    }

    setWorkoutSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, completed: true, duration }
          : session
      )
    );

    // Incrementa contador
    const newCount = completedWorkoutsCount + 1;
    setCompletedWorkoutsCount(newCount);

    // Salva contador
    await StorageService.saveCompletedWorkoutsCount(newCount);
  };

  const updateWorkoutProgress = (sessionId: string, exerciseId: string, setIndex: number, completed: boolean, weight?: number) => {
    setWorkoutSessions(prev =>
      prev.map(session => {
        if (session.id !== sessionId) return session;

        return {
          ...session,
          exercises: session.exercises.map(exercise => {
            if (exercise.exerciseId !== exerciseId) return exercise;

            const newCompletedSets = [...exercise.completedSets];
            newCompletedSets[setIndex] = completed ? 1 : 0;

            return {
              ...exercise,
              completedSets: newCompletedSets,
              weight: weight !== undefined ? weight : exercise.weight
            };
          })
        };
      })
    );
  };

  const deleteWorkoutSession = async (sessionId: string): Promise<void> => {
    const sessionToDelete = workoutSessions.find(s => s.id === sessionId);
    if (!sessionToDelete) return;

    setWorkoutSessions(prev => prev.filter(s => s.id !== sessionId));
    
    if (sessionToDelete.completed) {
      const newCount = Math.max(0, completedWorkoutsCount - 1);
      setCompletedWorkoutsCount(newCount);
      await StorageService.saveCompletedWorkoutsCount(newCount);
    }
  };

  const getCurrentWorkoutTemplate_Simple = () => {
    const workoutOrder = getCurrentWorkoutOrder();
    if (workoutOrder.length === 0) return null;
    const index = completedWorkoutsCount % workoutOrder.length;
    const workoutId = workoutOrder[index];
    return workoutTemplates.find(t => t.id === workoutId);
  };

  const getNextWorkoutTemplate_Simple = () => {
    const workoutOrder = getCurrentWorkoutOrder();
    if (workoutOrder.length === 0) return null;
    const nextIndex = (completedWorkoutsCount + 1) % workoutOrder.length;
    const nextWorkoutId = workoutOrder[nextIndex];
    return workoutTemplates.find(t => t.id === nextWorkoutId);
  };

  const getTodaysWorkoutTemplate = () => {
    // Rotação simples baseada no contador
    return getCurrentWorkoutTemplate_Simple();
  };

  const isTodaysWorkoutCompleted = (): boolean => {
    const today = new Date();

    return workoutSessions.some(session => {
      const sessionDate = new Date(session.date);
      const isToday = sessionDate.toDateString() === today.toDateString();
      return isToday && session.completed;
    });
  };

  const getNextWorkoutTemplate = () => {
    if (isTodaysWorkoutCompleted()) {
      // Se hoje foi completado, retorna o próximo da rotação
      return getNextWorkoutTemplate_Simple();
    }
    // Senão, retorna o atual
    return getCurrentWorkoutTemplate_Simple();
  };

  const getTomorrowsWorkoutTemplate = () => {
    return getNextWorkoutTemplate_Simple();
  };

  const getStats = () => {
    const totalWorkouts = workoutSessions.filter(s => s.completed).length;
    const thisWeekWorkouts = workoutSessions.filter(s => {
      const sessionDate = new Date(s.date);
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      return s.completed && sessionDate >= startOfWeek;
    }).length;

    return {
      totalWorkouts,
      thisWeekWorkouts,
      workoutStreak: 0, // simplificado
      averageWorkoutsPerWeek: totalWorkouts
    };
  };

  const getWorkoutHistory = (): WorkoutHistoryItem[] => {
    return workoutSessions
      .filter(session => session.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(session => ({
        ...session,
        workoutName: workoutTemplates.find(t => t.id === session.workoutId)?.name || session.workoutId
      }));
  };

  const getNextWorkoutTemplate_Simple_New = () => {
    return getNextWorkoutTemplate_Simple();
  };

  const clearAllData = async () => {
    await StorageService.clearAllData();
    setWorkoutSessions([]);
    setWorkoutProgress({});
    setWorkoutProgram(defaultWorkoutProgram);
    setWorkoutSchedule(null);
    setCompletedWorkoutsCount(0);
  };

  // Funções de compatibilidade para workout-detail
  const completeSet = (sessionId: string, exerciseId: string, setIndex: number) => {
    updateWorkoutProgress(sessionId, exerciseId, setIndex, true);
  };

  const updateExerciseWeight = (sessionId: string, exerciseId: string, weight: number) => {
    setWorkoutSessions(prev =>
      prev.map(session => {
        if (session.id !== sessionId) return session;

        return {
          ...session,
          exercises: session.exercises.map(exercise => {
            if (exercise.exerciseId !== exerciseId) return exercise;

            return {
              ...exercise,
              weight: weight
            };
          })
        };
      })
    );
  };

  const value: WorkoutContextType = {
    workoutSessions,
    workoutProgress,
    workoutProgram,
    workoutSchedule,
    completedWorkoutsCount,
    selectedProgram,
    startWorkoutSession,
    completeWorkout,
    updateWorkoutProgress,
    deleteWorkoutSession,
    getCurrentWorkoutTemplate_Simple,
    getNextWorkoutTemplate_Simple,
    switchProgram,
    getCurrentWorkoutOrder,
    clearAllData,
    getTodaysWorkoutTemplate,
    isTodaysWorkoutCompleted,
    getNextWorkoutTemplate,
    getTomorrowsWorkoutTemplate,
    getStats,
    getWorkoutHistory,
    getNextWorkoutTemplate_Simple_New,
    completeSet,
    updateExerciseWeight,
    currentWorkoutIndex: 0, // valor dummy para compatibilidade
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};