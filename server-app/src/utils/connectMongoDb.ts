import mongoose from 'mongoose';

const MONGO_URI: string = process.env.MONGO_URI || 'mongodb://localhost:27017/scissor';

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