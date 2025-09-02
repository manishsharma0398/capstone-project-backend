import { InferModel } from "drizzle-orm";

import { users } from "@/db/schema";

import type { CookieData } from "@/utils/cookieManager";

export type CustomUserData = InferModel<typeof users>;

declare global {
  namespace Express {
    interface User extends CustomUserData {}
    interface Request {
      startTime: number;
      requestId: string;
      user?: User;
      cookies?: Record<string, string | undefined> & CookieData;
      signedCookies?: Record<string, string | undefined> & Partial<CookieData>;
    }
  }
}

declare module "express" {
  interface Request {
    cookies?: Record<string, string | undefined> & CookieData;
    signedCookies?: Record<string, string | undefined> & Partial<CookieData>;
  }
}

// Also try extending the core module
declare module "express-serve-static-core" {
  interface Request {
    cookies?: Record<string, string | undefined> & CookieData;
    signedCookies?: Record<string, string | undefined> & Partial<CookieData>;
  }
}
