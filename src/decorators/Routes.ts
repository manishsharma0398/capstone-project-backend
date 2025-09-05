import type { RouteHandler } from "../library/routes";

export function Routes(baseRoute: string = "") {
  return (target: any) => {
    const pending: RouteHandler =
      Reflect.getMetadata("pendingRoutes", target.prototype) || new Map();

    const routeHandlers: RouteHandler = new Map();
    console.log("Debug pending", pending);

    for (const [method, routes] of pending.entries()) {
      for (const [path, handlers] of routes.entries()) {
        const fullPath = `${baseRoute}${path}`;
        if (!routeHandlers.has(method)) {
          routeHandlers.set(method, new Map());
        }
        routeHandlers.get(method)?.set(fullPath, handlers);
        console.log(
          `Registered [${(method as string).toUpperCase()}] ${fullPath}`
        );
      }
    }

    Reflect.defineMetadata("routeHandlers", routeHandlers, target);
  };
}
