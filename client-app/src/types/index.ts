export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
  }

export interface IUrl {
    _id: string;
    urlId: string;
    shortUrl: string;
    longUrl: string;
    clicks: number;
    qrCode: string;
  }
  