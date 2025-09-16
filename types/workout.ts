export interface Set {
  id: string;
  reps: number;
  weight?: number;
  completed: boolean;
  restTime?: number; // em segundos
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  targetSets: number;
  targetReps: number;
  lastWeight?: number; // último peso usado
  notes?: string;
  image?: any;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // em minutos
  completed: boolean;
  inProgress: boolean;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    notes?: string;
    image?: any;
  }[];
  category?: string;
}

export type WorkoutCategory = 
  | 'push' 
  | 'pull' 
  | 'legs' 
  | 'upper' 
  | 'lower' 
  | 'full-body' 
  | 'cardio' 
  | 'custom';