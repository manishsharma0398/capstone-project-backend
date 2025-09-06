import type { Express, RequestHandler } from "express";

export interface IRouteProps {
  route: string;
  middleware: any[];
}

export type TRoute = { [key: string]: IRouteProps[] };

export interface EnhancedHandler {
  handler: RequestHandler;
  methodName: string;
}

export type HandlerItem = RequestHandler | EnhancedHandler;

export type RouteHandler = Map<keyof Express, Map<string, HandlerItem[]>>;

export function isEnhancedHandler(item: any): item is EnhancedHandler {
  return (
    typeof item === "object" &&
    item !== null &&
    "handler" in item &&
    "methodName" in item
  );
}
