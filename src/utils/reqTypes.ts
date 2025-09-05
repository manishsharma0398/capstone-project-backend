import { z } from "zod";

export type SchemaObject = {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
};

export type InferRequest<S extends SchemaObject> = {
  body: S["body"] extends z.ZodTypeAny ? z.infer<S["body"]> : {};
  query: S["query"] extends z.ZodTypeAny ? z.infer<S["query"]> : {};
  params: S["params"] extends z.ZodTypeAny ? z.infer<S["params"]> : {};
};
