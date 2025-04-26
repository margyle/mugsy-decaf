import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

/**
 * Fastify plugin that adds global validation utilities
 */
export default fp(
  async function (fastify: FastifyInstance) {
    // Add global validation utilities
    fastify.decorate("validators", {
      /**
       * Validate email format
       */
      isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },

      /**
       * Check if a string has minimum length
       */
      hasMinLength(str: string, minLength: number): boolean {
        return str.length >= minLength;
      },

      /**
       * Check if a string has special characters
       */
      hasSpecialChars(str: string): boolean {
        const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        return specialCharsRegex.test(str);
      },
    });

    fastify.log.info("Validation plugin registered");
  },
  {
    name: "validation-plugin",
  }
);

// Type extension for Fastify
declare module "fastify" {
  interface FastifyInstance {
    validators: {
      isValidEmail(email: string): boolean;
      hasMinLength(str: string, minLength: number): boolean;
      hasSpecialChars(str: string): boolean;
    };
  }
}
