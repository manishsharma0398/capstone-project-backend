import { ZodObject, type ZodRawShape } from "zod";
import type { RouteConfig } from "@asteasolutions/zod-to-openapi";

export interface OpenApiOptions {
  tags?: string[];
  summary?: string;
  description?: string;
  responses?: RouteConfig["responses"];
}

// For just the validation part (used by Validate decorator)
export type SchemaPart = {
  body?: ZodObject<ZodRawShape>;
  query?: ZodObject<ZodRawShape>;
  params?: ZodObject<ZodRawShape>;
};

export type SchemaObject = {
  schema: SchemaPart;
  openapi?: OpenApiOptions;
};
