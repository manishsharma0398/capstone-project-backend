import passport from "passport";
import { Router } from "express";
import validate from "express-zod-safe";

// controller
import {
  logOut,
  googleCallback,
  loginWithEmail,
  registerWithEmail,
} from "@/controllers";

// utils
import { registry } from "@/utils";

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
  registerWithEmail
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

router.post("/login", loginWithEmail);

router.post("/logout", logOut);

export default router;
