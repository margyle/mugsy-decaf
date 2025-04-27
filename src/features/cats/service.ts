import { db } from '../../db';
import { cats, Cat, NewCat } from '../../db/schema/cats';
import { eq, sql } from 'drizzle-orm';
import { NotFoundError } from '../../utils/errors';

export async function getAllCats(): Promise<Cat[]> {
  return db.select().from(cats);
}

export async function getCatById(id: number): Promise<Cat> {
  const result = await db.select().from(cats).where(eq(cats.id, id));

  if (!result[0]) {
    throw NotFoundError(`Cat with ID ${id} not found`);
  }

  return result[0];
}

export async function createCat(data: NewCat): Promise<Cat> {
  const result = await db.insert(cats).values(data).returning();
  return result[0];
}

export async function updateCat(
  id: number,
  data: Partial<NewCat>,
): Promise<Cat> {
  // First check if the cat exists
  await getCatById(id);

  // Add updatedAt timestamp
  const updateData = {
    ...data,
    updatedAt: sql`CURRENT_TIMESTAMP`,
  };

  const result = await db
    .update(cats)
    .set(updateData)
    .where(eq(cats.id, id))
    .returning();

  return result[0];
}

export async function deleteCat(id: number): Promise<boolean> {
  // First check if the cat exists
  await getCatById(id);

  const result = await db
    .delete(cats)
    .where(eq(cats.id, id))
    .returning({ id: cats.id });

  return result.length > 0;
}
