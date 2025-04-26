export const loginSchema = {
  $id: "login",
  type: "object",
  required: ["username", "password"],
  properties: {
    username: { type: "string", minLength: 3 },
    password: { type: "string", minLength: 9 },
  },
};

export const registerSchema = {
  $id: "register",
  type: "object",
  required: ["username", "password"],
  properties: {
    username: { type: "string", minLength: 3, maxLength: 50 },
    password: { type: "string", minLength: 9 },
  },
};
