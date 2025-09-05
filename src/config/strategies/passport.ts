import passport from "passport";
import jwtStrategy from "./jwt";
import googleLoginStrategy from "./google-login";

// Initialize all strategies
const initializePassport = () => {
  // Pass the passport instance to each strategy setup function
  jwtStrategy(passport);
  googleLoginStrategy(passport);
};

export { passport, initializePassport };
