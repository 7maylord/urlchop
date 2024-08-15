import { createClient } from 'redis';

const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
		socket: {
			host: process.env.REDIS_HOST,
			port: parseInt(process.env.REDIS_PORT as string),
		},
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

async function connectRedis() {
    await redisClient.connect();
    console.log('Connected to Redis');
}

connectRedis();

export default redisClient;