import type { Request, Response } from "express";

import { OpenApi, Route, Routes, Validate } from "@/decorators";
import { ApplicationController } from "@/controllers";
import { authenticateJWT, authorizeRoles } from "../middlewares";
import { UserRole } from "../db/schema";
import {
  createApplicationSchemaObject,
  deleteApplicationSchemaObject,
  getAllApplicationsSchemaObject,
  getSingleApplicationSchemaObject,
  listApplicationsByListingSchemaObject,
  listApplicationsByUserSchemaObject,
  reviewApplicationSchemaObject,
} from "../schemas";

@Routes("/application")
class ApplicationRoutes {
  // Volunteer applies for a listing
  @Route("post", "/apply", authenticateJWT, authorizeRoles(UserRole.VOLUNTEER))
  @Validate(createApplicationSchemaObject.schema)
  @OpenApi(createApplicationSchemaObject)
  createApplication(req: Request, res: Response) {
    return ApplicationController.createApplication(req, res);
  }

  // Fetch a single application’s details
  @Route("get", "/:applicationId", authenticateJWT)
  @Validate(getSingleApplicationSchemaObject.schema)
  @OpenApi(getSingleApplicationSchemaObject)
  getSingleApplication(req: Request, res: Response) {
    return ApplicationController.getSingleApplication(req, res);
  }

  // Get all applications for a volunteer
  @Route(
    "get",
    "/user/:userId",
    authenticateJWT,
    authorizeRoles(UserRole.ADMIN, UserRole.VOLUNTEER),
  )
  @Validate(listApplicationsByUserSchemaObject.schema)
  @OpenApi(listApplicationsByUserSchemaObject)
  listApplicationsByUser(req: Request, res: Response) {
    return ApplicationController.listApplicationsByUser(req, res);
  }

  // Get all applications for a specific listing (organization/admin)
  @Route(
    "get",
    "/listing/:listingId",
    authenticateJWT,
    authorizeRoles(UserRole.ADMIN, UserRole.ORGANIZATION),
  )
  @Validate(listApplicationsByListingSchemaObject.schema)
  @OpenApi(listApplicationsByListingSchemaObject)
  listApplicationsByListing(req: Request, res: Response) {
    return ApplicationController.listApplicationsByListing(req, res);
  }

  // Admin lists all applications
  @Route("get", "/", authenticateJWT, authorizeRoles(UserRole.ADMIN))
  @Validate(getAllApplicationsSchemaObject.schema)
  @OpenApi(getAllApplicationsSchemaObject)
  getAllApplications(req: Request, res: Response) {
    return ApplicationController.getAllApplications(req, res);
  }

  // Volunteer withdraws or Admin deletes an application
  @Route(
    "delete",
    "/:applicationId",
    authenticateJWT,
    authorizeRoles(UserRole.ADMIN, UserRole.VOLUNTEER),
  )
  @Validate(deleteApplicationSchemaObject.schema)
  @OpenApi(deleteApplicationSchemaObject)
  deleteApplication(req: Request, res: Response) {
    return ApplicationController.deleteApplication(req, res);
  }

  // Organization/Admin reviews (accepts/rejects) an application
  @Route(
    "patch",
    "/:applicationId",
    authenticateJWT,
    authorizeRoles(UserRole.ADMIN, UserRole.ORGANIZATION),
  )
  @Validate(reviewApplicationSchemaObject.schema)
  @OpenApi(reviewApplicationSchemaObject)
  reviewApplication(req: Request, res: Response) {
    return ApplicationController.reviewApplication(req, res);
  }
}

export default ApplicationRoutes;
