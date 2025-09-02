import { parse as parseCookie } from "cookie";
import type { Request, Response, NextFunction } from "express";

// utils
import type { CookieData } from "@/utils/cookieManager";

export const cookieMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.cookie || "";
  const parsed = parseCookie(header);

  const cleanCookies = Object.fromEntries(
    Object.entries(parsed).filter(([_, value]) => value !== undefined)
  ) as Record<string, string | undefined> & CookieData;

  req.cookies = cleanCookies;

  next();
};
