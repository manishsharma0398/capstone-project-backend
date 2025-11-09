import type { StringValue } from "ms";
import type { Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";

import { Env } from "@/config";

interface IssueTokenParams {
  res: Response;
  expiresIn?: StringValue | number;
  payload: string | object | Buffer;
  signInOptions?: Omit<SignOptions, "expiresIn">;
}

export class AuthTokenManager {
  static issueToken({
    payload,
    expiresIn = "30d",
    signInOptions = {},
  }: IssueTokenParams) {
    const options: SignOptions = { expiresIn, ...signInOptions };
    const token = jwt.sign(payload, Env.JWT_SECRET as string, options);
    return token;
  }
}
