require('dotenv').config();
import app from './app';
import connectToMongoDB from './config/connectMongoDb';

const PORT = parseInt(process.env.PORT as string) || 3030;

// Connect to MongoDB
connectToMongoDB()
    .then(() => {
        console.log('Connected to MongoDB');
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
