'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { logRepository } from '@/db/repositories/log.repository';
import type { WeightLog } from '@/lib/types';
import { getToday } from '@/lib/utils';

export function useWeightLogs() {
  const weightLogs = useLiveQuery(() => logRepository.getAllWeightLogs(), []);
  const latestWeight = useLiveQuery(() => logRepository.getLatestWeightLog(), []);

  const addWeightLog = async (weight: number, date?: string) => {
    await logRepository.createWeightLog({
      date: date || getToday(),
      weight,
    });
  };

  const deleteWeightLog = async (id: string) => {
    await logRepository.deleteWeightLog(id);
  };

  return {
    weightLogs: weightLogs || [],
    latestWeight,
    addWeightLog,
    deleteWeightLog,
  };
}
