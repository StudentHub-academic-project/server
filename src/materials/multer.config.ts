import * as fs from 'fs';
import multer from 'multer';
import path from 'node:path';
import os from 'os';

export const rootDir = path.join(os.homedir(), '.studenthub');

const storage = multer.diskStorage({
  destination: async (req, _file, callback) => {
    const { sub } = req.user;

    if (!sub) {
      throw new Error('Empty user.sub in request.');
    }

    const rootDir = path.join(os.homedir(), '.studenthub');
    const uploadDir = path.join(rootDir, 'storage', sub);
    await fs.promises.mkdir(uploadDir, { recursive: true }).then(() => {
      callback(null, uploadDir);
    });
  },
  filename: (_req, file, callback) => {
    callback(null, file.originalname);
  },
});

export const upload = multer({ storage });
