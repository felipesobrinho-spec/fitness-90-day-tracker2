import Dexie, { type EntityTable } from 'dexie';
import type {
  Profile,
  Workout,
  Exercise,
  MealTemplate,
  DailyWorkoutLog,
  DailyNutritionLog,
  WeightLog,
  SyncEvent,
  AuthCredentials,
} from '@/lib/types';

// Dexie database schema - IndexedDB as source of truth
class FitnessDatabase extends Dexie {
  // Declare tables
  profile!: EntityTable<Profile, 'id'>;
  workouts!: EntityTable<Workout, 'id'>;
  exercises!: EntityTable<Exercise, 'id'>;
  mealTemplates!: EntityTable<MealTemplate, 'id'>;
  dailyWorkoutLogs!: EntityTable<DailyWorkoutLog, 'id'>;
  dailyNutritionLogs!: EntityTable<DailyNutritionLog, 'id'>;
  weightLogs!: EntityTable<WeightLog, 'id'>;
  syncEvents!: EntityTable<SyncEvent, 'id'>;
  authCredentials!: EntityTable<AuthCredentials, 'id'>;

  constructor() {
    super('FitnessDB');
    
    this.version(1).stores({
      profile: 'id',
      workouts: 'id, dayOfWeek',
      exercises: 'id, workoutId, order',
      mealTemplates: 'id, timeOfDay',
      dailyWorkoutLogs: 'id, date, workoutId',
      dailyNutritionLogs: 'id, date',
      weightLogs: 'id, date',
      syncEvents: 'id, status, createdAt',
      authCredentials: 'id',
    });
  }
}

// Singleton instance
export const db = new FitnessDatabase();
