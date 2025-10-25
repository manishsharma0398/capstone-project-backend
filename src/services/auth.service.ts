import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";

// db
import db from "@/db";
import { ApplicationStatus, users, Providers, UserRole } from "@/db/schema";

// utils
import { AppError, CustomStatusCodes } from "@/utils";
import type { NormalizedGoogleUser } from "../@types/user";

export class AuthService {
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

    if (user.provider !== Providers.LOCAL) {
      throw new AppError({
        message:
          user.provider === Providers.GOOGLE
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
    role?: ApplicationStatus;
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

    const passwordHash = await argon2.hash(data.password);

    const [user] = await db
      .insert(users)
      .values({
        ...data,
        passwordHash,
        provider: Providers.LOCAL,
        role: data?.role || UserRole.VOLUNTEER,
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
}
