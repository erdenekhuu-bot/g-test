import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { prisma } from "../controller/AuthController";
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface ExpressRequest extends Request {
    user?: User;
  }
  
export class Authentication {
    static layer = async (
      req: ExpressRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const authHeader: any = req.headers.authorization;
  
      if (!authHeader) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const token = authHeader.split(" ")[1];
  
      try {
        const decode = verify(
          token,
          "JWT_SECRET"
        ) as {
          email: string;
        };
        const record: any = await prisma.user.findUnique({
          where: { email: decode.email },
        });
        req.user = record;
        next();
      } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
      }
    };
  }

export interface CustomRequest extends Request {
  user?: JwtPayload;
}

export const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Access denied. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'JWT_SECRET'
      ) as JwtPayload;

      req.user = decoded;
      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ 
          message: 'Token has expired',
          expired: true
        });
        return;
      }
      
      res.status(401).json({ 
        message: 'Invalid token',
        expired: false
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};