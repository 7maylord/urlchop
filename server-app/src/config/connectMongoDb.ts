import mongoose from 'mongoose';

if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
}

const MONGO_URI: string = process.env.MONGO_URI!;

function connectToMongoDB(): Promise<void> {
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