import passport from "passport";
import type { Request, Response } from "express";

import { OpenApi, Route, Routes, Validate } from "@/decorators";

import { AuthController } from "@/controllers";

import {
  setNewPassword,
  resetPasswordToken,
  createUserFromEmailSchema,
} from "@/schemas";

@Routes("/auth")
class AuthRoutes {
  @Route(
    "get",
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
  )
  getGoogleLoginScreen() {}

  @Route(
    "get",
    "/google/callback",
    passport.authenticate("google", { session: false }),
  )
  getGoogleCallback(req: Request, res: Response) {
    return AuthController.googleCallback(req, res);
  }

  @Route("post", "/login")
  handleLoginWithEmail(req: Request, res: Response) {
    return AuthController.loginWithEmail(req, res);
  }

  @Route("post", "/register/email")
  @Validate(createUserFromEmailSchema.schema)
  @OpenApi(createUserFromEmailSchema)
  handleRegisterWithEmail(req: Request, res: Response) {
    return AuthController.registerWithEmail(req, res);
  }

  @Route("post", "/logout")
  handleLogout(req: Request, res: Response) {
    return AuthController.logOut(req, res);
  }

  @Route("post", "/forgot-password")
  @Validate(resetPasswordToken.schema)
  @OpenApi(resetPasswordToken)
  handleForgotPasswordToken(req: Request, res: Response) {
    return AuthController.generateForgotPasswordToken(req, res);
  }

  @Route("post", "/reset-password")
  @Validate(setNewPassword.schema)
  @OpenApi(setNewPassword)
  handleResetPassword(req: Request, res: Response) {
    return AuthController.resetPassword(req, res);
  }
}

export default AuthRoutes;
