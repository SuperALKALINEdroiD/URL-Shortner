// Analytics helper functions
export function groupClicksByDate(clicks) {
  const grouped = {};
  clicks.forEach(click => {
    const date = click.timestamp.toISOString().split('T')[0];
    grouped[date] = (grouped[date] || 0) + 1;
  });
  return Object.entries(grouped).map(([date, count]) => ({ date, count }));
}

export function calculateDeviceStats(clicks) {
  const stats = {};
  clicks.forEach(click => {
    if (!stats[click.device]) {
      stats[click.device] = {
        uniqueClicks: new Set(),
        uniqueUsers: new Set()
      };
    }
    stats[click.device].uniqueClicks.add(`${click.ipAddress}-${click.timestamp}`);
    stats[click.device].uniqueUsers.add(click.ipAddress);
  });

  return Object.entries(stats).map(([deviceName, data]) => ({
    deviceName,
    uniqueClicks: data.uniqueClicks.size,
    uniqueUsers: data.uniqueUsers.size
  }));
}

export function calculateOSStats(clicks) {
  const stats = {};
  clicks.forEach(click => {
    if (!stats[click.osType]) {
      stats[click.osType] = {
        uniqueClicks: new Set(),
        uniqueUsers: new Set()
      };
    }
    stats[click.osType].uniqueClicks.add(`${click.ipAddress}-${click.timestamp}`);
    stats[click.osType].uniqueUsers.add(click.ipAddress);
  });

  return Object.entries(stats).map(([osName, data]) => ({
    osName,
    uniqueClicks: data.uniqueClicks.size,
    uniqueUsers: data.uniqueUsers.size
  }));
}