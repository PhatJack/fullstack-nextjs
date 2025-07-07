import bcrypt from "bcryptjs";

/**
 * Hash a password with bcrypt
 * @param password - The plain text password to hash
 * @param saltRounds - Number of salt rounds (default: 12)
 * @returns Promise<string> - The hashed password
 */
export async function hashPassword(password: string, saltRounds: number = 12): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare a password with its hash
 * @param password - The plain text password to compare
 * @param hash - The hashed password to compare against
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
