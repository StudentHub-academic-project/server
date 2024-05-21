import express from "express";
import {isLoggedIn} from "../middleware";
import {downloadFile} from "./material.service";
import {upload} from "./multer.config";

export const MaterialController = express.Router();

MaterialController.use(isLoggedIn);
MaterialController.get('/:filename', downloadFile);
MaterialController.post('/', upload.any(), (_req, res) => {
  return res.status(201).json({ message: 'File has been uploaded.' });
})
