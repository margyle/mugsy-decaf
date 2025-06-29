import { config } from 'dotenv';
import { join } from 'path';

const environment = process.env.NODE_ENV || 'development';
const envPath = join(
  process.cwd(),
  `.env${environment !== 'development' ? `.${environment}` : ''}`,
);

config({ path: envPath });

export interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  HOST: string;
  LOG_LEVEL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
}

const envConfig: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  HOST: process.env.HOST || 'localhost',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  JWT_SECRET:
    process.env.JWT_SECRET || 'super-secret-key-change-me-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  DATABASE_URL: process.env.DATABASE_URL || './data/decaf.db',
  BETTER_AUTH_SECRET:
    process.env.BETTER_AUTH_SECRET ||
    'super-secret-key-change-me-in-production',
};

const requiredEnvVars: Array<keyof EnvConfig> = [
  'JWT_SECRET',
  'DATABASE_URL',
  'BETTER_AUTH_SECRET',
  'PORT',
  'HOST',
  'LOG_LEVEL',
  'NODE_ENV',
];

for (const envVar of requiredEnvVars) {
  if (!envConfig[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default envConfig;
