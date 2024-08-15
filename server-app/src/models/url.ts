import mongoose, { Document, Schema } from 'mongoose';

// Interface representing a single click
export interface IClick {
  origin: string;
  timestamp: Date;
  count: number;
}

// Interface representing the URL document in MongoDB.
export interface IUrl extends Document {
  longUrl: string;
  shortUrl: string;
  urlId?: string;
  customId?: string;
  qrCode: string;
  clicks: IClick[];
  createdBy: Schema.Types.ObjectId;
  timestamp: Date;
}

//Mongoose schema for Clicks
const clickSchema = new Schema<IClick>({
  origin: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  count: { type: Number, required: true },
});

//Mongoose schema for URL
const urlSchema: Schema = new Schema<IUrl>({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  urlId: { type: String, unique: true },
  qrCode: { type: String, required: true },
  clicks: { type: [clickSchema], default: [] },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});

//Mongoose model for URL.
const Url = mongoose.model<IUrl>('Url', urlSchema);

export default Url;

