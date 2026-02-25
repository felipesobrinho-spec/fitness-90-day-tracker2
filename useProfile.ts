'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { profileRepository } from '@/db/repositories/profile.repository';
import type { Profile } from '@/lib/types';

export function useProfile() {
  const profile = useLiveQuery(() => profileRepository.get());

  const updateProfile = async (data: Partial<Profile>) => {
    if (profile?.id) {
      await profileRepository.update(profile.id, data);
    }
  };

  return {
    profile,
    updateProfile,
    isLoading: profile === undefined,
  };
}
