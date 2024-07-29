import mongoose, { Document, Schema } from 'mongoose';

// Interface representing the User document in MongoDB.
export interface IUser extends Document {
  _id?: string;
  username: string;
  email: string;
  password: string;
  urls: Schema.Types.ObjectId[];
  timestamp: Date;
}

//Mongoose schema for User
const userSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  urls: [{ type: Schema.Types.ObjectId, ref: 'Url' }],  
  timestamp: { type: Date, default: Date.now },
});

//Mongoose model for User
const User = mongoose.model<IUser>('User', userSchema);

export default User;
