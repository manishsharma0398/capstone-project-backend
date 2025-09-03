import type { StringValue } from "ms";
import type { Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";

import { Env } from "@/config";
import { CookieManager, COOKIES } from "./cookieManager";

interface IssueTokenParams {
  res: Response;
  expiresIn?: StringValue | number;
  payload: string | object | Buffer;
  signInOptions?: Omit<SignOptions, "expiresIn">;
}

export class AuthTokenManager {
  static issueToken({
    res,
    payload,
    expiresIn = "1h",
    signInOptions = {},
  }: IssueTokenParams) {
    const options: SignOptions = { expiresIn, ...signInOptions };
    const token = jwt.sign(payload, Env.JWT_SECRET as string, options);

    CookieManager.setCookie(res, COOKIES.JWT_TOKEN, token);

    return token;
  }
}
