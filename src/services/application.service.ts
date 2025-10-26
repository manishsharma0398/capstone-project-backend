import { eq, sql } from "drizzle-orm";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

// db
import db from "@/db";
import {
  applications,
  ApplicationStatus,
  listings,
  ListingStatus,
  UserRole,
  users,
} from "@/db/schema";

// utils
import { AppError, CustomStatusCodes } from "@/utils";

export class ApplicationService {
  static async createApplication(data: {
    listingId: number;
    volunteerId: number;
    message: string;
  }) {
    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, data.listingId),
    });

    if (!listing) {
      throw new AppError({
        statusCode: StatusCodes.NOT_FOUND,
        code: CustomStatusCodes.LISTING_NOT_FOUND,
        message: `The listing #${data.listingId} does not exist`,
      });
    }

    if (listing.listingStatus !== ListingStatus.ACTIVE) {
      throw new AppError({
        statusCode: StatusCodes.BAD_REQUEST,
        code: CustomStatusCodes.LISTING_NOT_ACTIVE,
        message: `The listing #${data.listingId} is not accepting new applications`,
      });
    }

    const [application] = await db
      .insert(applications)
      .values({
        ...data,
      })
      .onConflictDoNothing({
        target: [applications.listingId, applications.volunteerId],
      })
      .returning();

    if (!application) {
      throw new AppError({
        statusCode: StatusCodes.CONFLICT,
        code: CustomStatusCodes.ALREADY_APPLIED,
        message: "You have already applied for this listing.",
      });
    }

    return application;
  }

  static async getApplicationById(data: { applicationId: number }) {
    const application = await db.query.applications.findFirst({
      where: eq(applications.id, data.applicationId),
    });

    if (!application) {
      throw new AppError({
        statusCode: StatusCodes.NOT_FOUND,
        code: CustomStatusCodes.LISTING_NOT_FOUND,
        message: `The application #${data.applicationId} does not exist`,
      });
    }

    return application;
  }

  static async listApplicationsByUser(data: {
    offset: number;
    limit: number;
    queriedUserId: number;
    loggedInUserId: number;
    role: UserRole;
  }) {
    if (
      data.role !== UserRole.ADMIN &&
      data.loggedInUserId !== data.queriedUserId
    ) {
      throw new AppError({
        statusCode: StatusCodes.FORBIDDEN,
        code: ReasonPhrases.FORBIDDEN,
        message: "You are not authorized to view other users' applications.",
      });
    }

    const userExists = await db.query.users.findFirst({
      where: eq(users.id, data.queriedUserId),
      columns: { id: true },
    });

    if (!userExists) {
      throw new AppError({
        statusCode: StatusCodes.NOT_FOUND,
        code: ReasonPhrases.NOT_FOUND,
        message: `User #${data.queriedUserId} not found.`,
      });
    }

    const query = sql`
      WITH data AS (
        SELECT
          a.*,
          l.id AS listing_id, 
          l.title, 
          l.description, 
          l.listing_type, 
          l.status AS listing_status, 
          l.organization_id, 
          l.location, 
          l.extra_data,
          u.first_name AS organization_first_name,
          u.last_name AS organization_last_name
        FROM ${applications} a
        JOIN ${listings} l ON a.listing_id = l.id
        JOIN ${users} u on l.organization_id = u.id
        WHERE a.volunteer_id = ${data.queriedUserId}
        ORDER BY a.id ASC
        LIMIT ${data.limit} 
        OFFSET ${data.offset}
      )
      SELECT json_build_object(
        'items', json_agg(data),
        'total', (
           SELECT COUNT(*)::int 
            FROM ${applications} a 
            WHERE a.volunteer_id = ${data.queriedUserId}
        )
      )::json AS result
      FROM data;
      `;

    const allApplications = await db.execute(query);

    if (!allApplications) {
      throw new AppError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "Error retrieving applications for the specified user.",
      });
    }

    // Parse JSON string manually
    const parsed = allApplications.rows?.[0]?.result ?? {
      items: [],
      total: 0,
    };

    return parsed;
  }

  static async listApplicationsByListing(data: {
    offset: number;
    limit: number;
    listingId: number;
    userId: number;
    role: UserRole;
  }) {
    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, data.listingId),
    });

    if (!listing) {
      throw new AppError({
        statusCode: StatusCodes.NOT_FOUND,
        code: ReasonPhrases.NOT_FOUND,
        message: `Listing #${data.listingId} not found.`,
      });
    }

    if (
      data.role !== UserRole.ADMIN &&
      data.userId !== listing.organizationId
    ) {
      throw new AppError({
        statusCode: StatusCodes.FORBIDDEN,
        code: ReasonPhrases.FORBIDDEN,
        message:
          "You are not authorized to view applications for this listing.",
      });
    }

    const query = sql`
      WITH data AS (
        SELECT 
          a.*,
          u.first_name AS volunteer_first_name,
          u.last_name AS volunteer_last_name
        FROM ${applications} a
        JOIN ${users} u ON a.volunteer_id = u.id
        WHERE a.listing_id = ${listing.id}
        ORDER BY a.id ASC
        LIMIT ${data.limit} 
        OFFSET ${data.offset}
      )
      SELECT json_build_object(
        'items', json_agg(data),
        'total', (
           SELECT COUNT(*)::int 
            FROM ${applications} a 
            WHERE a.listing_id = ${listing.id}
        )
      )::json AS result
      FROM data;
      `;

    const allApplications = await db.execute(query);

    if (!allApplications) {
      throw new AppError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "Error retrieving applications for this listing.",
      });
    }

    // Parse JSON string manually
    const parsed = allApplications.rows?.[0]?.result ?? {
      items: [],
      total: 0,
    };

    return parsed;
  }

  static async getAllApplications(data: { offset: number; limit: number }) {
    const query = sql`
      WITH data AS (
        SELECT * FROM ${applications}
        ORDER BY id ASC
        LIMIT ${data.limit} OFFSET ${data.offset}
      )
      SELECT json_build_object(
        'items', json_agg(data.*),
        'total', (SELECT COUNT(*)::int FROM ${applications})
      )::json AS result
      FROM data;
      `;

    const allApplications = await db.execute(query);

    if (!allApplications) {
      throw new AppError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "Error getting all applications",
      });
    }

    // Parse JSON string manually
    const parsed = allApplications.rows?.[0]?.result ?? {
      items: [],
      total: 0,
    };

    return parsed;
  }

  static async deleteApplication(data: {
    applicationId: number;
    role: UserRole;
    userId: number;
  }) {
    const application = await db.query.applications.findFirst({
      where: eq(applications.id, data.applicationId),
      columns: {
        volunteerId: true,
        id: true,
        applicationStatus: true,
      },
    });

    if (!application) {
      throw new AppError({
        statusCode: StatusCodes.NOT_FOUND,
        code: ReasonPhrases.NOT_FOUND,
        message: "Application not found",
      });
    }

    if (data.role !== UserRole.ADMIN) {
      if (application.volunteerId !== data.userId) {
        throw new AppError({
          statusCode: StatusCodes.FORBIDDEN,
          code: ReasonPhrases.FORBIDDEN,
          message: "You are not authorized to delete this application",
        });
      }

      if (
        [ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED].includes(
          application.applicationStatus as ApplicationStatus,
        )
      ) {
        throw new AppError({
          statusCode: StatusCodes.BAD_REQUEST,
          code: CustomStatusCodes.CANNOT_DELETE_REVIEWED,
          message: `This application has already been ${application.applicationStatus} and cannot be deleted.`,
        });
      }

      const [updatedApplication] = await db
        .update(applications)
        .set({ applicationStatus: ApplicationStatus.WITHDRAWN })
        .where(eq(applications.id, data.applicationId))
        .returning();

      if (!updatedApplication) {
        throw new AppError({
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          code: ReasonPhrases.INTERNAL_SERVER_ERROR,
          message: "Error withdrawing application.",
        });
      }

      return updatedApplication;
    }

    const deleted = await db
      .delete(applications)
      .where(eq(applications.id, data.applicationId));

    if (!deleted) {
      throw new AppError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "Error deleting application.",
      });
    }

    return;
  }

  static async reviewApplication(data: {
    applicationId: number;
    role: UserRole;
    userId: number;
    payload: Partial<typeof applications.$inferInsert>;
  }) {
    const application = await db.query.applications.findFirst({
      where: eq(applications.id, data.applicationId),
      columns: {
        id: true,
        applicationStatus: true,
        listingId: true,
      },
    });

    if (!application) {
      throw new AppError({
        statusCode: StatusCodes.NOT_FOUND,
        code: ReasonPhrases.NOT_FOUND,
        message: "Application not found",
      });
    }

    if (
      [
        ApplicationStatus.ACCEPTED,
        ApplicationStatus.REJECTED,
        ApplicationStatus.WITHDRAWN,
      ].includes(application.applicationStatus as ApplicationStatus)
    ) {
      throw new AppError({
        statusCode: StatusCodes.BAD_REQUEST,
        code: CustomStatusCodes.ALREADY_REVIEWED,
        message: `This application has already been ${application.applicationStatus} and cannot be reviewed again.`,
      });
    }

    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, application.listingId),
      columns: {
        organizationId: true,
        id: true,
        listingStatus: true,
      },
    });

    if (!listing) {
      throw new AppError({
        statusCode: StatusCodes.NOT_FOUND,
        code: ReasonPhrases.NOT_FOUND,
        message: "Listing not available",
      });
    }

    if (listing.listingStatus !== ListingStatus.ACTIVE) {
      throw new AppError({
        statusCode: StatusCodes.BAD_REQUEST,
        code: CustomStatusCodes.LISTING_NOT_ACTIVE,
        message: "This listing is no longer accepting applications.",
      });
    }

    if (
      data.role !== UserRole.ADMIN &&
      listing.organizationId !== data.userId
    ) {
      throw new AppError({
        statusCode: StatusCodes.FORBIDDEN,
        code: ReasonPhrases.FORBIDDEN,
        message: "You are not authorized to respond to this application",
      });
    }

    const [updatedApplication] = await db
      .update(applications)
      .set({ ...data.payload })
      .where(eq(applications.id, data.applicationId))
      .returning();

    if (!updatedApplication) {
      throw new AppError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "Error updating application.",
      });
    }

    return updatedApplication;
  }
}
