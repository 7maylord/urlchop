import Url, { IUrl } from "../models/url";
import User, { IUser } from "../models/user";
import { nanoid } from "nanoid";
import generateQrCode from "../utils/qrCodeGenerator";
import { cacheGet, cacheSet, cacheDel } from "../utils/cache";

/**
 * Shortens a given URL, optionally using a custom URL.
 * @param longUrl - The original long URL to be shortened.
 * @param userId - The ID of the user creating the URL.
 * @param customUrl - Optional custom short URL.
 * @returns The shortened URL object.
 */
export const createShortUrl = async (
  longUrl: string,
  userId: string,
  customUrl?: string
): Promise<IUrl> => {
  const cachedUrl = await cacheGet(longUrl);
  if (cachedUrl) {
    return JSON.parse(cachedUrl);
  }

  let url = await Url.findOne({ longUrl, createdBy: userId });
  if (url) {
    await cacheSet(longUrl, JSON.stringify(url), 3600);
    return url;
  }

  const shortUrl = customUrl || nanoid(7);
  //check if customUrl is null or undefined to avoid issues with mongoDb
  if (customUrl === null || customUrl === undefined) {
    customUrl = shortUrl;
  }
  const qrCode = await generateQrCode(shortUrl);

  url = new Url({ longUrl, shortUrl, customUrl, qrCode, createdBy: userId });
  await url.save();
  // Update user's urls array
  await User.findByIdAndUpdate(userId, { $push: { urls: url._id } });
  await cacheSet(longUrl, JSON.stringify(url), 3600);
  return url;
};

/**
 * Retrieves a URL document by its short URL.
 * @param shortUrl - The short URL.
 * @returns The URL object or null if not found.
 */
export const getUrl = async (shortUrl: string): Promise<IUrl | null> => {
  const cachedUrl = await cacheGet(shortUrl);
  if (cachedUrl) {
    return JSON.parse(cachedUrl);
  }

  const url = await Url.findOne({ shortUrl });
  if (url) {
    await cacheSet(shortUrl, JSON.stringify(url), 3600);
    return url;
  }

  return null;
};

/**
 * Increments the click count for a given short URL.
 * @param shortUrl - The short URL.
 */
export const incrementClicks = async (shortUrl: string): Promise<void> => {
  const url = await Url.findOneAndUpdate(
    { shortUrl },
    { $inc: { clicks: 1 } },
    { new: true }
  );
  if (url) {
    await cacheSet(shortUrl, JSON.stringify(url), 3600);
  }
};

/**
 * Retrieves analytics data for a given short URL.
 * @param shortUrl - The short URL.
 * @param userId - The ID of the user requesting analytics.
 * @returns The analytics data.
 */
export const getAnalytics = async (
  shortUrl: string,
  userId: string
): Promise<{ clicks: number } | null> => {
  const url = await Url.findOne({ shortUrl, createdBy: userId });
  return url ? { clicks: url.clicks } : null;
};

/**
 * Deletes a short URL.
 * @param shortUrl - The short URL.
 * @param userId - The user ID.
 * @returns True if deleted, false otherwise.
 */
export const deleteShortUrl = async (shortUrl: string, userId: string): Promise<boolean> => {
  const url = await Url.findOneAndDelete({ shortUrl, createdBy: userId });
  if (url) {
      await cacheDel(shortUrl);
      await cacheDel(url.longUrl);
      return true;
  }
  return false;
};
