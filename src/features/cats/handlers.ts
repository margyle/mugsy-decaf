import { FastifyReply, FastifyRequest } from 'fastify';
import * as catService from './service';

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
  const cats = await catService.getAllCats();
  const simplifiedCats = cats.map(cat => ({
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
  const cat = await catService.getCatById(id);
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
  const cat = await catService.createCat(request.body);
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
  const cat = await catService.updateCat(id, request.body);
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
  await catService.deleteCat(id);
  return reply.code(204).send();
}
