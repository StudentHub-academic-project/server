import { Request, Response } from 'express';
import path from "node:path";
import {rootDir} from "./multer.config";
import {handleError, isExists} from "@stlib/utils";
import * as fs from "fs";

const getFilepath = async (req: Request, res: Response) => {
  const { sub } = req.user;
  const { filename } = req.params;

  if(!sub) {
    return res.status(403).json({ error: 'Forbidden.' });
  }

  const filePath = path.join(rootDir, 'storage', sub, filename);

  const fileExists = await isExists(filePath);

  if(!fileExists) {
    return res.status(403).json({ error: 'download: No such file or directory.' });
  }

  return filePath;
}

export const getAllMaterials = async (req: Request, res: Response) => {
  const { sub } = req.user;

  if(!sub) {
    return res.status(403).json({ error: 'Forbidden.' });
  }

  const dirPath = path.join(rootDir, 'storage', sub);

  const dirExists = await isExists(dirPath);

  if(!dirExists) {
    return res.status(403).json({ error: 'download: No such file or directory.' });
  }

  const files = await fs.promises.readdir(dirPath);

  return res.status(200).json({ files });
}

export const downloadFile = async (req: Request, res: Response) => {
  const filePath = await getFilepath(req, res);

  return res.download(filePath.toString(), async (error) => {
    await handleError(error, () => {
      res.status(500).json({ error: 'Internal server error.' });
    })
  })
}

export const deleteMaterial = async (req: Request, res: Response) => {
  const filePath = await getFilepath(req, res);

  await fs.promises.rm(filePath.toString());

  return res.status(204).json({ message: 'File has been deleted.' });
}
