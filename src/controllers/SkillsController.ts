import type { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { SkillService } from "../services";

// utils
import { ApiResponse, CustomStatusCodes } from "@/utils";

class SkillsController {
  async getAllSkills(req: Request, res: Response) {
    const skills = await SkillService.getAllSkills({
      offset: Number(req?.query?.offset ?? 0),
      limit: Number(req?.query?.limit ?? 48),
    });

    return ApiResponse.success({
      req,
      res,
      data: skills,
      statusCode: StatusCodes.OK,
      message: "All Skills",
      code: ReasonPhrases.OK,
    });
  }

  async getUserSkills(req: Request, res: Response) {
    const userSkills = await SkillService.getUserSkills({
      offset: Number(req?.query?.offset ?? 0),
      limit: Number(req?.query?.limit ?? 48),
      userId: Number(req?.params?.userId!),
    });

    return ApiResponse.success({
      req,
      res,
      data: userSkills,
      statusCode: StatusCodes.OK,
      message: "User Skills",
      code: ReasonPhrases.OK,
    });
  }

  async createNewSkill(req: Request, res: Response) {
    const newSkill = await SkillService.createNewSkill({
      ...req.body,
    });

    return ApiResponse.success({
      req,
      res,
      data: newSkill,
      statusCode: StatusCodes.CREATED,
      message: "Skill created Successfully",
      code: CustomStatusCodes.LISTING_SUCCESSFULLY_CREATED,
    });
  }

  async searchASkill(req: Request, res: Response) {
    const skills = await SkillService.searchASkill({
      query: req.query.query,
    });

    return ApiResponse.success({
      req,
      res,
      data: skills,
      statusCode: StatusCodes.OK,
      message: "Skill created Successfully",
      code: CustomStatusCodes.LISTING_SUCCESSFULLY_CREATED,
    });
  }

  // async getListingDetails(req: Request, res: Response) {
  //   const newListing = await SkillService.createNewListing({
  //     ...req.body,
  //     organizationId: req?.user?.userId!,
  //   });

  //   return ApiResponse.success({
  //     req,
  //     res,
  //     data: newListing,
  //     statusCode: StatusCodes.CREATED,
  //     message: "Listing created Successfully",
  //     code: CustomStatusCodes.LISTING_SUCCESSFULLY_CREATED,
  //   });
  // }

  // async updateListing(req: Request, res: Response) {
  //   const listingId = Number(req?.params?.listingId!);

  //   const updatedListing = await SkillService.updateListing({
  //     payload: req.body,
  //     listingId,
  //     role: req?.user?.role!,
  //     userId: req?.user?.userId!,
  //   });

  //   return ApiResponse.success({
  //     req,
  //     res,
  //     data: updatedListing,
  //     statusCode: StatusCodes.OK,
  //     message: "Listing updated Successfully",
  //     code: CustomStatusCodes.LISTING_SUCCESSFULLY_UPDATED,
  //   });
  // }

  // async deleteListing(req: Request, res: Response) {
  //   const listingId = Number(req?.params?.listingId!);
  //   await SkillService.deleteListing({
  //     role: req?.user?.role!,
  //     userId: req?.user?.userId!,
  //     listingId,
  //   });

  //   return ApiResponse.success({
  //     req,
  //     res,
  //     data: null,
  //     statusCode: StatusCodes.OK,
  //     message: `Listing #${listingId} deleted`,
  //     code: ReasonPhrases.NO_CONTENT,
  //   });
  // }
}

export default new SkillsController();
