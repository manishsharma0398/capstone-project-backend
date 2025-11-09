import type { Request, Response } from "express";
import { ApiResponse } from "@/utils";
import { StatusCodes } from "http-status-codes";
import { MediaService } from "../services";

class MediaController {
  async getPresignedUrls(req: Request, res: Response) {
    try {
      const { files } = req.body;

      const urls = await MediaService.generatePresignedUrls(files);

      return ApiResponse.success({
        req,
        res,
        data: { urls },
        statusCode: StatusCodes.OK,
        message: "Presigned URLs generated successfully",
      });
    } catch (error: any) {
      return ApiResponse.error({
        req,
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to generate presigned URLs",
      });
    }
  }
}

export default new MediaController();
