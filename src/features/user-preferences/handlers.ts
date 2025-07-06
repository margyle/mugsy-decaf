import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  userPreferences,
  StrengthPreference,
} from '../../db/schema/user-preferences';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../../utils/errors';
import { v4 as uuidv4 } from 'uuid';

interface CreateUserPreferencesBody {
  strengthPreference?: StrengthPreference;
  defaultCupSize?: number;
  notificationsBrewed?: boolean;
  notificationsMaintenance?: boolean;
  notificationsErrors?: boolean;
  notificationMethod?: 'email' | 'sms' | 'push' | 'none';
  smsPhoneNumber?: string;
  allowIntegrations?: boolean;
  cloudControlAccess?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  autoBrewSchedule?: string;
  units?: 'metric' | 'imperial';
  shareRecipes?: boolean;
  language?: string;
  timezone?: string;
}

interface UpdateUserPreferencesBody {
  strengthPreference?: StrengthPreference;
  defaultCupSize?: number;
  notificationsBrewed?: boolean;
  notificationsMaintenance?: boolean;
  notificationsErrors?: boolean;
  notificationMethod?: 'email' | 'sms' | 'push' | 'none';
  smsPhoneNumber?: string;
  allowIntegrations?: boolean;
  cloudControlAccess?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  autoBrewSchedule?: string;
  units?: 'metric' | 'imperial';
  shareRecipes?: boolean;
  language?: string;
  timezone?: string;
}

export async function getCurrentUserPreferencesHandler(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.id;

  const result = await this.db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId));

  if (!result[0]) {
    throw NotFoundError(`User preferences not found`);
  }

  const preferences = result[0];
  return reply.code(200).send(preferences);
}

export async function createUserPreferencesHandler(
  this: FastifyInstance,
  request: FastifyRequest<{ Body: CreateUserPreferencesBody }>,
  reply: FastifyReply,
) {
  const userId = request.user.id;

  const existingPrefs = await this.db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId));

  if (existingPrefs[0]) {
    return reply.code(409).send({
      error: 'Conflict',
      message: 'User preferences already exist. Use PUT to update them.',
    });
  }

  const preferencesId = uuidv4();

  const preferencesData = {
    id: preferencesId,
    userId,
    ...request.body,
  };

  const result = await this.db
    .insert(userPreferences)
    .values(preferencesData)
    .returning();

  const createdPreferences = result[0];
  return reply.code(201).send(createdPreferences);
}

export async function updateCurrentUserPreferencesHandler(
  this: FastifyInstance,
  request: FastifyRequest<{ Body: UpdateUserPreferencesBody }>,
  reply: FastifyReply,
) {
  const userId = request.user.id;

  const existingPrefs = await this.db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId));

  if (!existingPrefs[0]) {
    throw NotFoundError(`User preferences not found`);
  }

  const updateData = {
    ...request.body,
    updatedAt: new Date(),
  };

  const result = await this.db
    .update(userPreferences)
    .set(updateData)
    .where(eq(userPreferences.userId, userId))
    .returning();

  const updatedPreferences = result[0];
  return reply.code(200).send(updatedPreferences);
}

export async function deleteCurrentUserPreferencesHandler(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.id;

  const existingPrefs = await this.db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId));

  if (!existingPrefs[0]) {
    throw NotFoundError(`User preferences not found`);
  }

  await this.db
    .delete(userPreferences)
    .where(eq(userPreferences.userId, userId));

  return reply.code(204).send();
}
