import { db } from '@/db/schema';
import type { AuthCredentials } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { hashPin, generateSalt, verifyPin } from '@/lib/crypto';

export class AuthRepository {
  async hasCredentials(): Promise<boolean> {
    const count = await db.authCredentials.count();
    return count > 0;
  }

  async createCredentials(pin: string): Promise<void> {
    const salt = await generateSalt();
    const pinHash = await hashPin(pin, salt);
    
    const credentials: AuthCredentials = {
      id: generateId(),
      pinHash,
      salt,
      createdAt: new Date().toISOString(),
    };
    
    await db.authCredentials.clear(); // Only one credential set
    await db.authCredentials.add(credentials);
  }

  async verifyCredentials(pin: string): Promise<boolean> {
    const credentials = await db.authCredentials.toArray();
    if (credentials.length === 0) return false;
    
    const { pinHash, salt } = credentials[0];
    return await verifyPin(pin, pinHash, salt);
  }

  async updatePin(oldPin: string, newPin: string): Promise<boolean> {
    const isValid = await this.verifyCredentials(oldPin);
    if (!isValid) return false;
    
    await this.createCredentials(newPin);
    return true;
  }
}

export const authRepository = new AuthRepository();
