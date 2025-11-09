import type { Request, Response } from "express";

import { OpenApi, Route, Routes, Validate } from "@/decorators";
import { ListingController } from "@/controllers";
import { authenticateJWT, authorizeRoles } from "../middlewares";
import { UserRole } from "../db/schema";
import {
  createNewListingSchema,
  deleteListing,
  getAllListing,
  getListing,
  getOrganizationListing,
  getUserSkills,
  searchSkills,
  updateListing,
} from "../schemas";
import SkillsController from "../controllers/SkillsController";

@Routes("/skill")
class SkillRoutes {
  //   @Route("get", "/", authenticateJWT, authorizeRoles(UserRole.ADMIN))
  //   @Validate(getAllListing.schema)
  //   @OpenApi(getAllListing)
  //   handleGetAllListings(req: Request, res: Response) {
  //     return ListingController.getAllListing(req, res);
  //   }
  //   @Route(
  //     "post",
  //     "/new",
  //     authenticateJWT,
  //     authorizeRoles(UserRole.ADMIN, UserRole.ORGANIZATION)
  //   )
  //   @Validate(createNewListingSchema.schema)
  //   @OpenApi(createNewListingSchema)
  //   handleCreateNewListing(req: Request, res: Response) {
  //     return ListingController.createNewListing(req, res);
  //   }

  @Route("get", "/search")
  @Validate(searchSkills.schema)
  @OpenApi(searchSkills)
  handleSearchSkills(req: Request, res: Response) {
    return SkillsController.searchASkill(req, res);
  }

  @Route("get", "/:userId")
  @Validate(getUserSkills.schema)
  @OpenApi(getUserSkills)
  handleGetUserSkills(req: Request, res: Response) {
    return SkillsController.getUserSkills(req, res);
  }

  //   @Route("get", "/:listingId")
  //   @Validate(getListing.schema)
  //   @OpenApi(getListing)
  //   handleGetListingDetails(req: Request, res: Response) {
  //     return ListingController.getListingDetails(req, res);
  //   }
  //   @Route(
  //     "patch",
  //     "/:listingId",
  //     authenticateJWT,
  //     authorizeRoles(UserRole.ADMIN, UserRole.ORGANIZATION)
  //   )
  //   @Validate(updateListing.schema)
  //   @OpenApi(updateListing)
  //   handleUpdateListing(req: Request, res: Response) {
  //     return ListingController.updateListing(req, res);
  //   }
  //   @Route(
  //     "delete",
  //     "/:listingId",
  //     authenticateJWT,
  //     authorizeRoles(UserRole.ADMIN, UserRole.ORGANIZATION)
  //   )
  //   @Validate(deleteListing.schema)
  //   @OpenApi(deleteListing)
  //   handleDeleteListing(req: Request, res: Response) {
  //     return ListingController.deleteListing(req, res);
  //   }
}

export default SkillRoutes;
