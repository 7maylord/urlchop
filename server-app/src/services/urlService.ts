import Url, { IUrl, IClick } from "../models/url";
import User, { IUser } from "../models/user";
import { nanoid } from "nanoid";
import generateQrCode from "../utils/qrCodeGenerator";
import { cacheGet, cacheSet, cacheDel } from "../utils/cache";

/**
 * Shortens a given URL, optionally using a custom URL.
 * @param longUrl - The original long URL to be shortened.
 * @param userId - The ID of the user creating the URL.
 * @param customId - Optional custom Id for short URL.
 * @returns The shortened URL object.
 */
export const createShortUrl = async (
  longUrl: string,
  userId: string,
  customId?: string
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

  let urlId = ""; // Initialize urlId

  // Check if customId is null or undefined to avoid issues with MongoDB
  if (!customId) {
    urlId = nanoid(7); // Generate a random ID of length 7
  } else {
    urlId = customId; // Use customId if provided
  }
  const base = process.env.BASE; // Adjust this based on your application's base URL
  const shortUrl = `${base}api/${urlId}`;

  // Generate QR code for the short URL
  const qrCode = await generateQrCode(shortUrl);
  // Create new URL object
  url = new Url({
    longUrl,
    shortUrl,
    customId,
    urlId,
    qrCode,
    createdBy: userId,
  });
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
  // Check if the URL is cached
  const cachedUrl = await cacheGet(urlId);
  if (cachedUrl) {
    return JSON.parse(cachedUrl);
  }
  // If not cached, fetch from the database
  const url = await Url.findOne({ urlId });
  if (url) {
    // Cache the fetched URL for future use
    await cacheSet(urlId, JSON.stringify(url), 3600); // Cache for 1 hour
    return url;
  }

  return null; // Return null if URL not found
};

/**
 * Increments the click count for a given URL ID.
 * @param urlId - The URL ID.
 */
export const incrementClicks = async (
  urlId: string,
  origin: string
): Promise<void> => {
  const url = await Url.findOne({ urlId }); // Fetch the URL document
  if (url) {
    const clickIndex = url.clicks.findIndex((click) => click.origin === origin); // Check if the origin exists

    if (clickIndex > -1) {
      url.clicks[clickIndex].count += 1; // Increment click count for existing origin
    } else {
      // Add new origin with initial click count
      url.clicks.push({ origin, timestamp: new Date(), count: 1 });
    }

    await url.save();
    await cacheSet(urlId, JSON.stringify(url), 3600); // Update the cache
  }
};

/**
 * Retrieves analytics data for a given short URL.
 * @param urlId - The URL Id.
 * @param userId - The ID of the user requesting analytics.
 * @returns The analytics data.
 */
export const getAnalytics = async (
  urlId: string,
  userId: string
): Promise<{ clicks: IClick[] } | null> => {
  const url = await Url.findOne({ urlId, createdBy: userId }); // Fetch URL document for the specific user
  return url ? { clicks: url.clicks } : null;
};

/**
 * Deletes a short URL.
 * @param urlId - The URL Id.
 * @param userId - The user ID.
 * @returns True if deleted, false otherwise.
 */
export const deleteShortUrl = async (
  urlId: string,
  userId: string
): Promise<boolean> => {
  const url = await Url.findOneAndDelete({ urlId, createdBy: userId });
  if (url) {
    await cacheDel(urlId);
    await cacheDel(url.longUrl);
    return true;
  }
  return false;
};
