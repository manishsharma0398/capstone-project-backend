import type { Request, Response } from "express";

import { OpenApi, Route, Routes, Validate } from "@/decorators";
import { ListingController } from "@/controllers";
import { authenticateJWT, authorizeRoles } from "../middlewares";
import { UserRole } from "../db/schema";

@Routes("/listings")
class MainRoutes {
  // TODO: protected route only for organizations and admin
  @Route(
    "post",
    "/new",
    authenticateJWT,
    authorizeRoles(UserRole.ADMIN, UserRole.ORGANIZATION),
  )
  // @Validate(createUserFromEmailSchema.schema)
  // @OpenApi(createUserFromEmailSchema)
  handleCreateNewListing(req: Request, res: Response) {
    return ListingController.createNewListing(req, res);
  }
}

export default MainRoutes;
