import type { SwaggerUiOptions } from "swagger-ui-express";

export const swaggerUiOptions: SwaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: "none",
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
  },
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Community Connect API Documentation",
};
