import type { Request } from "express";
import { type PassportStatic } from "passport";
import { Strategy as JWTStrategy } from "passport-jwt";
import { Env } from "../env";

const cookiesExtractor = (req: Request) => req.cookies?.jwtToken;

const jwtStrategy = (passport: PassportStatic) => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: cookiesExtractor,
        secretOrKey: Env.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          // payload contains the decoded JWT

          // const userId = payload.sub as number;

          done(null, payload);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
};

export default jwtStrategy;
