import redisClient from '../config/redisClient';

/**
 * Retrieves a cached URL by its key.
 * @param key - The cache key.
 * @returns The cached URL or null if not found.
 */


export const cacheGet = async (key: string): Promise<string | null> => {
  return await redisClient.get(key);
};

/**
 * Sets a URL in the cache with a TTL.
 * @param key - The cache key.
 * @param value - The URL value to cache.
 * @param ttl - Time-To-Live in seconds.
 */

export const cacheSet = async (key: string, value: string, ttl: number): Promise<void> => {
    await redisClient.set(key, value, { EX: ttl });
};

/**
 * Deletes a URL from the cache.
 * @param key - The cache key.
 */
export const cacheDel = async (key: string): Promise<void> => {
  await redisClient.del(key);
};