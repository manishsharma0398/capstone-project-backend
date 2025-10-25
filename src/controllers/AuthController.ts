import type { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import {
  AppError,
  ApiResponse,
  CookieManager,
  AuthTokenManager,
  CustomStatusCodes,
} from "@/utils";
import { Env } from "@/config";
import { AuthService } from "@/services";
import type { NormalizedGoogleUser } from "../@types/user";

class AuthController {
  async googleCallback(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError({
        message: "Unauthorized - No user found",
        code: ReasonPhrases.UNAUTHORIZED,
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const values = req.user as NormalizedGoogleUser;

    const { isNewUser, user } = await AuthService.handleGoogleUser(values);

    const token = AuthTokenManager.issueToken({
      payload: {
        userId: user.id,
        role: user.role,
        provider: user.provider,
      },
      res,
    });

    const redirectUrl = `${Env.CLIENT_BASE_URL}/success-google?access_token=${token}&newUser=${isNewUser}`;

    return res.redirect(redirectUrl);
  }

  async loginWithEmail(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await AuthService.loginWithEmail(email, password);

    const token = AuthTokenManager.issueToken({
      payload: {
        userId: user.id,
        role: user.role,
        provider: user.provider,
      },
      res,
    });

    return ApiResponse.success({
      req,
      res,
      data: token,
      message: "Successfully logged in",
    });
  }

  async registerWithEmail(req: Request, res: Response) {
    const user = await AuthService.registerWithEmail(req.body);

    AuthTokenManager.issueToken({
      payload: {
        sub: user.id,
        role: user.role,
        provider: user.provider,
      },
      res,
    });

    return ApiResponse.success({
      req,
      res,
      data: user,
      statusCode: StatusCodes.CREATED,
      message: "User created Successfully",
      code: CustomStatusCodes.USER_SUCCESSFULLY_CREATED,
    });
  }

  async logOut(req: Request, res: Response) {
    CookieManager.clearAuthCookies(res);

    return ApiResponse.success({
      req,
      res,
      statusCode: StatusCodes.NO_CONTENT,
      message: "Logged out successfully",
      code: CustomStatusCodes.USER_LOGGED_OUT,
    });
  }
}

export default new AuthController();
