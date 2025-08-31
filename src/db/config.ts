import type { PoolConfig } from "pg";

// config
import { Env } from "@/config";

export type DrizzleDbCredentials = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  max: number | undefined;
  ssl: boolean | { rejectUnauthorized: boolean };
};

export const dbCredentials: DrizzleDbCredentials = {
  host: Env.DB_HOST,
  port: Env.DB_PORT,
  user: Env.DB_USER,
  database: Env.DB_NAME,
  password: Env.DB_PASSWORD,
  max: Env.IS_DB_MIGRATING ? 1 : undefined,
  ssl: Env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
};

export const dbConfig: PoolConfig = {
  ...dbCredentials,
};
