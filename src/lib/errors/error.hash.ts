import {AbstractError} from "@stlib/utils";

export class HashException extends AbstractError {
  constructor() {
    super('argon hash error.');
  }

  readonly code: number = 500;

  serialize() {
  }
}
