import type { RouteHandler } from "@/library/routes";
import type { RequestHandler, Express } from "express";

export function Route(
  method: keyof Express,
  path: string = "",
  ...middleware: RequestHandler[]
) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    console.log("Debug Route decorator target", target);
    console.log("Debug Route decorator propertyKey", propertyKey);

    const pending: RouteHandler =
      Reflect.getMetadata("pendingRoutes", target) || new Map();

    if (!pending.has(method)) {
      pending.set(method, new Map());
    }

    pending.get(method)?.set(path, [...middleware, descriptor.value]);
    Reflect.defineMetadata("pendingRoutes", pending, target);

    // 🔑 save route info directly on the method
    Reflect.defineMetadata("routeInfo", { method, path }, target, propertyKey);
  };
}
