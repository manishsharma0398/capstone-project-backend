import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// db
import {
  reviewApplicationSchema,
  ApplicationStatus,
  newApplicationBodySchema,
} from "@/db/schema";

// utils
import type { SchemaObject } from "@/utils";

extendZodWithOpenApi(z);

export const createApplicationSchemaObject: SchemaObject = {
  schema: {
    body: newApplicationBodySchema,
  },
  openapi: {
    summary: "Apply for a listing",
    description:
      "Allows a volunteer to apply for a listing by submitting an application with an optional message.",
    tags: ["Application"],
  },
};

export const getSingleApplicationSchemaObject: SchemaObject = {
  schema: {
    params: z.object({
      applicationId: z.coerce.number().describe("Unique ID of the application"),
    }),
  },
  openapi: {
    summary: "Get application details",
    description:
      "Fetches detailed information about a specific application, including status and messages.",
    tags: ["Application"],
  },
};

export const listApplicationsByUserSchemaObject: SchemaObject = {
  schema: {
    query: z.object({
      offset: z.coerce.number().default(0).describe("Pagination offset"),
      limit: z.coerce
        .number()
        .default(48)
        .describe("Number of results to return"),
    }),
  },
  openapi: {
    summary: "List all applications submitted by a specific user",
    description:
      "Allows a volunteer to view all their submitted or applied applications.",
    tags: ["Application"],
  },
};

export const listApplicationsByListingSchemaObject: SchemaObject = {
  schema: {
    params: z.object({
      listingId: z.coerce.number().describe("Unique ID of the listing"),
    }),
    query: z.object({
      offset: z.coerce.number().default(0).describe("Pagination offset"),
      limit: z.coerce
        .number()
        .default(48)
        .describe("Number of results to return"),
    }),
  },
  openapi: {
    summary: "List all applications for a specific listing",
    description:
      "Allows an organization or admin to view all volunteer applications submitted for a specific listing.",
    tags: ["Application"],
  },
};

export const getAllApplicationsSchemaObject: SchemaObject = {
  schema: {
    query: z.object({
      offset: z.coerce.number().default(0).describe("Pagination offset"),
      limit: z.coerce
        .number()
        .default(48)
        .describe("Number of results to return"),
    }),
  },
  openapi: {
    summary: "List all applications (Admin only)",
    description:
      "Retrieves a paginated list of all applications in the system. Accessible only to admin users.",
    tags: ["Application"],
  },
};

export const reviewApplicationSchemaObject: SchemaObject = {
  schema: {
    params: z.object({
      applicationId: z.coerce.number().describe("Unique ID of the application"),
    }),
    body: reviewApplicationSchema.extend({
      applicationStatus: z
        .enum([ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED])
        .describe("The final decision for the volunteer application."),
      organizationMessage: z
        .string()
        .describe(
          "Optional message sent to the volunteer explaining the decision.",
        ),
    }),
  },
  openapi: {
    summary: "Review an application (accept or reject)",
    description:
      "Allows an organization or admin to review a volunteer's application by updating its status to accepted or rejected, optionally adding an organization message.",
    tags: ["Application"],
  },
};

export const deleteApplicationSchemaObject: SchemaObject = {
  schema: {
    params: z.object({
      applicationId: z.coerce.number().describe("Unique ID of the application"),
    }),
  },
  openapi: {
    summary: "Delete or withdraw an application",
    description:
      "Allows a volunteer to withdraw their application if pending, or an admin to permanently delete it.",
    tags: ["Application"],
  },
};
