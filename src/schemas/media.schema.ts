import z from "zod";
import type { SchemaObject } from "../utils";

export const mediaPresignSchema: SchemaObject = {
  schema: {
    body: z.object({
      files: z
        .array(
          z.object({
            fileName: z.string(),
            fileType: z.string(),
            scope: z.string().default("listing"),
          }),
        )
        .nonempty(),
    }),
  },
  openapi: {
    summary: "mediaPresignSchema",
    description: "mediaPresignSchema",
    tags: ["Media"],
  },
};
