'use client';

import AppLayout from '@/components/AppLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useProfile } from '@/hooks/useProfile';
import { useWorkout } from '@/hooks/useWorkout';
import { useNutrition } from '@/hooks/useNutrition';
import { calculateProgress, calculateStreak } from '@/lib/utils';
import { useLiveQuery } from 'dexie-react-hooks';
import { logRepository } from '@/db/repositories/log.repository';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { profile } = useProfile();
  const { isWorkoutComplete, completedExercises, totalExercises } = useWorkout();
  const { waterProgress, completedMeals, totalMeals } = useNutrition();

  const completedDates = useLiveQuery(async () => {
    if (!profile) return [];
    const endDate = new Date().toISOString().split('T')[0];
    return await logRepository.getCompletedWorkoutDates(
      profile.programStartDate,
      endDate
    );
  }, [profile]);

  const progress = profile
    ? calculateProgress(profile.programStartDate, profile.programDurationDays)
    : null;

  const streak = calculateStreak(completedDates || []);

  if (!profile || !progress) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome back, {profile.name}!</h1>
          <p className="text-gray-400">{format(new Date(), 'EEEE, MMMM d')}</p>
        </div>

        {/* Program Progress */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Day {progress.currentDay}</h2>
              <p className="text-gray-400">of {profile.programDurationDays} days</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-cyan-400">
                {progress.percentComplete}%
              </div>
              <p className="text-sm text-gray-400">{progress.daysRemaining} days left</p>
            </div>
          </div>
          <ProgressBar value={progress.percentComplete} showLabel={false} />
        </GlassCard>

        {/* Streak */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Current Streak</h3>
              <p className="text-gray-400">Keep it going!</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-4xl">🔥</span>
              <span className="text-4xl font-bold text-orange-400">{streak}</span>
            </div>
          </div>
        </GlassCard>

        {/* Today's Summary */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Today's Progress</h3>

          {/* Workout Status */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">💪</span>
                <div>
                  <h4 className="font-semibold">Workout</h4>
                  <p className="text-sm text-gray-400">
                    {completedExercises} / {totalExercises} exercises
                  </p>
                </div>
              </div>
              {isWorkoutComplete && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                  ✓ Complete
                </span>
              )}
            </div>
            {totalExercises > 0 && (
              <ProgressBar
                value={(completedExercises / totalExercises) * 100}
                showLabel={false}
              />
            )}
          </GlassCard>

          {/* Nutrition Status */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🥗</span>
              <div>
                <h4 className="font-semibold">Nutrition</h4>
                <p className="text-sm text-gray-400">
                  {completedMeals} / {totalMeals} meals
                </p>
              </div>
            </div>
            <ProgressBar
              value={totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0}
              showLabel={false}
            />
          </GlassCard>

          {/* Water Status */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">💧</span>
              <div>
                <h4 className="font-semibold">Hydration</h4>
                <p className="text-sm text-gray-400">
                  {waterProgress.toFixed(0)}% of daily goal
                </p>
              </div>
            </div>
            <ProgressBar value={waterProgress} showLabel={false} />
          </GlassCard>
        </div>
      </div>
    </AppLayout>
  );
}
