// src/passport/index.ts
import passport from "passport";
import jwtStrategy from "./jwt";
import googleLoginStrategy from "./google-login";

// Initialize all strategies
export const initializePassport = () => {
  // Pass the passport instance to each strategy setup function
  jwtStrategy(passport);
  googleLoginStrategy(passport);
};

export default passport;
