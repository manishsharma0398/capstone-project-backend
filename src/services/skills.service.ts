import { eq, sql } from "drizzle-orm";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

// db
import db from "@/db";
import { listings, skills, UserRole, userSkills } from "@/db/schema";

// utils
import { AppError, CustomStatusCodes } from "@/utils";

export class SkillService {
  static async createNewSkill(data: { title: string; description: string }) {
    const skill = await db
      .insert(skills)
      .values({ ...data })
      .returning();

    if (!skill) {
      throw new AppError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: CustomStatusCodes.LISTING_FAILED_TO_CREATE,
        message: "Failed to create skills",
      });
    }

    return skill;
  }

  static async getAllSkills(data: { offset: number; limit: number }) {
    const query = sql`
      WITH data AS (
        SELECT * FROM ${skills}
        ORDER BY id ASC
        LIMIT ${data.limit} OFFSET ${data.offset}
      )
      SELECT json_build_object(
        'items', json_agg(data.*),
        'total', (SELECT COUNT(*)::int FROM ${skills})
      )::json AS result
      FROM data;
      `;

    const allSkills = await db.execute(query);

    if (!allSkills) {
      throw new AppError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "Error getting all skills",
      });
    }

    // Parse JSON string manually
    const parsed = allSkills.rows?.[0]?.result ?? {
      items: [],
      total: 0,
    };

    return parsed;
  }

  static async getUserSkills(data: {
    offset: number;
    limit: number;
    userId: number;
  }) {
    const query = sql`
      WITH data AS (
        SELECT * 
        FROM ${userSkills}
        WHERE user_id = ${data.userId}
        ORDER BY id ASC
        LIMIT ${data.limit} 
        OFFSET ${data.offset}
      )
      SELECT json_build_object(
        'items', json_agg(data.*),
        'total', (
          SELECT COUNT(*)::int 
          FROM ${userSkills} 
          WHERE user_id = ${data.userId}
        )
      )::json AS result
      FROM data;
    `;

    const userAllSkills = await db.execute(query);

    if (!userAllSkills) {
      throw new AppError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "Failed getting organization listing",
      });
    }

    // Parse JSON string manually
    const parsed = userAllSkills.rows?.[0]?.result ?? {
      items: [],
      total: 0,
    };

    return parsed;
  }

  static async searchASkill(data: { query: string }) {
    try {
      const pattern = `%${data.query}%`;

      // safer: use Drizzle SQL template with parameter binding
      const result = await db.execute(
        sql`
          SELECT id,title
          FROM ${skills}
          WHERE ${skills.title} ILIKE ${pattern}
          ORDER BY ${skills.title} ASC
          LIMIT 48;
        `,
      );

      if (!result?.rows?.length) {
        return {
          items: [],
          total: 0,
        };
      }

      return {
        items: result.rows,
        total: result.rows.length,
      };
    } catch (error) {
      throw new AppError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "Failed searching skills",
      });
    }
  }

  static async updateSkill(data: {
    listingId: number;
    role: UserRole;
    userId: number;
    payload: Partial<typeof listings.$inferInsert>;
  }) {
    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, data.listingId),
      columns: {
        organizationId: true,
      },
    });

    if (!listing) {
      throw new AppError({
        statusCode: StatusCodes.NOT_FOUND,
        code: ReasonPhrases.NOT_FOUND,
        message: "Listing not found",
      });
    }

    if (
      data.role !== UserRole.ADMIN &&
      listing.organizationId !== data.userId
    ) {
      throw new AppError({
        statusCode: StatusCodes.FORBIDDEN,
        code: ReasonPhrases.FORBIDDEN,
        message: "You don’t have permission to update this listing.",
      });
    }

    const [updatedListing] = await db
      .update(listings)
      .set(data.payload)
      .where(eq(listings.id, data.listingId))
      .returning();

    if (!updatedListing) {
      throw new AppError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "Error updating listing.",
      });
    }

    return updatedListing;
  }

  static async deleteSkill(data: {
    listingId: number;
    role: UserRole;
    userId: number;
  }) {
    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, data.listingId),
      columns: {
        organizationId: true,
        id: true,
      },
    });

    if (!listing) {
      throw new AppError({
        statusCode: StatusCodes.NOT_FOUND,
        code: ReasonPhrases.NOT_FOUND,
        message: "Listing not found",
      });
    }

    if (
      data.role !== UserRole.ADMIN &&
      listing.organizationId !== data.userId
    ) {
      throw new AppError({
        statusCode: StatusCodes.FORBIDDEN,
        code: ReasonPhrases.FORBIDDEN,
        message: "You don’t have permission to delete it.",
      });
    }

    const deleted = await db
      .delete(listings)
      .where(eq(listings.id, data.listingId));

    if (!deleted) {
      throw new AppError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "Error deleting listing.",
      });
    }

    return;
  }
}
