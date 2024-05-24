import {AbstractError} from "@stlib/utils";
import { Response } from "express";

export class BadRequestException extends AbstractError {
  constructor(res: Response, message?: string) {
    super(message ?? 'Bad request.');
    res.status(this.code).json({ error: this.message });
  }

  readonly code: number = 400;

  serialize(res: Response) {
    return res.status(this.code).json({ error: this.message });
  }
}
