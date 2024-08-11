import cors from "cors";

// Load whitelist from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [];

// Cross Origin Resource Sharing
export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin ?? '') || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Enable Access-Control-Allow-Credentials
  optionsSuccessStatus: 200,
  exposedHeaders: ['Content-Length', 'ETag', 'Link', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'], // Access-Control-Expose-Headers
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Access-Control-Allow-Headers
};
