import type { Response } from "express";
import { Env } from "../config";

export interface CookieData {
  jwtToken?: string;
  accessToken?: string;
  refreshToken?: string;
  [key: string]: string | undefined;
}

export enum COOKIES {
  JWT_TOKEN = "jwtToken",
  ACCESS_TOKEN = "accessToken",
  REFRESH_TOKEN = "refreshToken",
}

const authCookieNames: (keyof CookieData)[] = [
  COOKIES.ACCESS_TOKEN,
  COOKIES.JWT_TOKEN,
  COOKIES.REFRESH_TOKEN,
];

export class CookieManager {
  /**
   * Set a cookie with proper typing
   */
  static setCookie(
    res: Response,
    name: keyof CookieData,
    value: string,
    options: any = {}
  ): void {
    res.cookie(String(name), value, {
      httpOnly: true,
      secure: Env.NODE_ENV === "production",
      sameSite: "lax",
      ...options,
    });
  }

  /**
   * Set multiple cookies at once
   */
  static setCookies(res: Response, cookies: Partial<CookieData>): void {
    Object.entries(cookies).forEach(([name, value]) => {
      if (value !== undefined) {
        this.setCookie(res, name as keyof CookieData, value);
      }
    });
  }

  /**
   * Remove a cookie
   */
  static removeCookie(res: Response, name: keyof CookieData): void {
    res.clearCookie(String(name));
  }

  /**
   * Clear all authentication cookies (logout)
   */
  static clearAuthCookies(res: Response): void {
    authCookieNames.forEach((name) => {
      this.removeCookie(res, name);
    });
  }
}
