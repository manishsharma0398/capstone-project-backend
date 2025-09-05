import type { Express } from "express";
import type { RouteHandler } from "@/library/routes";

export function defineRoutes(controllers: any[], application: Express) {
  for (const ControllerClass of controllers) {
    const routeHandlers: RouteHandler =
      Reflect.getMetadata("routeHandlers", ControllerClass) || new Map();

    for (const [method, routes] of routeHandlers.entries()) {
      for (const [path, handlers] of routes.entries()) {
        if (handlers && handlers.length > 0) {
          application[method as keyof Express](path, handlers);
        }
      }
    }
  }
}
