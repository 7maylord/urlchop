require('dotenv').config();
// import 'dotenv/config'
import app from './app';
import connectToMongoDB from './utils/connectMongoDb';
import keepAliveJob from './utils/keepawake';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectToMongoDB()
    .then(() => {
        console.log('Connected to MongoDB');
        keepAliveJob();
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
