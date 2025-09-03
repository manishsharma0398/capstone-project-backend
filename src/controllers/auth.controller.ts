import type { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

// config
import { Env } from "@/config";

// services
import { AuthService } from "@/services";

// utils
import {
  AppError,
  ApiResponse,
  CookieManager,
  AuthTokenManager,
  CustomStatusCodes,
} from "@/utils";

export const googleCallback = async (req: Request, res: Response) => {
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
      sub: user.id,
      role: user.role,
      provider: user.provider,
    },
    res,
  });

  const redirectUrl = `${Env.CLIENT_BASE_URL}/success-google?access_token=${token}&newUser=${isNewUser}`;

  return res.redirect(redirectUrl);
};

export const loginWithEmail = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await AuthService.loginWithEmail(email, password);

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
    message: "Successfully logged in",
  });
};

export const registerWithEmail = async (req: Request, res: Response) => {
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
};

export const logOut = async (req: Request, res: Response) => {
  CookieManager.clearAuthCookies(res);

  return ApiResponse.success({
    req,
    res,
    statusCode: StatusCodes.NO_CONTENT,
    message: "Logged out successfully",
    code: CustomStatusCodes.USER_LOGGED_OUT,
  });
};
