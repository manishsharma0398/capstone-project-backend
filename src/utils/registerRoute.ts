import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import type { SchemaObject } from "./reqTypes";

export const registry = new OpenAPIRegistry();

type RouteConfig<T extends SchemaObject> = {
  schema: T;
  method: "get" | "post" | "put" | "delete";
  path: string;
  summary?: string;
  tags?: string[];
};

export function registerRoute<T extends SchemaObject>(config: RouteConfig<T>) {
  return registry.registerPath({
    method: config.method,
    path: config.path,
    ...(config.summary && { summary: config.summary }),
    ...(config.tags && { tags: config.tags }),
    request: {
      ...(config.schema.body && {
        body: {
          content: {
            "application/json": {
              schema: config.schema.body,
            },
          },
        },
      }),
    },
    responses: {
      200: {
        description: "Success",
      },
    },
  });
}
