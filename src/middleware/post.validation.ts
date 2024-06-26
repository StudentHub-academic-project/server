import { body, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

export const postValidation = [
  body('title')
    .optional()
    .isString()
    .isLength({ min: 3 })
    .withMessage('Title must be 3 or more characters length.'),
  body('content')
    .optional()
    .isString()
    .isLength({ min: 25 })
    .withMessage('Content must be 25 or more characters length.'),
  body('rating')
    .optional()
    .isInt({ min: 0, max: 5 })
    .withMessage('Rating must be specified in range (0; 5)'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ Errors: errors.array() });
    }

    next();
  },
];
