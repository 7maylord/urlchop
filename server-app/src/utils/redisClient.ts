import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

async function connectRedis() {
    await redisClient.connect();
    console.log('Connected to Redis');
}

connectRedis();

export default redisClient;