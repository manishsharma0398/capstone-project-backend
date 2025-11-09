import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// db
import { newListingBodySchema } from "@/db/schema";

// utils
import type { SchemaObject } from "@/utils";

extendZodWithOpenApi(z);

export const createNewListingSchema: SchemaObject = {
  schema: {
    body: newListingBodySchema.extend({
      // Frontend extras (optional in request)
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),

      skills: z.array(z.number()).optional(), // list of skill IDs
      media: z.array(z.string()).optional(), // S3 URLs
      timeSlots: z
        .array(
          z.object({
            day: z.string(),
            startTime: z.string(),
            endTime: z.string(),
          }),
        )
        .optional(),
    }),
  },
  openapi: {
    summary: "Create new listing",
    description: "Creates new listing",
    tags: ["Listings"],
  },
};

export const getListing: SchemaObject = {
  schema: {
    params: z.object({
      listingId: z.coerce.number(),
    }),
  },
  openapi: {
    summary: "getListing",
    description: "getListing",
    tags: ["Listings"],
  },
};

export const updateListing: SchemaObject = {
  schema: {
    params: z.object({
      listingId: z.coerce.number(),
    }),
    body: newListingBodySchema.partial(),
  },
  openapi: {
    summary: "updateListing",
    description: "updateListing",
    tags: ["Listings"],
  },
};

export const deleteListing: SchemaObject = {
  schema: {
    params: z.object({
      listingId: z.coerce.number(),
    }),
  },
  openapi: {
    summary: "deleteListing",
    description: "deleteListing",
    tags: ["Listings"],
  },
};

export const getAllListing: SchemaObject = {
  schema: {
    query: z.object({
      offset: z.coerce.number().default(0),
      limit: z.coerce.number().default(48),
    }),
  },
  openapi: {
    summary: "getAllListing",
    description: "getAllListing",
    tags: ["Listings"],
  },
};

export const getOrganizationListing: SchemaObject = {
  schema: {
    query: z.object({
      offset: z.coerce.number().default(0),
      limit: z.coerce.number().default(48),
    }),
  },
  openapi: {
    summary: "getOrganizationListing",
    description: "getOrganizationListing",
    tags: ["Listings"],
  },
};

export const getAdminListing: SchemaObject = {
  schema: {
    query: z.object({
      offset: z.coerce.number().default(0),
      limit: z.coerce.number().default(48),
    }),
  },
  openapi: {
    summary: "getAdminListing",
    description: "getAdminListing",
    tags: ["Listings"],
  },
};
