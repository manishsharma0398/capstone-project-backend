import type { Request, Response } from "express";

import { OpenApi, Route, Routes, Validate } from "@/decorators";

import { mediaPresignSchema } from "../schemas";
import { MediaController } from "../controllers";

@Routes("/media")
class MediaRoutes {
  @Route("post", "/presign")
  @Validate(mediaPresignSchema.schema)
  @OpenApi(mediaPresignSchema)
  handleGetUserSkills(req: Request, res: Response) {
    return MediaController.getPresignedUrls(req, res);
  }
}

export default MediaRoutes;
