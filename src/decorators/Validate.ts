import { ReasonPhrases, StatusCodes } from "http-status-codes";
import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodObject, type ZodRawShape } from "zod";

// utils
import { AppError } from "@/utils";

export type SchemaObject = {
  body?: ZodObject<ZodRawShape>;
  query?: ZodObject<ZodRawShape>;
  params?: ZodObject<ZodRawShape>;
};

export function Validate(schema: SchemaObject) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    console.log("Debug Validate decorator _target", _target);
    console.log("Debug Validate decorator _propertyKey", _propertyKey);

    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        if (schema.body) {
          req.body = await schema.body.strict().parseAsync(req.body);
        }
        if (schema.query) {
          schema.query.strict().parseAsync(req.body);
        }
        if (schema.params) {
          schema.params.strict().parseAsync(req.params);
        }
        return originalMethod.call(this, req, res, next);
      } catch (err) {
        const errors =
          err instanceof ZodError
            ? err.issues.map((e) => ({
                path: e.path.join(".") || "root",
                message: e.message,
              }))
            : err;
        throw new AppError({
          details: errors,
          message: "Validation failed",
          code: ReasonPhrases.BAD_REQUEST,
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
        });
      }
    };

    return descriptor;
  };
}
