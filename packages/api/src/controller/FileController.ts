import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import * as crypto from "crypto";
import { getServiceIdPath, createDirectoriesRecursive, getFileTypeByMime } from "../service/file_service";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export async function upload(req: Request, res: Response) {
    res.json({ status: "success" });
  }

  export async function uploadService(req: Request, res: Response) {
    const serviceName = req.params.serviceName; 
    const serviceId = parseInt(req.params.id); 
    let destPath: string = getServiceIdPath(serviceName, serviceId, 2); // call getServiceIdPath
  
    if (!req.file) {
      res.status(400).json({ status: "error", message: "Empty file request" });
      return;
    }
  
    const srcPath = req.file.path;
    const fileName = crypto.randomBytes(4).toString("hex") + "_" + Date.now();
    const ext = path.extname(req.file.originalname);
    let fullPath: string;
    if (req.file.mimetype.startsWith("image/")) {
      destPath = path.join(destPath, fileName);
      fullPath = path.join(destPath, `orig${ext}`);
    } else {
      fullPath = path.join(destPath, `${fileName}${ext}`);
    }
  
    createDirectoriesRecursive(destPath);
  
    fs.rename(srcPath, fullPath, async (err) => {
      if (err) {
        console.error("Error moving file: ", err);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
        return;
      }
  
      const fileCreated = await prismaClient.file.create({
        data: {
          service: serviceName,
          serviceId: serviceId,
          idNestLevel: 2,
          fileType: getFileTypeByMime(req.file?.mimetype ?? ""),
          mimeType: req.file?.mimetype,
          name: req.file?.originalname,
          fileName: fileName,
          extension: ext,
        },
      });
  
      res.json({ status: "success", message: "File uploaded and moved successfully", file: fileCreated });
    });
  }
  