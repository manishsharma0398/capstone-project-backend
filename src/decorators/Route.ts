import type { RequestHandler, Express } from "express";

import type {
  HandlerItem,
  RouteHandler,
  EnhancedHandler,
} from "@/library/routes";

export function Route(
  method: keyof Express,
  path: string = "",
  ...middleware: RequestHandler[]
) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const pending: RouteHandler =
      Reflect.getMetadata("pendingRoutes", target) || new Map();

    if (!pending.has(method)) {
      pending.set(method, new Map());
    }

    const handlerStack: HandlerItem[] = [
      ...middleware,
      {
        handler: descriptor.value,
        methodName: propertyKey,
      } as EnhancedHandler,
    ];

    pending.get(method)?.set(path, handlerStack);
    Reflect.defineMetadata("pendingRoutes", pending, target);
  };
}
