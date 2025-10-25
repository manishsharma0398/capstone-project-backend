import { StatusCodes } from "http-status-codes";

// db
import db from "@/db";
import { listings } from "@/db/schema";

// utils
import { AppError, CustomStatusCodes } from "@/utils";

export class ListingService {
  static async createNewListing(data: {
    title: string;
    description: string;
    listingType: string;
    organizationId: number;
    location: string;
    extraData: string;
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
}
