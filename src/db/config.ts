import { Env } from "@/config";
import type { PoolConfig } from "pg";

export type DrizzleDbCredentials = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: boolean | { rejectUnauthorized: boolean };
  max: number | undefined;
};

export const dbCredentials: DrizzleDbCredentials = {
  host: Env.DB_HOST,
  port: Env.DB_PORT,
  user: Env.DB_USER,
  password: Env.DB_PASSWORD,
  database: Env.DB_NAME,
  ssl: Env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: Env.IS_DB_MIGRATING ? 1 : undefined,
};

export const dbConfig: PoolConfig = {
  ...dbCredentials,
};
