'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { workoutRepository } from '@/db/repositories/workout.repository';
import { logRepository } from '@/db/repositories/log.repository';
import type { Workout, DailyWorkoutLog } from '@/lib/types';
import { getToday, getDayOfWeek } from '@/lib/utils';

export function useWorkout() {
  const workouts = useLiveQuery(() => workoutRepository.getAll(), []);

  const getTodaysWorkout = (): Workout | undefined => {
    if (!workouts) return undefined;
    const today = new Date();
    const dayOfWeek = getDayOfWeek(today);
    return workouts.find(w => w.dayOfWeek === dayOfWeek);
  };

  const todaysWorkout = getTodaysWorkout();

  // Get today's workout log
  const todaysLog = useLiveQuery(async () => {
    const today = getToday();
    let log = await logRepository.getWorkoutLog(today);
    
    // If no log exists and there's a workout today, create one
    if (!log && todaysWorkout) {
      const exercises = await workoutRepository.getExercises(todaysWorkout.id);
      log = await logRepository.createWorkoutLog({
        date: today,
        workoutId: todaysWorkout.id,
        completed: false,
        exercises: exercises.map(e => ({
          exerciseId: e.id,
          completed: false,
        })),
      });
    }
    
    return log;
  }, [todaysWorkout?.id]);

  const toggleExercise = async (exerciseId: string) => {
    if (!todaysLog) return;
    
    const exercises = todaysLog.exercises.map(e =>
      e.exerciseId === exerciseId
        ? { ...e, completed: !e.completed, completedAt: !e.completed ? new Date().toISOString() : undefined }
        : e
    );
    
    await logRepository.updateWorkoutLog(todaysLog.id, { exercises });
  };

  const completeWorkout = async () => {
    if (!todaysLog) return;
    
    await logRepository.updateWorkoutLog(todaysLog.id, {
      completed: true,
      completedAt: new Date().toISOString(),
    });
  };

  const isWorkoutComplete = todaysLog?.completed || false;
  const completedExercises = todaysLog?.exercises.filter(e => e.completed).length || 0;
  const totalExercises = todaysLog?.exercises.length || 0;

  return {
    workouts,
    todaysWorkout,
    todaysLog,
    isWorkoutComplete,
    completedExercises,
    totalExercises,
    toggleExercise,
    completeWorkout,
  };
}
