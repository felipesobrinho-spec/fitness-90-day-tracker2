// Web Crypto API utilities for PIN hashing and authentication

/**
 * Generate a random salt for password hashing
 */
export async function generateSalt(): Promise<string> {
  const saltBuffer = new Uint8Array(16);
  crypto.getRandomValues(saltBuffer);
  return bufferToHex(saltBuffer);
}

/**
 * Hash a PIN with a salt using PBKDF2
 */
export async function hashPin(pin: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const pinBuffer = encoder.encode(pin);
  const saltBuffer = hexToBuffer(salt);

  // Import the PIN as a key
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    pinBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  // Derive bits using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  return bufferToHex(new Uint8Array(derivedBits));
}

/**
 * Verify a PIN against stored hash and salt
 */
export async function verifyPin(
  pin: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  const computedHash = await hashPin(pin, salt);
  return computedHash === storedHash;
}

/**
 * Generate a random session token
 */
export function generateSessionToken(): string {
  const tokenBuffer = new Uint8Array(32);
  crypto.getRandomValues(tokenBuffer);
  return bufferToHex(tokenBuffer);
}

// Helper functions
function bufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}
