export interface User {
  id: string;
  username: string;
  email: string;
}

export interface IClick {
  origin: string;
  timestamp: Date;
  count: number;
}

export interface IUrl {
  _id: string;
  urlId: string;
  shortUrl: string;
  longUrl: string;
  clicks: IClick[];
  customId?: string;
  qrCode: string;
  timestamp: Date;
}
