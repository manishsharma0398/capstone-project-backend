import { type PassportStatic } from "passport";
import {
  Strategy as GoogleStrategy,
  type VerifyCallback,
  type Profile,
} from "passport-google-oauth20";

// db
import db from "@/db";
import { users } from "@/db/schema";

// config
import { Env } from "@/config";

const googleLoginStrategy = (passports: PassportStatic) => {
  passports.use(
    new GoogleStrategy(
      {
        clientID: Env.GOOGLE_CLIENT_ID,
        clientSecret: Env.GOOGLE_CLIENT_SECRET,
        callbackURL: Env.GOOGLE_CALLBACK_URL,
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
              provider: "google",
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
