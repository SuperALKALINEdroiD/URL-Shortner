import { PrismaClient } from '@prisma/client';
import { groupClicksByDate, calculateDeviceStats, calculateOSStats } from '../utils/analytics.js';

const prisma = new PrismaClient();

export async function getClicksByDate(urlId = null) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const clicks = await prisma.Click.findMany({
    where: {
      ...(urlId && { urlId }),
      timestamp: { gte: sevenDaysAgo }
    }
  });

  return groupClicksByDate(clicks);
}

export async function getClicksByDateForTopic(topic) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const clicks = await prisma.Click.findMany({
    where: {
      url: { topic },
      timestamp: { gte: sevenDaysAgo }
    }
  });

  return groupClicksByDate(clicks);
}

export async function getDeviceStats(urlId = null) {
  const clicks = await prisma.Click.findMany({
    where: urlId ? { urlId } : {}
  });
  return calculateDeviceStats(clicks);
}

export async function getOSStats(urlId = null) {
  const clicks = await prisma.Click.findMany({
    where: urlId ? { urlId } : {}
  });
  return calculateOSStats(clicks);
}