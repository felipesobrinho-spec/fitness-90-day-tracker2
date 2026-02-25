import { db } from '@/db/schema';
import type { Workout, Exercise } from '@/lib/types';
import { generateId } from '@/lib/utils';

export class WorkoutRepository {
  async getAll(): Promise<Workout[]> {
    return await db.workouts.toArray();
  }

  async getById(id: string): Promise<Workout | undefined> {
    return await db.workouts.get(id);
  }

  async getByDayOfWeek(dayOfWeek: number): Promise<Workout | undefined> {
    return await db.workouts.where('dayOfWeek').equals(dayOfWeek).first();
  }

  async create(data: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workout> {
    const now = new Date().toISOString();
    const workout: Workout = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    await db.workouts.add(workout);

    // Add exercises
    for (const exercise of data.exercises) {
      await this.addExercise(workout.id, exercise);
    }

    return workout;
  }

  async update(id: string, data: Partial<Workout>): Promise<void> {
    await db.workouts.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    await db.workouts.delete(id);
    // Delete associated exercises
    await db.exercises.where('workoutId').equals(id).delete();
  }

  async addExercise(
    workoutId: string,
    exercise: Omit<Exercise, 'id' | 'workoutId' | 'createdAt' | 'updatedAt'>
  ): Promise<Exercise> {
    const now = new Date().toISOString();
    const newExercise: Exercise = {
      ...exercise,
      id: generateId(),
      workoutId,
      createdAt: now,
      updatedAt: now,
    };
    await db.exercises.add(newExercise);
    return newExercise;
  }

  async getExercises(workoutId: string): Promise<Exercise[]> {
    return await db.exercises
      .where('workoutId')
      .equals(workoutId)
      .sortBy('order');
  }
}

export const workoutRepository = new WorkoutRepository();
