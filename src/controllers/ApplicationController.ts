import type { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { ApplicationService } from "../services";

// utils
import { ApiResponse } from "@/utils";

class ApplicationController {
  async createApplication(req: Request, res: Response) {
    const newApplication = await ApplicationService.createApplication({
      ...req.body,
      volunteerId: Number(req?.user?.userId!),
    });

    return ApiResponse.success({
      req,
      res,
      data: newApplication,
      statusCode: StatusCodes.CREATED,
      message: "Successfully applied for a listing",
      code: ReasonPhrases.CREATED,
    });
  }

  async getSingleApplication(req: Request, res: Response) {
    const application = await ApplicationService.getApplicationById({
      applicationId: Number(req?.params?.applicationId!),
    });

    return ApiResponse.success({
      req,
      res,
      data: application,
      statusCode: StatusCodes.OK,
      message: "Application Details",
      code: ReasonPhrases.OK,
    });
  }

  async listApplicationsByUser(req: Request, res: Response) {
    const applications = await ApplicationService.listApplicationsByUser({
      offset: Number(req?.query?.offset || 0),
      limit: Number(req?.query?.limit || 48),
      userId: req.user?.userId!,
    });

    return ApiResponse.success({
      req,
      res,
      data: applications,
      statusCode: StatusCodes.OK,
      message: `Fetched applications submitted by user #${req.user?.userId}`,
      code: ReasonPhrases.OK,
    });
  }

  async listApplicationsByOrganization(req: Request, res: Response) {
    const applications =
      await ApplicationService.listApplicationsByOrganization({
        offset: Number(req?.query?.offset || 0),
        limit: Number(req?.query?.limit || 48),
        userId: req.user?.userId!,
      });

    return ApiResponse.success({
      req,
      res,
      data: applications,
      statusCode: StatusCodes.OK,
      message: `Fetched applied applications by organization #${req.user?.userId}`,
      code: ReasonPhrases.OK,
    });
  }

  async listApplicationsByListing(req: Request, res: Response) {
    const listingId = req?.params?.listingId;

    const applications = await ApplicationService.listApplicationsByListing({
      offset: Number(req?.query?.offset || 0),
      limit: Number(req?.query?.limit || 48),
      listingId,
      userId: req.user?.userId!,
      role: req.user?.role!,
    });

    return ApiResponse.success({
      req,
      res,
      data: applications,
      statusCode: StatusCodes.OK,
      message: `Fetched applications for listing #${listingId}`,
      code: ReasonPhrases.OK,
    });
  }

  async getAllApplications(req: Request, res: Response) {
    const applications = await ApplicationService.getAllApplications({
      offset: Number(req?.query?.offset ?? 0),
      limit: Number(req?.query?.limit ?? 48),
    });

    return ApiResponse.success({
      req,
      res,
      data: applications,
      statusCode: StatusCodes.OK,
      message: "All Applications",
      code: ReasonPhrases.OK,
    });
  }

  async deleteApplication(req: Request, res: Response) {
    const applicationId = Number(req?.params?.applicationId!);
    await ApplicationService.deleteApplication({
      role: req?.user?.role!,
      userId: req?.user?.userId!,
      applicationId,
    });

    return ApiResponse.success({
      req,
      res,
      data: null,
      statusCode: StatusCodes.OK,
      message: `Application #${applicationId} deleted`,
      code: ReasonPhrases.NO_CONTENT,
    });
  }

  async reviewApplication(req: Request, res: Response) {
    const applicationId = Number(req?.params?.applicationId!);

    const updatedApplication = await ApplicationService.reviewApplication({
      applicationId,
      role: req?.user?.role!,
      userId: req?.user?.userId!,
      payload: req.body,
    });

    return ApiResponse.success({
      req,
      res,
      data: updatedApplication,
      statusCode: StatusCodes.OK,
      message: `Application #${applicationId} updated`,
      code: ReasonPhrases.OK,
    });
  }
}

export default new ApplicationController();
