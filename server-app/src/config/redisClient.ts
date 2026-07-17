import { createClient } from 'redis';

const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT as string),
        // Give up reconnecting after a handful of tries so a missing Redis
        // doesn't spam the logs forever — the app runs fine uncached.
        reconnectStrategy: (retries) =>
            retries > 10 ? false : Math.min(retries * 200, 3000),
    },
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err.message));

// Only attempt a connection when Redis is actually configured. This keeps
// redis-less environments (CI, tests) clean, and the app runs uncached.
// If Redis is configured but unavailable the server still starts (see utils/cache.ts).
if (process.env.REDIS_HOST) {
    (async () => {
        try {
            await redisClient.connect();
            console.log('Connected to Redis');
        } catch (err) {
            console.error('Redis unavailable, continuing without cache:', (err as Error).message);
        }
    })();
}

export default redisClient;
