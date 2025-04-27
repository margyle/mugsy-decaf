import { db } from '../../db';
import { users, User, NewUser as _NewUser } from '../../db/schema/users';
import { eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // High work factor for better security

/**
 * Hash a password using bcrypt
 * @param password The plain-text password to hash
 * @returns The hashed password
 */
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a stored hash
 * @param password The plain-text password to verify
 * @param hash The stored password hash
 * @returns True if the password matches, false otherwise
 */
async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function registerUser(userData: {
  username: string;
  password: string;
}): Promise<User> {
  const user = {
    username: userData.username,
    password: await hashPassword(userData.password),
  };

  const result = await db.insert(users).values(user).returning();
  return result[0];
}

export async function authenticateUser(
  fastify: FastifyInstance,
  email: string,
  password: string,
): Promise<{ user: User; token: string } | null> {
  const result = await db.select().from(users).where(eq(users.username, email));

  const user = result[0];

  if (!user) {
    return null;
  }

  const passwordValid = await verifyPassword(password, user.password);

  if (!passwordValid) {
    return null;
  }

  const token = fastify.jwt.sign({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  return {
    user: {
      ...user,
      password: '[REDACTED]',
    } as User,
    token,
  };
}
