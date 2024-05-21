import { Request, Response } from 'express';
import path from "node:path";
import {rootDir} from "./multer.config";
import {handleError, isExists} from "@stlib/utils";

export const downloadFile = async (req: Request, res: Response) => {
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

  return res.download(filePath, async (error) => {
    await handleError(error, () => {
      res.status(500).json({ error: 'Internal server error.' });
    })
  })
}
