import { InferModel } from "drizzle-orm";
import { users } from "@/db/schema";

export type CustomUserData = InferModel<typeof users>;

export interface CustomCookies {
  jwtToken?: string;
  refreshToken?: string;
}

declare global {
  namespace Express {
    interface User extends CustomUserData {}
    interface Cookies extends CustomCookies {}
    interface Request {
      requestId: string;
      user?: User;
      cookies?: Cookies;
    }
  }
}
