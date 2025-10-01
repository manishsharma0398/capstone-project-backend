import crypto from "crypto";
import argon2 from "argon2";
import { desc, eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";

// db
import db from "@/db";
import { users, verifications, type RoleType } from "@/db/schema";

// config
import { logger } from "@/config";

// utils
import { AppError, CustomStatusCodes } from "@/utils";

export class AuthService {
  static async generatePasswordHash(rawPassword: string) {
    return argon2.hash(rawPassword);
  }

  static async handleGoogleUser(values: NormalizedGoogleUser) {
    const [user] = await db
      .insert(users)
      .values(values)
      .onConflictDoNothing({ target: users.email })
      .returning({ id: users.id, role: users.role, provider: users.provider });

    if (user) {
      return { user, isNewUser: true } as const;
    }

    // Already exists, fetch
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, values.email),
      columns: { id: true, role: true, provider: true },
    });

    if (!existingUser) {
      throw new AppError({
        code: CustomStatusCodes.DB_ERROR,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Database inconsistency: user not found after conflict",
      });
    }

    return { user: existingUser, isNewUser: false } as const;
  }

  static async loginWithEmail(email: string, password: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new AppError({
        message: "User not found",
        code: CustomStatusCodes.USER_DOES_NOT_EXIST,
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    if (user.provider !== "local") {
      throw new AppError({
        message:
          user.provider === "google"
            ? "Please login with Google"
            : "Please login with Phone",
        code: CustomStatusCodes.INVALID_LOGIN_METHOD,
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    if (!user.passwordHash) {
      throw new AppError({
        message: "Account misconfigured, contact support",
        code: CustomStatusCodes.DB_ERROR,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    const isPasswordCorrect = await argon2.verify(user.passwordHash, password);

    if (!isPasswordCorrect) {
      throw new AppError({
        message: "Wrong password",
        code: CustomStatusCodes.INVALID_PASSWORD,
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const { passwordHash, ...rest } = user;
    return rest;
  }

  static async registerWithEmail(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: RoleType;
  }) {
    const userExists = await db.query.users.findFirst({
      where: eq(users.email, data.email!),
      columns: { id: true },
    });

    if (userExists) {
      throw new AppError({
        statusCode: StatusCodes.CONFLICT,
        code: CustomStatusCodes.USER_ALREADY_EXISTS,
        message: "User Already registered. Please login",
      });
    }

    const passwordHash = await this.generatePasswordHash(data.password);

    const [user] = await db
      .insert(users)
      .values({
        ...data,
        passwordHash,
        provider: "local",
        role: data?.role || "volunteer",
      })
      .returning({
        id: users.id,
        role: users.role,
        email: users.email,
        lastName: users.lastName,
        provider: users.provider,
        firstName: users.firstName,
      });

    if (!user) {
      throw new AppError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: CustomStatusCodes.USER_FAILED_TO_CREATE,
        message: "Failed to create user",
      });
    }

    return user;
  }

  static async generateForgotPasswordToken(data: { email: string }) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email!),
      columns: { id: true },
    });

    if (!user) {
      throw new AppError({
        message: "User not found",
        statusCode: StatusCodes.NOT_FOUND,
        code: CustomStatusCodes.USER_DOES_NOT_EXIST,
      });
    }

    const verificationRow = await db.query.verifications.findFirst({
      where: eq(verifications.userId, user.id),
      orderBy: [desc(verifications.createdAt)],
    });

    // create new otp token if existing otp is expired or no verification row
    if (
      !verificationRow ||
      verificationRow.isUsed ||
      verificationRow?.expiresAt < new Date(Date.now())
    ) {
      const token = crypto.randomBytes(64).toString("hex");

      const otp = await db
        .insert(verifications)
        .values({ type: "password_reset", userId: user.id, token })
        .returning()
        .then((r) => r?.[0]);

      if (!otp) {
        throw new AppError({
          message: "Failed to create password reset token",
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          code: CustomStatusCodes.PASSWORD_RESET_TOKEN_FAILED_TO_CREATE,
        });
      }

      // mail new otp
      return otp;
    }

    logger.info(`resending password reset token`, { userId: user.id });

    // mail old otp again
    // resend the existing token
    return verificationRow;
  }

  static async resetPassword(data: { password: string; token: string }) {
    const currentTimeStamp = Date.now();

    const verification = await db.query.verifications.findFirst({
      where: (verificationTable, { eq, and, gte }) =>
        and(
          eq(verificationTable.token, data.token),
          eq(verificationTable.isUsed, false),
          gte(verificationTable.expiresAt, new Date(currentTimeStamp)),
        ),
      columns: { id: true, userId: true },
    });

    if (!verification) {
      throw new AppError({
        message: "Invalid or expired token",
        statusCode: StatusCodes.BAD_REQUEST,
        code: CustomStatusCodes.INVALID_TOKEN,
      });
    }

    const newPasswordHash = await this.generatePasswordHash(data.password);

    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ passwordHash: newPasswordHash })
        .where(eq(users.id, verification.userId));

      await tx
        .update(verifications)
        .set({
          isUsed: true,
          // usedAt: new Date(currentTimeStamp)
        })
        .where(eq(verifications.id, verification.id));
    });

    return true;
  }
}
