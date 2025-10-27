import type { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { ListingService } from "../services";

// utils
import { ApiResponse, CustomStatusCodes } from "@/utils";

class ListingController {
  async getAllListing(req: Request, res: Response) {
    const listings = await ListingService.getAllListing({
      offset: Number(req?.query?.offset ?? 0),
      limit: Number(req?.query?.limit ?? 48),
    });

    return ApiResponse.success({
      req,
      res,
      data: listings,
      statusCode: StatusCodes.OK,
      message: "All Listings",
      code: ReasonPhrases.OK,
    });
  }

  async getOrganizationListing(req: Request, res: Response) {
    const listings = await ListingService.getOrganizationListing({
      offset: Number(req?.query?.offset ?? 0),
      limit: Number(req?.query?.limit ?? 48),
      organizationId: Number(req?.params?.organizationId!),
    });

    return ApiResponse.success({
      req,
      res,
      data: listings,
      statusCode: StatusCodes.OK,
      message: "Organization Listings",
      code: ReasonPhrases.OK,
    });
  }

  async createNewListing(req: Request, res: Response) {
    const newListing = await ListingService.createNewListing({
      ...req.body,
      organizationId: req?.user?.userId!,
    });

    return ApiResponse.success({
      req,
      res,
      data: newListing,
      statusCode: StatusCodes.CREATED,
      message: "Listing created Successfully",
      code: CustomStatusCodes.LISTING_SUCCESSFULLY_CREATED,
    });
  }

  async getListingDetails(req: Request, res: Response) {
    const newListing = await ListingService.createNewListing({
      ...req.body,
      organizationId: req?.user?.userId!,
    });

    return ApiResponse.success({
      req,
      res,
      data: newListing,
      statusCode: StatusCodes.CREATED,
      message: "Listing created Successfully",
      code: CustomStatusCodes.LISTING_SUCCESSFULLY_CREATED,
    });
  }

  async updateListing(req: Request, res: Response) {
    const listingId = Number(req?.params?.listingId!);

    const updatedListing = await ListingService.updateListing({
      payload: req.body,
      listingId,
      role: req?.user?.role!,
      userId: req?.user?.userId!,
    });

    return ApiResponse.success({
      req,
      res,
      data: updatedListing,
      statusCode: StatusCodes.OK,
      message: "Listing updated Successfully",
      code: CustomStatusCodes.LISTING_SUCCESSFULLY_UPDATED,
    });
  }

  async deleteListing(req: Request, res: Response) {
    const listingId = Number(req?.params?.listingId!);
    await ListingService.deleteListing({
      role: req?.user?.role!,
      userId: req?.user?.userId!,
      listingId,
    });

    return ApiResponse.success({
      req,
      res,
      data: null,
      statusCode: StatusCodes.OK,
      message: `Listing #${listingId} deleted`,
      code: ReasonPhrases.NO_CONTENT,
    });
  }
}

export default new ListingController();
