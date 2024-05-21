import { Request, Response } from 'express';
import path from "node:path";
import {rootDir} from "./multer.config";
import {handleError, isExists} from "@stlib/utils";
import * as fs from "fs";

const getFilepath = async (req: Request): Promise<{ filePath: string, OK: boolean }> => {
  const { sub } = req.user;
  const { filename } = req.params;

  if(!sub) {
    throw Error('No sub in user.req.');
  }

  const filePath = path.join(rootDir, 'storage', sub, filename);

  const fileExists = await isExists(filePath);

  if(!fileExists) {
    return { filePath, OK: false };
  }

  return { filePath, OK: true };
}

export const getAllMaterials = async (req: Request, res: Response) => {
  try {
    const { sub } = req.user;

    if(!sub) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const dirPath = path.join(rootDir, 'storage', sub);

    const dirExists = await isExists(dirPath);

    if(!dirExists) {
      return res.status(404).json({ error: 'No such file or directory.' });
    }

    const files = await fs.promises.readdir(dirPath);

    return res.status(200).json({ files });
  } catch (error) {
    return await handleError(error, () => {
      res.status(500).json({ error: 'Internal server error.' });
    })
  }
}

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const { filePath, OK } = await getFilepath(req);

    if(!OK) {
      return res.status(404).json({ error: 'No such file or directory.' })
    }

    return res.download(filePath, async (error) => {
      await handleError(error, () => {
        res.status(500).json({ error: 'Internal server error.' });
      })
    })
  } catch (error) {
    return await handleError(error, () => {
      res.status(500).json({ error: 'Internal server error.' });
    })
  }
}

export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const { filePath, OK } = await getFilepath(req);

    if(!OK) {
      return res.status(404).json({ error: 'No such file or directory.' })
    }

    await fs.promises.rm(filePath);

    return res.status(204).json({ message: 'File has been deleted.' });
  } catch (error) {
    return await handleError(error, () => {
      res.status(500).json({ error: 'Internal server error.' });
    })
  }
}
