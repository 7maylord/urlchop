import mongoose, { Document, Schema } from 'mongoose';

// Interface representing the URL document in MongoDB.
export interface IUrl extends Document {
  longUrl: string;
  shortUrl: string;
  customUrl?: string;
  qrCode: string;
  clicks: number;
  createdBy: Schema.Types.ObjectId;
  timestamp: Date;
}

//Mongoose schema for URL
const urlSchema: Schema = new Schema({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  customUrl: { type: String, unique: true },
  qrCode: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});

//Mongoose model for URL.
const Url = mongoose.model<IUrl>('Url', urlSchema);

export default Url;

