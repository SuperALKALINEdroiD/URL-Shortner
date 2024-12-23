import express from 'express';
import { body } from 'express-validator';
import { createShortUrl, redirectToUrl } from '../controllers/urlController.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

/**
 * @openapi
 * /api/shorten:
 *   post:
 *     description: Shortens the given URL and optionally allows for a custom alias.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 format: uri
 *                 description: The long URL to be shortened.
 *               customAlias:
 *                 type: string
 *                 description: An optional custom alias for the shortened URL (min. 4 characters).
 *               topic:
 *                 type: string
 *                 description: An optional topic for categorizing the URL.
 *     responses:
 *       200:
 *         description: Returns the shortened URL with a successful status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The shortened URL.
 *       400:
 *         description: short URL already in use
 *       500:
 *         description: Internal server error.
 * 
 * /api/shorten/{alias}:
 *   get:
 *     description: Redirects to the long URL associated with the provided alias.
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         description: The alias of the shortened URL.
 *         schema:
 *           type: string
 *     responses:
 *       301:
 *         description: Redirects to the original long URL.
 *       404:
 *         description: Alias not found.
 */
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
