import rateLimit from 'express-rate-limit';

export const rateLimitter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  message: 'You exceeded your rate limit.',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
