import type { Request, Response } from "express";

import { OpenApi, Route, Routes, Validate } from "@/decorators";
import { ListingController } from "@/controllers";
import { authenticateJWT, authorizeRoles } from "../middlewares";
import { UserRole } from "../db/schema";
import {
  createNewListingSchema,
  deleteListing,
  getAdminListing,
  getAllListing,
  getListing,
  getOrganizationListing,
  updateListing,
} from "../schemas";

@Routes("/listings")
class ListingRoutes {
  @Route(
    "post",
    "/new",
    authenticateJWT,
    authorizeRoles(UserRole.ADMIN, UserRole.ORGANIZATION),
  )
  @Validate(createNewListingSchema.schema)
  @OpenApi(createNewListingSchema)
  handleCreateNewListing(req: Request, res: Response) {
    return ListingController.createNewListing(req, res);
  }

  // public
  @Route("get", "/")
  @Validate(getAllListing.schema)
  @OpenApi(getAllListing)
  handleGetAllListings(req: Request, res: Response) {
    return ListingController.getAllListing(req, res);
  }

  @Route(
    "get",
    "/organization",
    authenticateJWT,
    authorizeRoles(UserRole.ORGANIZATION),
  )
  @Validate(getOrganizationListing.schema)
  @OpenApi(getOrganizationListing)
  handleGetOrganizationListings(req: Request, res: Response) {
    return ListingController.getOrganizationListing(req, res);
  }

  @Route("get", "/admin", authenticateJWT, authorizeRoles(UserRole.ADMIN))
  @Validate(getAdminListing.schema)
  @OpenApi(getAdminListing)
  handleGetAdminListings(req: Request, res: Response) {
    return ListingController.getAllListing(req, res);
  }

  @Route("get", "/:listingId")
  @Validate(getListing.schema)
  @OpenApi(getListing)
  handleGetListingDetails(req: Request, res: Response) {
    return ListingController.getListingDetails(req, res);
  }

  @Route(
    "patch",
    "/:listingId",
    authenticateJWT,
    authorizeRoles(UserRole.ADMIN, UserRole.ORGANIZATION),
  )
  @Validate(updateListing.schema)
  @OpenApi(updateListing)
  handleUpdateListing(req: Request, res: Response) {
    return ListingController.updateListing(req, res);
  }

  @Route(
    "delete",
    "/:listingId",
    authenticateJWT,
    authorizeRoles(UserRole.ADMIN, UserRole.ORGANIZATION),
  )
  @Validate(deleteListing.schema)
  @OpenApi(deleteListing)
  handleDeleteListing(req: Request, res: Response) {
    return ListingController.deleteListing(req, res);
  }
}

export default ListingRoutes;
