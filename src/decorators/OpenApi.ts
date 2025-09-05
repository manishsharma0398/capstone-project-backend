// decorators/OpenApi.ts
import { registry } from "@/docs/openapiRegistry";
import type { SchemaObject } from "@/utils/reqTypes";
import type { RouteConfig } from "@asteasolutions/zod-to-openapi";

interface OpenApiOptions {
  summary?: string;
  description?: string;
  tags?: string[];
  responses?: RouteConfig["responses"];
}

export function OpenApi(schema: SchemaObject, options: OpenApiOptions = {}) {
  return function (target: any, propertyKey: string) {
    // console.log("Debug target", target);
    // console.log("Debug propertyKey", propertyKey);
    const routeInfo = Reflect.getMetadata("routeInfo", target, propertyKey);
    if (!routeInfo) {
      console.warn(`⚠️ No route info found for ${propertyKey}`);
      return;
    }

    const baseRoute: string =
      Reflect.getMetadata("baseRoute", target.constructor) || "";

    // Use "routeHandlers" not "pendingRoutes"
    const routeHandlers =
      Reflect.getMetadata("routeHandlers", target.constructor) ||
      new Map<string, Map<string, any>>();

    // const pending =
    //   Reflect.getMetadata("pendingRoutes", target) ||
    //   new Map<string, Map<string, any>>();

    for (const [method, routes] of routeHandlers.entries()) {
      for (const [path, handlers] of routes.entries()) {
        const handlerFn = handlers[handlers.length - 1]; // last one is the method itself

        if (handlerFn === target[propertyKey]) {
          const fullPath = `${baseRoute}${path}`;

          // const request: RouteConfig["request"] = {};

          // if (schema.body) {
          //   request.body = {
          //     content: {
          //       "application/json": {
          //         schema: schema.body,
          //       },
          //     },
          //   } satisfies ZodRequestBody;
          // }

          // if (schema.query) {
          //   request.query = schema.query;
          // }

          // if (schema.params) {
          //   request.params = schema.params;
          // }

          registry.registerPath({
            method,
            path: fullPath,
            ...(options.description && { description: options.description }),
            ...(options.summary && { summary: options.summary }),
            ...(options.tags && { tags: options.tags }),
            request: {
              ...(schema.body && {
                body: {
                  content: {
                    "application/json": {
                      schema: schema.body,
                    },
                  },
                },
              }),
            },
            responses: {
              200: { description: "Success" },
            },
          });
        }
      }
    }
  };
}
