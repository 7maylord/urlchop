import mongoose, { Document, Schema } from 'mongoose';

// Interface representing the User document in MongoDB.
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  urls: mongoose.Types.ObjectId[];
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

// Never expose the password hash when a user document is serialized to JSON.
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete (ret as { password?: string }).password;
    return ret;
  },
});

//Mongoose model for User
const User = mongoose.model<IUser>('User', userSchema);

export default User;
