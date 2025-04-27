import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../db';
import { users, User } from '../../db/schema/users';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // High work factor for better security

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
}

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

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply,
) {
  const { username, password } = request.body;

  // Find user by username
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  const user = result[0];

  if (!user) {
    return reply.code(401).send({ error: 'Invalid username or password' });
  }

  // Verify password
  const passwordValid = await verifyPassword(password, user.password);
  if (!passwordValid) {
    return reply.code(401).send({ error: 'Invalid username or password' });
  }

  // Generate JWT token
  const token = request.server.jwt.sign({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  // Return user data and token
  return reply.code(200).send({
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    token,
  });
}

export async function registerHandler(
  request: FastifyRequest<{ Body: RegisterRequest }>,
  reply: FastifyReply,
) {
  try {
    // Hash password
    const hashedPassword = await hashPassword(request.body.password);

    // Insert user to database
    const userData = {
      username: request.body.username,
      password: hashedPassword,
    };

    const result = await db.insert(users).values(userData).returning();
    const user = result[0];

    // Return the user data without a token for registration
    return reply.code(201).send({
      id: user.id,
      username: user.username,
    });
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return reply.code(409).send({ error: 'Username already exists' });
    }

    request.log.error(error);
    return reply.code(500).send({ error: 'Internal server error' });
  }
}
