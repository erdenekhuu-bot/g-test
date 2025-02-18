import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from "../type/type";

import { APP_SECRET_KEY } from "../config/config";
export interface CustomRequest extends Request {
  user?: JwtPayload;
}

export const VerifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({
        success: false,
        message: "invalid token",
      });
      return;
    }
    const decoded = jwt.verify(token, APP_SECRET_KEY, { complete: true });

    const { payload } = decoded;

    if (typeof payload == "string") {
      res.status(401).json({
        success: false,
        message: "Please authenticate",
      });
      return;
    }
    (req as AuthRequest).token = payload;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err,
    });
  }
};
