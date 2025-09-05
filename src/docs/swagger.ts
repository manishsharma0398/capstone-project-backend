import type { Express } from "express";
import swaggerUi from "swagger-ui-express";

import { swaggerUiOptions } from "./swaggerUiOptions";
import { generateOpenAPIDocument } from "../utils/openapi";

export function setupSwagger(app: Express) {
  // generate OpenAPI spec
  const openApiDoc = generateOpenAPIDocument();

  // serve raw OpenAPI JSON
  app.get("/openapi.json", (_req, res) => {
    res.json(openApiDoc);
  });

  // serve Swagger UI
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiDoc, swaggerUiOptions)
  );
}
