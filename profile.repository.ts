import { db } from '@/db/schema';
import type { Profile } from '@/lib/types';
import { generateId, getToday } from '@/lib/utils';

export class ProfileRepository {
  async get(): Promise<Profile | undefined> {
    const profiles = await db.profile.toArray();
    return profiles[0]; // Only one profile per user
  }

  async create(data: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<Profile> {
    const now = new Date().toISOString();
    const profile: Profile = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    await db.profile.add(profile);
    return profile;
  }

  async update(id: string, data: Partial<Profile>): Promise<void> {
    await db.profile.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async exists(): Promise<boolean> {
    const count = await db.profile.count();
    return count > 0;
  }
}

export const profileRepository = new ProfileRepository();
