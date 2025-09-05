import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { Env } from "@/config";

import { registry } from "@/docs/openapiRegistry";

export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Community Connect API",
      version: "1.0.0",
    },
    servers: [{ url: `http://localhost:${Env.PORT}` }],
  });
}
