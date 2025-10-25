import { eq, sql } from "drizzle-orm";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

// db
import db from "@/db";
import { listings, UserRole } from "@/db/schema";

// utils
import { AppError, CustomStatusCodes } from "@/utils";

export class ListingService {
  static async createNewListing(data: {
    title: string;
    description: string;
    listingType: string;
    location: string;
    extraData: string;
    organizationId: number;
  }) {
    const listing = await db
      .insert(listings)
      .values({ ...data })
      .returning();

    if (!listing) {
      throw new AppError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: CustomStatusCodes.LISTING_FAILED_TO_CREATE,
        message: "Failed to create listing",
      });
    }

    return listing;
  }

  static async getAllListing(data: { offset: number; limit: number }) {
    const query = sql`
      WITH data AS (
        SELECT * FROM ${listings}
        ORDER BY id ASC
        LIMIT ${data.limit} OFFSET ${data.offset}
      )
      SELECT json_build_object(
        'items', json_agg(data.*),
        'total', (SELECT COUNT(*)::int FROM ${listings})
      )::json AS result
      FROM data;
      `;

    const allListings = await db.execute(query);

    if (!allListings) {
      throw new AppError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "Error getting all listings",
      });
    }

    // Parse JSON string manually
    const parsed = allListings.rows?.[0]?.result ?? {
      items: [],
      total: 0,
    };

    return parsed;
  }

  static async getOrganizationListing(data: {
    offset: number;
    limit: number;
    organizationId: number;
  }) {
    const query = sql`
      WITH data AS (
        SELECT * 
        FROM ${listings}
        WHERE organization_id = ${data.organizationId}
        ORDER BY id ASC
        LIMIT ${data.limit} 
        OFFSET ${data.offset}
      )
      SELECT json_build_object(
        'items', json_agg(data.*),
        'total', (
          SELECT COUNT(*)::int 
          FROM ${listings} 
          WHERE organization_id = ${data.organizationId}
        )
      )::json AS result
      FROM data;
    `;

    const organizationListing = await db.execute(query);

    if (!organizationListing) {
      throw new AppError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "Failed getting organization listing",
      });
    }

    // Parse JSON string manually
    const parsed = organizationListing.rows?.[0]?.result ?? {
      items: [],
      total: 0,
    };

    return parsed;
  }

  static async updateListing(data: {
    listingId: number;
    role: UserRole;
    userId: number;
    payload: Partial<typeof listings.$inferInsert>;
  }) {
    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, data.listingId),
      columns: {
        organizationId: true,
      },
    });

    if (!listing) {
      throw new AppError({
        statusCode: StatusCodes.NOT_FOUND,
        code: ReasonPhrases.NOT_FOUND,
        message: "Listing not found",
      });
    }

    if (
      data.role !== UserRole.ADMIN &&
      listing.organizationId !== data.userId
    ) {
      throw new AppError({
        statusCode: StatusCodes.FORBIDDEN,
        code: ReasonPhrases.FORBIDDEN,
        message: "You don’t have permission to update this listing.",
      });
    }

    const [updatedListing] = await db
      .update(listings)
      .set(data.payload)
      .where(eq(listings.id, data.listingId))
      .returning();

    if (!updatedListing) {
      throw new AppError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "Error updating listing.",
      });
    }

    return updatedListing;
  }

  static async deleteListing(data: {
    listingId: number;
    role: UserRole;
    userId: number;
  }) {
    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, data.listingId),
      columns: {
        organizationId: true,
        id: true,
      },
    });

    if (!listing) {
      throw new AppError({
        statusCode: StatusCodes.NOT_FOUND,
        code: ReasonPhrases.NOT_FOUND,
        message: "Listing not found",
      });
    }

    if (
      data.role !== UserRole.ADMIN &&
      listing.organizationId !== data.userId
    ) {
      throw new AppError({
        statusCode: StatusCodes.FORBIDDEN,
        code: ReasonPhrases.FORBIDDEN,
        message: "You don’t have permission to delete it.",
      });
    }

    const deleted = await db
      .delete(listings)
      .where(eq(listings.id, data.listingId));

    if (!deleted) {
      throw new AppError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "Error deleting listing.",
      });
    }

    return;
  }
}
