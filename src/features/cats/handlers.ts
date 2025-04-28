import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { cats } from '../../db/schema/cats';
import { eq, sql } from 'drizzle-orm';
import { NotFoundError } from '../../utils/errors';
import { v4 as uuidv4 } from 'uuid';

interface CatParams {
  id: string;
}

interface CreateCatBody {
  name: string;
  type: string;
}

interface UpdateCatBody {
  name?: string;
  type?: string;
}

export async function getAllCatsHandler(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const allCats = await this.db.select().from(cats);
  const simplifiedCats = allCats.map(cat => ({
    id: cat.id,
    name: cat.name,
    type: cat.type,
  }));
  return reply.code(200).send(simplifiedCats);
}

export async function getCatByIdHandler(
  this: FastifyInstance,
  request: FastifyRequest<{ Params: CatParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  const result = await this.db.select().from(cats).where(eq(cats.id, id));

  if (!result[0]) {
    throw NotFoundError(`Cat with ID ${id} not found`);
  }

  const cat = result[0];
  return reply.code(200).send({
    id: cat.id,
    name: cat.name,
    type: cat.type,
  });
}

export async function createCatHandler(
  this: FastifyInstance,
  request: FastifyRequest<{ Body: CreateCatBody }>,
  reply: FastifyReply,
) {
  // Generate a UUID for the cat
  const catId = uuidv4();

  // Add the ID to the cat data
  const catData = {
    id: catId,
    ...request.body,
  };

  const result = await this.db.insert(cats).values(catData).returning();
  const cat = result[0];

  return reply.code(201).send({
    id: cat.id,
    name: cat.name,
    type: cat.type,
  });
}

export async function updateCatHandler(
  this: FastifyInstance,
  request: FastifyRequest<{ Params: CatParams; Body: UpdateCatBody }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  // First check if the cat exists
  const existingCat = await this.db.select().from(cats).where(eq(cats.id, id));

  if (!existingCat[0]) {
    throw NotFoundError(`Cat with ID ${id} not found`);
  }

  // Add updatedAt timestamp
  const updateData = {
    ...request.body,
    updatedAt: sql`CURRENT_TIMESTAMP`,
  };

  const result = await this.db
    .update(cats)
    .set(updateData)
    .where(eq(cats.id, id))
    .returning();

  const cat = result[0];
  return reply.code(200).send({
    id: cat.id,
    name: cat.name,
    type: cat.type,
  });
}

export async function deleteCatHandler(
  this: FastifyInstance,
  request: FastifyRequest<{ Params: CatParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  // First check if the cat exists
  const existingCat = await this.db.select().from(cats).where(eq(cats.id, id));

  if (!existingCat[0]) {
    throw NotFoundError(`Cat with ID ${id} not found`);
  }

  await this.db.delete(cats).where(eq(cats.id, id));
  return reply.code(204).send();
}
