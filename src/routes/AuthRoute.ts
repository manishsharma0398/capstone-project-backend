import passport from "passport";
import type { Request, Response } from "express";

import { OpenApi, Route, Routes, Validate } from "@/decorators";

import { AuthController } from "@/controllers";

import { createUserFromEmailSchema } from "@/schemas";

@Routes("/auth")
class AuthRoutes {
  @Route(
    "get",
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  )
  getGoogleLoginScreen() {}

  @Route(
    "get",
    "/google/callback",
    passport.authenticate("google", { session: false })
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
}

export default AuthRoutes;
