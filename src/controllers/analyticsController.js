import { PrismaClient } from '@prisma/client';
import { redisClient } from '../services/redis.js';
import { 
  getClicksByDate, 
  getClicksByDateForTopic,
  getDeviceStats,
  getOSStats 
} from '../services/analytics.js';

const prisma = new PrismaClient();

export const getUrlAnalytics = async (req, res) => {
  try {
    const { alias } = req.params;
    
    const cachedAnalytics = await redisClient.get(`analytics:${alias}`);
    if (cachedAnalytics) {
      return res.json(JSON.parse(cachedAnalytics));
    }

    const url = await prisma.URL.findUnique({
      where: { shortUrl: alias },
      include: { clicks: true }
    });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    const analytics = {
      totalClicks: url.clicks.length,
      uniqueClicks: new Set(url.clicks.map(click => click.ipAddress)).size,
      clicksByDate: await getClicksByDate(url.id),
      osType: await getOSStats(url.id),
      deviceType: await getDeviceStats(url.id)
    };

    await redisClient.set(`analytics:${alias}`, JSON.stringify(analytics), 'EX', 3600);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getTopicAnalytics = async (req, res) => {
  try {
    const { topic } = req.params;
    
    const urls = await prisma.URL.findMany({
      where: { topic },
      include: { clicks: true }
    });

    const analytics = {
      totalClicks: urls.reduce((sum, url) => sum + url.clicks.length, 0),
      uniqueClicks: new Set(urls.flatMap(url => url.clicks.map(click => click.ipAddress))).size,
      clicksByDate: await getClicksByDateForTopic(topic),
      urls: urls.map(url => ({
        shortUrl: `${process.env.BASE_URL}/api/shorten/${url.shortUrl}`,
        totalClicks: url.clicks.length,
        uniqueClicks: new Set(url.clicks.map(click => click.ipAddress)).size
      }))
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getOverallAnalytics = async (req, res) => {
  try {
    const urls = await prisma.URL.findMany({
      include: { clicks: true }
    });

    const analytics = {
      totalUrls: urls.length,
      totalClicks: urls.reduce((sum, url) => sum + url.clicks.length, 0),
      uniqueClicks: new Set(urls.flatMap(url => url.clicks.map(click => click.ipAddress))).size,
      clicksByDate: await getClicksByDate(),
      osType: await getOSStats(),
      deviceType: await getDeviceStats()
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};