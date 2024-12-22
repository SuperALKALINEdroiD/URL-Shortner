import express from 'express';
import { body } from 'express-validator';
import { createShortUrl, redirectToUrl } from '../controllers/urlController.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.post('/',
  [
    body('longUrl').isURL().withMessage('Invalid URL'),
    body('customAlias').optional().isLength({ min: 4 }).withMessage('Alias must be at least 4 characters'),
    body('topic').optional().isString(),
    validateRequest
  ],
  createShortUrl
);

router.get('/:alias', redirectToUrl);

export { router as urlRouter };
