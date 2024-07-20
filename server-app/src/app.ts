import express from 'express';
import rateLimiter from './utils/rateLimiter';
import cors from 'cors';
import urlRoutes from './routes/urlRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
//middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors({
  origin: "http://localhost:5000",
  credentials: true
}));
app.use(rateLimiter);

//routes
app.use('/api', urlRoutes);
app.use('/api/auth', authRoutes);

// Test route to check server status
app.get('/', (req, res) => {
    res.send('Server is running');
  });

//catch all route
app.all("*", (req, res) => {
    res.status(404);
    res.json({
      message: "Not found",
    });
  });

export default app;