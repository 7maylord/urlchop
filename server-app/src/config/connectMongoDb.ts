import mongoose from 'mongoose';

function connectToMongoDB(): Promise<void> {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        return Promise.reject(
            new Error('MONGO_URI environment variable is not set')
        );
    }

    return new Promise((resolve, reject) => {
        mongoose.connect(MONGO_URI);

        mongoose.connection.on('connected', () => {
            console.log('MongoDB connection successful');
            resolve();
        });

        mongoose.connection.on('error', (err) => {
            console.error(err);
            console.log('MongoDB connection unsuccessful');
            reject(err);
        });
    });
}
export default connectToMongoDB;
