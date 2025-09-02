import { Env } from "../env";
import type { Request } from "express";
import { type PassportStatic } from "passport";
import { Strategy as JWTStrategy } from "passport-jwt";

const cookiesExtractor = (req: Request) => req.cookies?.jwtToken || null;

const jwtStrategy = (passport: PassportStatic) => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: cookiesExtractor,
        secretOrKey: Env.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          done(null, payload);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
};

export default jwtStrategy;
