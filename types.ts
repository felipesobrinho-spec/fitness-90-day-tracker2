// Core TypeScript interfaces for the Fitness PWA

export interface Profile {
  id: string;
  name: string;
  weight: number;
  goalWeight: number;
  height: number; // cm
  age: number;
  gender: 'male' | 'female' | 'other';
  programStartDate: string; // ISO date
  programDurationDays: number;
  waterGoalML: number;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  workoutId: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restSeconds: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Workout {
  id: string;
  name: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export interface MealTemplate {
  id: string;
  name: string;
  timeOfDay: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompletedExercise {
  exerciseId: string;
  completed: boolean;
  completedAt?: string;
}

export interface DailyWorkoutLog {
  id: string;
  date: string; // YYYY-MM-DD
  workoutId: string;
  completed: boolean;
  completedAt?: string;
  exercises: CompletedExercise[];
  createdAt: string;
  updatedAt: string;
}

export interface DailyNutritionLog {
  id: string;
  date: string; // YYYY-MM-DD
  waterConsumedML: number;
  mealsCompleted: string[]; // Array of MealTemplate IDs
  extraCalories: number;
  createdAt: string;
  updatedAt: string;
}

export interface WeightLog {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number;
  createdAt: string;
  updatedAt: string;
}

export interface SyncEvent {
  id: string;
  eventType: string; // 'workout_confirmed', 'meal_checked', etc.
  entityType: string; // 'workout', 'nutrition', 'weight'
  entityId: string;
  payload: any;
  status: 'pending' | 'synced' | 'failed';
  createdAt: string;
  syncedAt?: string;
}

export interface AuthCredentials {
  id: string;
  pinHash: string;
  salt: string;
  createdAt: string;
}

export interface SessionData {
  token: string;
  expiresAt: number;
}
