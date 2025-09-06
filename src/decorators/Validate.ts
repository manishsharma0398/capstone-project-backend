import { ZodError } from "zod";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import type { Request, Response, NextFunction } from "express";

// utils
import { AppError, type SchemaPart } from "@/utils";

export function Validate(schema: SchemaPart) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

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
