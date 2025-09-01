import argon2 from "argon2";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Router } from "express";
import { eq } from "drizzle-orm";
import validate from "express-zod-safe";
import { StatusCodes } from "http-status-codes";

// db
import db from "@/db";
import { users } from "@/db/schema/user";

// controller
import { googleCallback } from "@/controllers";

// configs
import { Env } from "@/config";

// utils
import { ApiResponse, AppError, CustomStatusCodes, registry } from "@/utils";

// schemas
import { createUserFromEmailSchema } from "@/schemas";

const router = Router();

// Register your routes
registry.registerPath({
  method: "post",
  path: "/register",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createUserFromEmailSchema.body!,
        },
      },
    },
  },
  responses: {
    201: {
      description: "User successfully created",
      content: {
        "application/json": {
          schema: createUserFromEmailSchema.body!,
        },
      },
    },
  },
});

router.post(
  "/register/email",
  validate(createUserFromEmailSchema),
  async (req, res) => {
    const userExists = await db.query.users.findFirst({
      where: eq(users.email, req.body.email!),
      columns: { id: true },
    });

    if (userExists) {
      throw new AppError({
        statusCode: StatusCodes.CONFLICT,
        code: CustomStatusCodes.USER_ALREADY_EXISTS,
        message: "User Already registered. Please login",
      });
    }

    const passwordHash = await argon2.hash(req.body.password);

    const [user] = await db
      .insert(users)
      .values({ ...req.body, provider: "local", passwordHash })
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        provider: users.provider,
      });

    const token = jwt.sign(
      {
        sub: user?.id,
        role: user?.role,
        provider: user?.provider,
      },
      Env.JWT_SECRET,
      {
        expiresIn: "1hr",
      }
    );

    res.cookie("jwt-token", token, {
      httpOnly: true,
      secure: Env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1hr
    });

    return ApiResponse.success({
      req,
      res,
      data: user!,
      statusCode: StatusCodes.CREATED,
      message: "User created Successfully",
      code: CustomStatusCodes.USER_SUCCESSFULLY_CREATED,
    });
  }
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

// router.get("/user", passport.authenticate("jwt", { session: false }));

router.post("/logout", (_req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  return res.status(200).json({ message: "Logged out successfully" });
});

export default router;
