import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

// config
import { Env } from "@/config";

// utils
import { AppError, CookieManager, COOKIES } from "@/utils";

export const googleCallback = (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError({
      message: "Unauthorized - No user found",
      code: ReasonPhrases.UNAUTHORIZED,
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }

  const token = jwt.sign({ sub: req.user.id }, Env.JWT_SECRET, {
    expiresIn: 60 * 60, // 1hr
  });

  CookieManager.setCookie(res, COOKIES.ACCESS_TOKEN, token);

  return res.redirect(
    `${Env.CLIENT_BASE_URL}/success-google-login?access_token=${token}`
  );
};
