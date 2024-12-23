import express from 'express';
import { 
  getUrlAnalytics, 
  getTopicAnalytics, 
  getOverallAnalytics 
} from '../controllers/analyticsController.js';

const router = express.Router();

/**
 * @openapi
 * /api/analytics/overall:
 *   get:
 *     summary: Get overall analytics of shortened URLs
 *     description: Retrieve statistics for all shortened URLs including clicks and usage data.
 *     responses:
 *       200:
 *         description: Successful retrieval of overall analytics data.
 *         content:
 *           application/json:
 *       400:
 *         description: Bad request - invalid or missing parameters.
 *       500:
 *         description: Internal server error.
 * 
 * /api/analytics/{alias}:
 *   get:
 *     summary: Get analytics for a specific shortened URL
 *     description: Retrieve detailed analytics for a URL based on the provided alias.
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         description: The alias of the shortened URL.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved analytics for the shortened URL.
 *         content:
 *           application/json:
 *       404:
 *         description: Alias not found.
 *       500:
 *         description: Internal server error.
 * 
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Get analytics for URLs with a specific topic
 *     description: Retrieve analytics for all URLs associated with a specific topic.
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         description: The topic associated with the shortened URLs.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved analytics for the specified topic.
 *         content:
 *           application/json:
 *             example: [
 *               {
 *                 "shortUrl": "https://short.ly/abc123",
 *                 "longUrl": "https://example.com",
 *                 "alias": "abc123",
 *                 "topic": "tech",
 *                 "clicks": 150
 *               },
 *               {
 *                 "shortUrl": "https://short.ly/xyz789",
 *                 "longUrl": "https://anotherexample.com",
 *                 "alias": "xyz789",
 *                 "topic": "tech",
 *                 "clicks": 200
 *               }
 *             ]
 *       404:
 *         description: Topic not found or no URLs associated with the topic.
 *       500:
 *         description: Internal server error.
 */

router.get('/overall', getOverallAnalytics);
router.get('/:alias', getUrlAnalytics);
router.get('/topic/:topic', getTopicAnalytics);

export { router as analyticsRouter };