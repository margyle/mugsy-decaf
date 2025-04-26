// Define allowed cat types as a constant for reuse
const ALLOWED_CAT_TYPES = [
  "persian",
  "siamese",
  "maine coon",
  "bengal",
  "ragdoll",
  "other",
];

export const catSchema = {
  $id: "cat",
  type: "object",
  required: ["name", "type"],
  properties: {
    id: { type: "integer" },
    name: { type: "string", minLength: 1, maxLength: 100 },
    type: {
      type: "string",
      enum: ALLOWED_CAT_TYPES,
      description: "Type of cat breed",
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

export const getCatParamsSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "integer" },
  },
};

export const createCatBodySchema = {
  type: "object",
  required: ["name", "type"],
  properties: {
    name: { type: "string", minLength: 1, maxLength: 100 },
    type: {
      type: "string",
      enum: ALLOWED_CAT_TYPES,
      description: "Type of cat breed",
    },
  },
};

export const updateCatBodySchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 100 },
    type: {
      type: "string",
      enum: ALLOWED_CAT_TYPES,
      description: "Type of cat breed",
    },
  },
};
