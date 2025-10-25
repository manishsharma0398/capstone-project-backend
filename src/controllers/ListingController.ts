import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

// utils
import { ApiResponse, CustomStatusCodes } from "@/utils";
import { ListingService } from "../services";

class ListingController {
  async createNewListing(req: Request, res: Response) {
    const newListing = await ListingService.createNewListing(req.body);

    return ApiResponse.success({
      req,
      res,
      data: newListing,
      statusCode: StatusCodes.CREATED,
      message: "Listing created Successfully",
      code: CustomStatusCodes.LISTING_SUCCESSFULLY_CREATED,
    });
  }
}

export default new ListingController();
