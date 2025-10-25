import { type PassportStatic } from "passport";
import {
  Strategy as GoogleStrategy,
  type Profile,
  type VerifyCallback,
} from "passport-google-oauth20";

// config
import { Env } from "@/config";
import type { NormalizedGoogleUser } from "$/src/@types/user";

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
        done: VerifyCallback,
      ) => {
        try {
          console.log(profile);
          const normalizedGoogleUser: NormalizedGoogleUser = {
            firstName: profile.name?.givenName!,
            lastName: profile.name?.familyName!,
            email: profile?.emails?.[0]?.value!,
            provider: "google",
          };

          done(null, normalizedGoogleUser);
        } catch (err) {
          done(err, undefined);
        }
      },
    ),
  );
};

export default googleLoginStrategy;
