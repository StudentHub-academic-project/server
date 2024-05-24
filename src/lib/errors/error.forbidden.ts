import {AbstractError} from "@stlib/utils";
import { Response } from "express";

export class ForbiddenException extends AbstractError {
  constructor(res: Response) {
    super('Forbidden.');
    res.status(this.code).json({ error: this.message });
  }

  readonly code: number = 403;

  serialize(res: Response) {
      return res.status(this.code).json({ error: this.message });
  }
}
