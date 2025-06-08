import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { tags } from '../../db/schema/tags';
import { recipe_tags } from '../../db/schema/tags';
import { eq, sql, inArray } from 'drizzle-orm';
import { NotFoundError } from '../../utils/errors';
import { v4 as uuidv4 } from 'uuid';

interface CreateTagBody {
  name: string;
  slug: string;
}

interface AddTagsToRecipeBody {
  recipe_id: string;
  tag_names: string[];
}

function createSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function createTagHandler(
  this: FastifyInstance,
  request: FastifyRequest<{ Body: CreateTagBody }>,
  reply: FastifyReply,
) {
  const { name } = request.body;
  const slug = createSlug(name.trim());

  const tagValues = {
    id: uuidv4(),
    name: name.trim(),
    slug,
  };

  try {
    const result = await this.db.insert(tags).values(tagValues).returning();

    const tag = result[0];

    return reply.code(201).send({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    });
  } catch (error) {
    if ((error as Error).message?.includes('UNIQUE constraint failed')) {
      return reply.code(409).send({ error: 'Tag already exists' });
    }
    return reply.code(500).send({ error: 'Failed to create tag' });
  }
}

//TODO:this is unnecessarily complex, we should simplify
export async function addTagsToRecipeHandler(
  this: FastifyInstance,
  request: FastifyRequest<{ Body: AddTagsToRecipeBody }>,
  reply: FastifyReply,
) {
  const { recipe_id, tag_names } = request.body;

  if (!tag_names || tag_names.length === 0) {
    return reply.code(400).send({ error: 'At least one tag name is required' });
  }

  try {
    // Step 1: Find existing tags by name
    const existingTags = await this.db
      .select()
      .from(tags)
      .where(inArray(tags.name, tag_names));

    const existingTagNames = existingTags.map(tag => tag.name);
    const missingTagNames = tag_names.filter(
      name => !existingTagNames.includes(name),
    );

    // Step 2: Create missing tags one by one to handle duplicates
    const newTags = [];
    for (const tagName of missingTagNames) {
      const trimmedName = tagName.trim();
      if (trimmedName) {
        const slug = createSlug(trimmedName);

        // Check if a tag with this slug already exists
        const existingBySlug = await this.db
          .select()
          .from(tags)
          .where(eq(tags.slug, slug))
          .limit(1);

        if (existingBySlug.length > 0) {
          // Tag with this slug already exists, use it
          newTags.push(existingBySlug[0]);
        } else {
          // Create new tag
          const newTag = {
            id: uuidv4(),
            name: trimmedName,
            slug,
          };

          try {
            const result = await this.db
              .insert(tags)
              .values(newTag)
              .returning();
            newTags.push(result[0]);
          } catch (error) {
            // Handle race condition where tag was created between our check and insert
            if (
              (error as Error).message?.includes('UNIQUE constraint failed')
            ) {
              // Try to get the existing tag
              const existingTag = await this.db
                .select()
                .from(tags)
                .where(eq(tags.slug, slug))
                .limit(1);

              if (existingTag.length > 0) {
                newTags.push(existingTag[0]);
              }
            } else {
              throw error;
            }
          }
        }
      }
    }

    // Step 3: Get all tag IDs (existing + newly created/found)
    const allTags = [...existingTags, ...newTags];

    // Step 4: Create recipe-tag relationships
    const recipeTagRelations = allTags.map(tag => ({
      recipe_id,
      tag_id: tag.id,
    }));

    if (recipeTagRelations.length > 0) {
      try {
        await this.db.insert(recipe_tags).values(recipeTagRelations);
      } catch (error) {
        // Handle duplicate relationships (already exists)
        if ((error as Error).message?.includes('UNIQUE constraint failed')) {
          // Some relationships already exist, which is fine
          // We could implement ON CONFLICT IGNORE logic here if needed
        } else {
          throw error;
        }
      }
    }

    return reply.code(200).send({
      message: 'Tags successfully added to recipe',
      recipe_id,
      tags_added: allTags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      })),
    });
  } catch (error) {
    console.error('Error adding tags to recipe:', error);
    return reply.code(500).send({ error: 'Failed to add tags to recipe' });
  }
}
