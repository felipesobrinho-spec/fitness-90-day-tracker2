import { db } from '@/db/schema';
import type { MealTemplate } from '@/lib/types';
import { generateId } from '@/lib/utils';

export class MealRepository {
  async getAll(): Promise<MealTemplate[]> {
    return await db.mealTemplates.toArray();
  }

  async getById(id: string): Promise<MealTemplate | undefined> {
    return await db.mealTemplates.get(id);
  }

  async getByTimeOfDay(timeOfDay: string): Promise<MealTemplate[]> {
    return await db.mealTemplates.where('timeOfDay').equals(timeOfDay).toArray();
  }

  async create(
    data: Omit<MealTemplate, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<MealTemplate> {
    const now = new Date().toISOString();
    const meal: MealTemplate = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    await db.mealTemplates.add(meal);
    return meal;
  }

  async update(id: string, data: Partial<MealTemplate>): Promise<void> {
    await db.mealTemplates.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    await db.mealTemplates.delete(id);
  }

  async bulkCreate(meals: Omit<MealTemplate, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<MealTemplate[]> {
    const now = new Date().toISOString();
    const newMeals: MealTemplate[] = meals.map(meal => ({
      ...meal,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }));
    await db.mealTemplates.bulkAdd(newMeals);
    return newMeals;
  }
}

export const mealRepository = new MealRepository();
