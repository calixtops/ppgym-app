import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, Exercise } from '@/types/workout';

const WORKOUTS_KEY = '@ppgym:workouts';
const EXERCISE_WEIGHTS_KEY = '@ppgym:exercise_weights';

export interface ExerciseWeight {
  exerciseName: string;
  lastWeight: number;
  lastUpdated: Date;
}

export const useWorkoutStorage = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exerciseWeights, setExerciseWeights] = useState<Record<string, ExerciseWeight>>({});
  const [loading, setLoading] = useState(true);

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar treinos
      const workoutsData = await AsyncStorage.getItem(WORKOUTS_KEY);
      if (workoutsData) {
        const parsedWorkouts = JSON.parse(workoutsData);
        // Converter strings de data de volta para objetos Date
        const workoutsWithDates = parsedWorkouts.map((workout: any) => ({
          ...workout,
          createdAt: new Date(workout.createdAt),
          updatedAt: new Date(workout.updatedAt),
          startedAt: workout.startedAt ? new Date(workout.startedAt) : undefined,
          completedAt: workout.completedAt ? new Date(workout.completedAt) : undefined,
        }));
        setWorkouts(workoutsWithDates);
      }

      // Carregar pesos dos exercícios
      const weightsData = await AsyncStorage.getItem(EXERCISE_WEIGHTS_KEY);
      if (weightsData) {
        const parsedWeights = JSON.parse(weightsData);
        // Converter strings de data de volta para objetos Date
        const weightsWithDates = Object.keys(parsedWeights).reduce((acc, key) => {
          acc[key] = {
            ...parsedWeights[key],
            lastUpdated: new Date(parsedWeights[key].lastUpdated),
          };
          return acc;
        }, {} as Record<string, ExerciseWeight>);
        setExerciseWeights(weightsWithDates);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWorkouts = async (newWorkouts: Workout[]) => {
    try {
      await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(newWorkouts));
      setWorkouts(newWorkouts);
    } catch (error) {
      console.error('Erro ao salvar treinos:', error);
    }
  };

  const saveExerciseWeights = async (newWeights: Record<string, ExerciseWeight>) => {
    try {
      await AsyncStorage.setItem(EXERCISE_WEIGHTS_KEY, JSON.stringify(newWeights));
      setExerciseWeights(newWeights);
    } catch (error) {
      console.error('Erro ao salvar pesos:', error);
    }
  };

  const addWorkout = async (workout: Workout) => {
    const newWorkouts = [...workouts, workout];
    await saveWorkouts(newWorkouts);
  };

  const updateWorkout = async (updatedWorkout: Workout) => {
    const newWorkouts = workouts.map(w => 
      w.id === updatedWorkout.id ? updatedWorkout : w
    );
    await saveWorkouts(newWorkouts);

    // Atualizar pesos dos exercícios se houver mudanças
    const newWeights = { ...exerciseWeights };
    let weightsChanged = false;

    updatedWorkout.exercises.forEach(exercise => {
      if (exercise.lastWeight) {
        const key = exercise.name.toLowerCase();
        if (!newWeights[key] || newWeights[key].lastWeight !== exercise.lastWeight) {
          newWeights[key] = {
            exerciseName: exercise.name,
            lastWeight: exercise.lastWeight,
            lastUpdated: new Date(),
          };
          weightsChanged = true;
        }
      }
    });

    if (weightsChanged) {
      await saveExerciseWeights(newWeights);
    }
  };

  const deleteWorkout = async (workoutId: string) => {
    const newWorkouts = workouts.filter(w => w.id !== workoutId);
    await saveWorkouts(newWorkouts);
  };

  const getLastWeightForExercise = (exerciseName: string): number | undefined => {
    const key = exerciseName.toLowerCase();
    return exerciseWeights[key]?.lastWeight;
  };

  const updateExerciseWeight = async (exerciseName: string, weight: number) => {
    const key = exerciseName.toLowerCase();
    const newWeights = {
      ...exerciseWeights,
      [key]: {
        exerciseName,
        lastWeight: weight,
        lastUpdated: new Date(),
      },
    };
    await saveExerciseWeights(newWeights);
  };

  const getWorkoutStats = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const completedWorkouts = workouts.filter(w => w.completed);
    
    return {
      thisWeek: completedWorkouts.filter(w => w.completedAt && w.completedAt >= oneWeekAgo).length,
      thisMonth: completedWorkouts.filter(w => w.completedAt && w.completedAt >= oneMonthAgo).length,
      total: completedWorkouts.length,
    };
  };

  const getRecentWorkouts = (limit: number = 10) => {
    return [...workouts]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.multiRemove([WORKOUTS_KEY, EXERCISE_WEIGHTS_KEY]);
      setWorkouts([]);
      setExerciseWeights({});
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  };

  return {
    workouts,
    exerciseWeights,
    loading,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    getLastWeightForExercise,
    updateExerciseWeight,
    getWorkoutStats,
    getRecentWorkouts,
    clearAllData,
    refreshData: loadData,
  };
};