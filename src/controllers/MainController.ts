import type { Request, Response, NextFunction } from "express";

// utils
import { ApiResponse } from "@/utils";

class MainController {
  getHome(req: Request, res: Response, _next: NextFunction) {
    return ApiResponse.success({
      req,
      res,
      message: "Hello from Community Connect Server!",
    });
  }

  getHealthCheck(req: Request, res: Response, _next: NextFunction) {
    return ApiResponse.success({
      data: {
        status: "ok",
        timestamp: new Date(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
      req,
      res,
      message: "Health Check OK",
    });
  }
}

export default new MainController();
