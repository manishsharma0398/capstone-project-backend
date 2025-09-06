import { registry } from "@/docs/openapiRegistry";

import {
  isEnhancedHandler,
  type HandlerItem,
  type RouteHandler,
} from "@/library/routes";

export function Routes(baseRoute: string = "") {
  return (target: any) => {
    const pending: RouteHandler =
      Reflect.getMetadata("pendingRoutes", target.prototype) || new Map();

    const routeHandlers: RouteHandler = new Map();

    for (const [method, routes] of pending.entries()) {
      for (const [path, handlers] of routes.entries()) {
        const fullPath = `${baseRoute}${path}`;
        if (!routeHandlers.has(method)) {
          routeHandlers.set(method, new Map());
        }

        const expressHandlers = (handlers as HandlerItem[]).map(
          (item: HandlerItem) => (isEnhancedHandler(item) ? item.handler : item)
        );

        routeHandlers.get(method)?.set(fullPath, expressHandlers);

        const lastHandler = (handlers as HandlerItem[])[handlers.length - 1];

        if (!lastHandler) {
          console.warn(`No handler found for ${String(method)} ${fullPath}`);
          continue;
        }

        let methodName: string;
        if (isEnhancedHandler(lastHandler)) {
          methodName = lastHandler.methodName;
        } else {
          methodName = lastHandler.name || "anonymous";
        }

        const openApiData = Reflect.getMetadata(
          "openApi",
          target.prototype,
          methodName
        );

        if (openApiData && openApiData?.schemaObj) {
          const { schema, openapi } = openApiData.schemaObj;

          registry.registerPath({
            method: method as any,
            path: fullPath,
            ...(openapi.description && {
              description: openapi.description,
            }),
            ...(openapi.summary && {
              summary: openapi.summary,
            }),
            ...(openapi.tags && { tags: openapi.tags }),
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
              ...(schema.query && {
                query: schema.query,
              }),
              ...(schema.params && {
                params: schema.params,
              }),
            },
            responses: openapi.responses || {
              200: { description: "Success" },
            },
          });
        }
      }
    }

    Reflect.defineMetadata("routeHandlers", routeHandlers, target);
    Reflect.defineMetadata("baseRoute", baseRoute, target);
  };
}
