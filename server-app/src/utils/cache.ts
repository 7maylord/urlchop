import redisClient from '../config/redisClient';

/**
 * Retrieves a cached value by its key. Returns null if Redis is unavailable.
 * @param key - The cache key.
 */
export const cacheGet = async (key: string): Promise<string | null> => {
  if (!redisClient.isReady) return null;
  try {
    return await redisClient.get(key);
  } catch {
    return null;
  }
};

/**
 * Sets a value in the cache with a TTL. No-ops if Redis is unavailable.
 * @param key - The cache key.
 * @param value - The value to cache.
 * @param ttl - Time-To-Live in seconds.
 */
export const cacheSet = async (key: string, value: string, ttl: number): Promise<void> => {
  if (!redisClient.isReady) return;
  try {
    await redisClient.set(key, value, { EX: ttl });
  } catch {
    /* cache write is best-effort */
  }
};

/**
 * Deletes a value from the cache. No-ops if Redis is unavailable.
 * @param key - The cache key.
 */
export const cacheDel = async (key: string): Promise<void> => {
  if (!redisClient.isReady) return;
  try {
    await redisClient.del(key);
  } catch {
    /* cache delete is best-effort */
  }
};
