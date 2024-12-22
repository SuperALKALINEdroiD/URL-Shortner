import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import UAParser from 'ua-parser-js';
import { redisClient } from '../services/redis.js';

const prisma = new PrismaClient();

export const createShortUrl = async (req, res) => {
  try {
    const { longUrl, customAlias, topic } = req.body;
    const shortUrl = customAlias || nanoid(8);

    const existing = await prisma.URL.findUnique({
      where: { shortUrl }
    });

    if (existing) {
      return res.status(400).json({ error: 'Custom alias already taken' });
    }

    const url = await prisma.URL.create({
      data: { longUrl, shortUrl, topic }
    });

    await redisClient.set(`url:${shortUrl}`, longUrl, 'EX', 86400);

    res.json({
      shortUrl: `${process.env.BASE_URL}/api/shorten/${url.shortUrl}`,
      createdAt: url.createdAt
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server error' });
  }
};

export const redirectToUrl = async (req, res) => {
  try {
    const { alias } = req.params;
    
    // Try to get URL from cache
    let longUrl = await redisClient.get(`url:${alias}`);
    
    if (!longUrl) {
      const url = await prisma.URL.findUnique({
        where: { shortUrl: alias }
      });
      
      if (!url) {
        return res.status(404).json({ error: 'URL not found' });
      }
      
      longUrl = url.longUrl;
      // Cache the URL
      await redisClient.set(`url:${alias}`, longUrl, 'EX', 86400);
    }

    // Log click data
    const parser = new UAParser(req.headers['user-agent']);
    const result = parser.getResult();

    await prisma.Click.create({
      data: {
        urlId: (await prisma.URL.findUnique({ where: { shortUrl: alias } })).id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        osType: result.os.name ?? 'Unknown',
        device: result.device.type ?? 'desktop'
      }
    });

    res.redirect(longUrl);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};