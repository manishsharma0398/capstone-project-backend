import z from "zod";
import type { SchemaObject } from "../utils";

export const getUserSkills: SchemaObject = {
  schema: {
    params: z.object({ userId: z.coerce.number().gt(0) }),
    query: z.object({
      offset: z.coerce.number().default(0),
      limit: z.coerce.number().default(48),
    }),
  },
  openapi: {
    summary: "getUserSkills",
    description: "getUserSkills",
    tags: ["Skills"],
  },
};

export const searchSkills: SchemaObject = {
  schema: {
    query: z.object({
      query: z.string().min(1, "Search query must not be empty"),
    }),
  },
  openapi: {
    summary: "Search skills",
    description: "Searches for skills by title (case-insensitive).",
    tags: ["Skills"],
  },
};
