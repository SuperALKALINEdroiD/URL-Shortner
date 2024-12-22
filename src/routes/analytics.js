import express from 'express';
import { 
  getUrlAnalytics, 
  getTopicAnalytics, 
  getOverallAnalytics 
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/overall', getOverallAnalytics);
router.get('/:alias', getUrlAnalytics);
router.get('/topic/:topic', getTopicAnalytics);

export { router as analyticsRouter };