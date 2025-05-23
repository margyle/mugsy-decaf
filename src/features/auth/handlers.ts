import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { users } from '../../db/schema/users';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const SALT_ROUNDS = 12; // High work factor for better security

interface LoginRequest {
  username: string;
  password?: string;
  pin?: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  pin: string;
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
 * Hash a PIN using bcrypt (same as password for security)
 * @param pin The plain-text PIN to hash
 * @returns The hashed PIN
 */
async function hashPin(pin: string): Promise<string> {
  return await bcrypt.hash(pin, SALT_ROUNDS);
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

/**
 * Verify a PIN against a stored hash
 * @param pin The plain-text PIN to verify
 * @param hash The stored PIN hash
 * @returns True if the PIN matches, false otherwise
 */
async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(pin, hash);
}

/**
 * Validate PIN format (exactly 8 digits)
 * @param pin The PIN to validate
 * @returns True if PIN is valid format
 */
function isValidPinFormat(pin: string): boolean {
  return /^[0-9]{8}$/.test(pin);
}

export async function loginHandler(
  this: FastifyInstance,
  request: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply,
) {
  const { username, password, pin } = request.body;

  // Validate that either password or PIN is provided (but not both)
  if (!password && !pin) {
    return reply.code(400).send({
      error: 'Either password or PIN is required',
    });
  }

  if (password && pin) {
    return reply.code(400).send({
      error: 'Provide either password or PIN, not both',
    });
  }

  // Validate PIN type and format if provided
  if (pin) {
    // Convert to string to handle both string and number inputs
    const pinString = String(pin);

    if (!isValidPinFormat(pinString)) {
      return reply.code(400).send({
        error: 'PIN must be exactly 8 digits',
      });
    }
  }

  // Find user by username
  const result = await this.db
    .select()
    .from(users)
    .where(eq(users.username, username));
  const user = result[0];

  if (!user) {
    return reply.code(401).send({ error: 'Invalid username or credentials' });
  }

  // Verify credentials based on what was provided
  let credentialsValid = false;

  if (password) {
    credentialsValid = await verifyPassword(password, user.password);
  } else if (pin) {
    // Convert to string to handle both string and number inputs
    const pinString = String(pin);
    credentialsValid = await verifyPin(pinString, user.pin);
  }

  if (!credentialsValid) {
    return reply.code(401).send({ error: 'Invalid username or credentials' });
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
  this: FastifyInstance,
  request: FastifyRequest<{ Body: RegisterRequest }>,
  reply: FastifyReply,
) {
  const { username, password, pin } = request.body;

  // Validate PIN type and format
  // Convert to string to handle both string and number inputs
  const pinString = String(pin);

  if (!isValidPinFormat(pinString)) {
    return reply.code(400).send({
      error: 'PIN must be exactly 8 digits',
    });
  }

  // Prevent duplicate username registration
  const existingUser = await this.db
    .select()
    .from(users)
    .where(eq(users.username, username));
  if (existingUser[0]) {
    return reply.code(409).send({ error: 'Username already exists' });
  }

  try {
    // Hash password and PIN
    const hashedPassword = await hashPassword(password);
    const hashedPin = await hashPin(pinString);

    // Generate UUID for user
    const userId = uuidv4();

    // Insert user to database
    const userData = {
      id: userId,
      username: username,
      password: hashedPassword,
      pin: hashedPin,
    };

    const result = await this.db.insert(users).values(userData).returning();
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
