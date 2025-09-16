import { WorkoutSession } from './WorkoutContext';

// Estado global singleton para evitar reinicializações
let globalWorkoutSessions: WorkoutSession[] = [];
let globalCompletedWorkoutsCount: number = 0;
let isGlobalStateInitialized: boolean = false;

export const WorkoutStateManager = {
  // Getters
  getWorkoutSessions: (): WorkoutSession[] => globalWorkoutSessions,
  getCompletedWorkoutsCount: (): number => globalCompletedWorkoutsCount,
  isInitialized: (): boolean => isGlobalStateInitialized,

  // Setters
  setWorkoutSessions: (sessions: WorkoutSession[]) => {
    globalWorkoutSessions = [...sessions];
    console.log('🌍 Estado global atualizado - sessões:', sessions.length);
  },

  setCompletedWorkoutsCount: (count: number) => {
    globalCompletedWorkoutsCount = count;
    console.log('🌍 Estado global atualizado - contador:', count);
  },

  setInitialized: (initialized: boolean) => {
    isGlobalStateInitialized = initialized;
    console.log('🌍 Estado global inicializado:', initialized);
  },

  // Adicionar sessão
  addSession: (session: WorkoutSession) => {
    globalWorkoutSessions = [...globalWorkoutSessions, session];
    console.log('🌍 Sessão adicionada ao estado global:', session.id);
  },

  // Completar sessão
  completeSession: (sessionId: string, duration: number): boolean => {
    const sessionIndex = globalWorkoutSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      console.error('🌍 Sessão não encontrada no estado global:', sessionId);
      return false;
    }

    globalWorkoutSessions = globalWorkoutSessions.map(session => 
      session.id === sessionId 
        ? { ...session, completed: true, duration }
        : session
    );

    console.log('🌍 Sessão completada no estado global:', sessionId);
    return true;
  },

  // Incrementar contador
  incrementCounter: () => {
    globalCompletedWorkoutsCount++;
    console.log('🌍 Contador incrementado no estado global:', globalCompletedWorkoutsCount);
  },

  // Remover sessão
  removeSession: (sessionId: string): boolean => {
    const sessionToRemove = globalWorkoutSessions.find(s => s.id === sessionId);
    if (!sessionToRemove) return false;

    globalWorkoutSessions = globalWorkoutSessions.filter(s => s.id !== sessionId);
    
    if (sessionToRemove.completed) {
      globalCompletedWorkoutsCount = Math.max(0, globalCompletedWorkoutsCount - 1);
      console.log('🌍 Contador decrementado no estado global:', globalCompletedWorkoutsCount);
    }

    console.log('🌍 Sessão removida do estado global:', sessionId);
    return true;
  },

  // Reset completo
  reset: () => {
    globalWorkoutSessions = [];
    globalCompletedWorkoutsCount = 0;
    isGlobalStateInitialized = false;
    console.log('🌍 Estado global resetado');
  }
};