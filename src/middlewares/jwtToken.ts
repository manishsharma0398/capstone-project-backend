import passport from "passport";
import type { Request, Response, NextFunction } from "express";

// Basic JWT protection middleware
export const authenticateJWT = passport.authenticate("jwt", { session: false });

// Role-based guard
export const authorizeRoles =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { id: number; role: string } | undefined;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient privileges" });
    }

    return next();
  };
