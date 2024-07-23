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
  // Check if URL is already cached
  const cachedUrl = await cacheGet(longUrl);
  if (cachedUrl) {
    return JSON.parse(cachedUrl);
  }

  // Check if URL already exists in database
  let url = await Url.findOne({ longUrl, createdBy: userId });
  if (url) {
    await cacheSet(longUrl, JSON.stringify(url), 3600);
    return url;
  }

  // Generate short URL and optional custom URL
  const urlId = nanoid(7);
  const base = process.env.BASE; // Adjust this based on your application's base URL
  const shortUrl = customUrl || `${base}/${urlId}`;
  //check if customUrl is null or undefined to avoid issues with mongoDb
  // if (customUrl === null || customUrl === undefined) {
  //   customUrl = shortUrl;
  // }
  // Generate QR code for the short URL
  const qrCode = await generateQrCode(shortUrl);
  // Create new URL object
  url = new Url({ longUrl, shortUrl, urlId, qrCode, createdBy: userId });
  // Save URL to database
  await url.save();
  // Update user's urls array
  await User.findByIdAndUpdate(userId, { $push: { urls: url._id } });
  // Cache the URL
  await cacheSet(longUrl, JSON.stringify(url), 3600);
  return url;
};

/**
 * Retrieves a URL document by its short URL ID.
 * @param urlId - The URL ID.
 * @returns The URL object or null if not found.
 */
export const getUrl = async (urlId: string): Promise<IUrl | null> => {
  const cachedUrl = await cacheGet(urlId);
  if (cachedUrl) {
    return JSON.parse(cachedUrl);
  }

  const url = await Url.findById({ urlId });
  if (url) {
    await cacheSet(urlId, JSON.stringify(url), 3600);
    return url;
  }

  return null;
};

/**
 * Increments the click count for a given URL ID.
 * @param urlId - The URL ID.
 */
export const incrementClicks = async (urlId: string): Promise<void> => {
  const url = await Url.findByIdAndUpdate(
    urlId,
    { $inc: { clicks: 1 } },
    { new: true }
  );
  if (url) {
    await cacheSet(urlId, JSON.stringify(url), 3600);
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
export const deleteShortUrl = async (
  shortUrl: string,
  userId: string
): Promise<boolean> => {
  const url = await Url.findOneAndDelete({ shortUrl, createdBy: userId });
  if (url) {
    await cacheDel(shortUrl);
    await cacheDel(url.longUrl);
    return true;
  }
  return false;
};
