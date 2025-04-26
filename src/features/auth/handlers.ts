import { FastifyReply, FastifyRequest } from "fastify";
import * as authService from "./service";

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply
) {
  const { username, password } = request.body;

  const result = await authService.authenticateUser(
    request.server,
    username,
    password
  );

  if (!result) {
    return reply.code(401).send({ error: "Invalid username or password" });
  }

  return reply.code(200).send(result);
}

export async function registerHandler(
  request: FastifyRequest<{ Body: RegisterRequest }>,
  reply: FastifyReply
) {
  try {
    const user = await authService.registerUser(request.body);

    // Return the user data without a token for registration
    return reply.code(201).send({
      id: user.id,
      username: user.username,
    });
  } catch (error: any) {
    // Check for unique constraint violation
    if (error.message?.includes("UNIQUE constraint failed")) {
      return reply.code(409).send({ error: "Email already exists" });
    }

    request.log.error(error);
    return reply.code(500).send({ error: "Internal server error" });
  }
}
