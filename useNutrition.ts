'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { mealRepository } from '@/db/repositories/meal.repository';
import { logRepository } from '@/db/repositories/log.repository';
import { useProfile } from './useProfile';
import { getToday } from '@/lib/utils';

export function useNutrition() {
  const { profile } = useProfile();
  const meals = useLiveQuery(() => mealRepository.getAll(), []);
  
  const todaysLog = useLiveQuery(async () => {
    return await logRepository.getOrCreateNutritionLog(getToday());
  }, []);

  const addWater = async (amountML: number) => {
    await logRepository.addWater(getToday(), amountML);
  };

  const toggleMeal = async (mealId: string) => {
    await logRepository.toggleMeal(getToday(), mealId);
  };

  const updateExtraCalories = async (calories: number) => {
    if (!todaysLog) return;
    await logRepository.updateNutritionLog(todaysLog.id, {
      extraCalories: calories,
    });
  };

  // Calculate totals
  const waterProgress = profile && todaysLog
    ? Math.min((todaysLog.waterConsumedML / profile.waterGoalML) * 100, 100)
    : 0;

  const completedMeals = todaysLog?.mealsCompleted.length || 0;
  const totalMeals = meals?.length || 0;

  const totalMacros = meals?.reduce(
    (acc, meal) => {
      if (todaysLog?.mealsCompleted.includes(meal.id)) {
        return {
          calories: acc.calories + meal.calories,
          protein: acc.protein + meal.protein,
          carbs: acc.carbs + meal.carbs,
          fats: acc.fats + meal.fats,
        };
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  ) || { calories: 0, protein: 0, carbs: 0, fats: 0 };

  // Add extra calories
  totalMacros.calories += todaysLog?.extraCalories || 0;

  return {
    meals,
    todaysLog,
    waterProgress,
    completedMeals,
    totalMeals,
    totalMacros,
    addWater,
    toggleMeal,
    updateExtraCalories,
  };
}
