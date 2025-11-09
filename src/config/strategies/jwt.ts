import { Env } from "../env";
import { type PassportStatic } from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";

const jwtStrategy = (passport: PassportStatic) => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: Env.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          done(null, payload);
        } catch (error) {
          done(error, false);
        }
      },
    ),
  );
};

export default jwtStrategy;
