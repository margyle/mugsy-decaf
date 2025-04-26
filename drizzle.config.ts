import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/db/schema/*",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || "./data/decaf.db",
  },
  verbose: true,
  strict: true,
} satisfies Config;
