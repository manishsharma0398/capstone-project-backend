import db from "$/src/db";
import { users } from "$/src/db/schema";
import { type PassportStatic } from "passport";
import {
  Strategy as GoogleStrategy,
  type VerifyCallback,
  type Profile,
} from "passport-google-oauth20";
import { Env } from "../env";

const googleLoginStrategy = (passports: PassportStatic) => {
  passports.use(
    new GoogleStrategy(
      {
        clientID: Env.GOOGLE_CLIENT_ID,
        clientSecret: Env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => {
        try {
          console.log(profile);
          // Find or create user in your DB
          const user = await db
            .insert(users)
            .values({
              firstName: profile.name?.givenName!,
              lastName: profile.name?.familyName!,
              email: profile?.emails?.[0]?.value!,
            })
            .returning();
          done(null, user[0]);
        } catch (err) {
          done(err, undefined);
        }
      }
    )
  );
};

export default googleLoginStrategy;
