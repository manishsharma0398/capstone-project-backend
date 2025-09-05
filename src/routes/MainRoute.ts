import type { Request, Response, NextFunction } from "express";

import { Route, Routes } from "@/decorators";
import { MainController } from "@/controllers";

@Routes()
class MainRoutes {
  @Route("get", "/")
  getHome(req: Request, res: Response, _next: NextFunction) {
    return MainController.getHome(req, res, _next);
  }

  @Route("get", "/healthcheck")
  getHealthCheck(req: Request, res: Response, _next: NextFunction) {
    return MainController.getHealthCheck(req, res, _next);
  }
}

export default MainRoutes;
