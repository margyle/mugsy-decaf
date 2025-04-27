import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../db';
import { cats, Cat, NewCat } from '../../db/schema/cats';
import { eq, sql } from 'drizzle-orm';
import { NotFoundError } from '../../utils/errors';

interface CatParams {
  id: number;
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
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const allCats = await db.select().from(cats);
  const simplifiedCats = allCats.map(cat => ({
    id: cat.id,
    name: cat.name,
    type: cat.type,
  }));
  return reply.code(200).send(simplifiedCats);
}

export async function getCatByIdHandler(
  request: FastifyRequest<{ Params: CatParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  const result = await db.select().from(cats).where(eq(cats.id, id));

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
  request: FastifyRequest<{ Body: CreateCatBody }>,
  reply: FastifyReply,
) {
  const result = await db.insert(cats).values(request.body).returning();
  const cat = result[0];

  return reply.code(201).send({
    id: cat.id,
    name: cat.name,
    type: cat.type,
  });
}

export async function updateCatHandler(
  request: FastifyRequest<{ Params: CatParams; Body: UpdateCatBody }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  // First check if the cat exists
  const existingCat = await db.select().from(cats).where(eq(cats.id, id));

  if (!existingCat[0]) {
    throw NotFoundError(`Cat with ID ${id} not found`);
  }

  // Add updatedAt timestamp
  const updateData = {
    ...request.body,
    updatedAt: sql`CURRENT_TIMESTAMP`,
  };

  const result = await db
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
  request: FastifyRequest<{ Params: CatParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  // First check if the cat exists
  const existingCat = await db.select().from(cats).where(eq(cats.id, id));

  if (!existingCat[0]) {
    throw NotFoundError(`Cat with ID ${id} not found`);
  }

  await db.delete(cats).where(eq(cats.id, id));
  return reply.code(204).send();
}
