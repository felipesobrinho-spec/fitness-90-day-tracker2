import { db } from '@/db/schema';
import type {
  DailyWorkoutLog,
  DailyNutritionLog,
  WeightLog,
  CompletedExercise,
} from '@/lib/types';
import { generateId, getToday } from '@/lib/utils';

export class LogRepository {
  // ===== Workout Logs =====
  async getWorkoutLog(date: string): Promise<DailyWorkoutLog | undefined> {
    return await db.dailyWorkoutLogs.where('date').equals(date).first();
  }

  async createWorkoutLog(
    data: Omit<DailyWorkoutLog, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<DailyWorkoutLog> {
    const now = new Date().toISOString();
    const log: DailyWorkoutLog = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    await db.dailyWorkoutLogs.add(log);
    return log;
  }

  async updateWorkoutLog(id: string, data: Partial<DailyWorkoutLog>): Promise<void> {
    await db.dailyWorkoutLogs.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async completeWorkout(date: string, workoutId: string): Promise<void> {
    const log = await this.getWorkoutLog(date);
    if (log) {
      await this.updateWorkoutLog(log.id, {
        completed: true,
        completedAt: new Date().toISOString(),
      });
    }
  }

  async getWorkoutLogsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<DailyWorkoutLog[]> {
    return await db.dailyWorkoutLogs
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
  }

  // ===== Nutrition Logs =====
  async getNutritionLog(date: string): Promise<DailyNutritionLog | undefined> {
    return await db.dailyNutritionLogs.where('date').equals(date).first();
  }

  async getOrCreateNutritionLog(date: string): Promise<DailyNutritionLog> {
    let log = await this.getNutritionLog(date);
    if (!log) {
      log = await this.createNutritionLog({
        date,
        waterConsumedML: 0,
        mealsCompleted: [],
        extraCalories: 0,
      });
    }
    return log;
  }

  async createNutritionLog(
    data: Omit<DailyNutritionLog, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<DailyNutritionLog> {
    const now = new Date().toISOString();
    const log: DailyNutritionLog = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    await db.dailyNutritionLogs.add(log);
    return log;
  }

  async updateNutritionLog(
    id: string,
    data: Partial<DailyNutritionLog>
  ): Promise<void> {
    await db.dailyNutritionLogs.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async addWater(date: string, amountML: number): Promise<void> {
    const log = await this.getOrCreateNutritionLog(date);
    await this.updateNutritionLog(log.id, {
      waterConsumedML: log.waterConsumedML + amountML,
    });
  }

  async toggleMeal(date: string, mealId: string): Promise<void> {
    const log = await this.getOrCreateNutritionLog(date);
    const mealsCompleted = log.mealsCompleted.includes(mealId)
      ? log.mealsCompleted.filter(id => id !== mealId)
      : [...log.mealsCompleted, mealId];
    await this.updateNutritionLog(log.id, { mealsCompleted });
  }

  // ===== Weight Logs =====
  async getAllWeightLogs(): Promise<WeightLog[]> {
    return await db.weightLogs.orderBy('date').toArray();
  }

  async getLatestWeightLog(): Promise<WeightLog | undefined> {
    return await db.weightLogs.orderBy('date').reverse().first();
  }

  async createWeightLog(
    data: Omit<WeightLog, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<WeightLog> {
    const now = new Date().toISOString();
    const log: WeightLog = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    await db.weightLogs.add(log);
    return log;
  }

  async deleteWeightLog(id: string): Promise<void> {
    await db.weightLogs.delete(id);
  }

  // ===== Stats =====
  async getCompletedWorkoutDates(
    startDate: string,
    endDate: string
  ): Promise<string[]> {
    const logs = await db.dailyWorkoutLogs
      .where('date')
      .between(startDate, endDate, true, true)
      .and(log => log.completed)
      .toArray();
    return logs.map(log => log.date);
  }
}

export const logRepository = new LogRepository();
