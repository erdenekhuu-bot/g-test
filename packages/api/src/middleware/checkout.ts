import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface CustomRequest extends Request {
    user?: JwtPayload;
}

export class VerifyToken {
    static checkout = async(req: CustomRequest, res: Response, next: NextFunction): Promise<void>=>{
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader?.startsWith('Bearer ')) {
              res.status(401).json({ message: 'Access denied' });
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
                  message: 'Token expired',
                  expired: true
                });
                return;
              }
              res.status(401).json({ 
                message: 'Wrong token',
                expired: false
              });
              return;
            }
          } catch (error) {
            res.status(500).send(error)
            return;
          }
    }
}
