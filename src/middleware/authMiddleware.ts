
import { Request, Response, NextFunction } from "express";
import { IJWTService } from "../utils/interface.JwtService";

export class AuthMiddleware {
  constructor(private  jwtService: IJWTService) {}

  use = (req: Request, res: Response, next: NextFunction) => {
    try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = this.jwtService.verifyAccessToken(token);
      req.user = payload; 
      next();
    } catch (error) {
      return res.status(401).json({message: "Access token expired or invalid",code: "ACCESS_TOKEN_EXPIRED"});
    }
  } catch (error) {
      console.log("error from authentication middleware",error)
    }
  }
}

