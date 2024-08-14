import { createClient } from 'redis';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Determine which Redis URL or configuration to use
const isProduction = process.env.NODE_ENV === 'production';

const redisClient = createClient({
	url: isProduction ? undefined : process.env.REDIS_URL, //use REDIS_URL for non-production environment
    password: isProduction ? process.env.REDIS_PASSWORD : undefined,
		socket : isProduction ? {
			host: process.env.REDIS_HOST,
			port: parseInt(process.env.REDIS_PORT as string),
		} : undefined,
});

// Log Redis connection details based on environment
if (!isProduction) {
	console.log('Local Redis client configured');
  } else {
	console.log('Production Redis client configured.');
  }

redisClient.on('error', (err) => console.log('Redis Client Error', err));

async function connectRedis() {
    await redisClient.connect();
    console.log('Connected to Redis');
}

connectRedis();

export default redisClient;