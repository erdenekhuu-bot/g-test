import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import { prisma } from "./AuthController";
import { CustomRequest } from "../middleware/middle";

const prismaClient = new PrismaClient();

const zahiral = Joi.object({
    name: Joi.string().email().required(),
    position: Joi.string().required(),
    role: Joi.string().min(6).required(),
    id: Joi.string().optional(),
});

export class Document {
    static zahiral = async (req: Request, res: Response): Promise<void> => {
       try {
        const { error, value } = zahiral.validate(req.body);
        const { name, position, role, id } = value;
        const user = await prismaClient.user.findUnique({
          where: { id: id },
        });
         res.send(value)
       } catch (error) {
          
       }
      };

  static list = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      // Access the authenticated user's ID from the token
      // const userId = req.user?.userId;
      const documents = await prisma.user.findMany()
      // const documents = await prismaClient.document.findMany({
      //   where: {
      //     userId: userId
      //   },
      //   include: {
      //     user: {
      //       select: {
      //         name: true,
      //         email: true
      //       }
      //     }
      //   }
      // });

      res.status(200).json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  };

  static getById = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { documentid } = req.params;
      const userId = req.user?.userId;

      const document = await prismaClient.document.findFirst({
        where: {
          id: parseInt(documentid),
          userId: userId // Ensure user can only access their own documents
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      if (!document) {
        res.status(404).json({ error: "Document not found" });
        return;
      }

      res.status(200).json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch document" });
    }
  };
}