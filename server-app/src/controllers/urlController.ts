import { Request, Response } from 'express';
import { createShortUrl, getUrl, incrementClicks, getAnalytics, deleteShortUrl } from '../services/urlService';
import User, { IUser } from '../models/user';
import { AuthenticatedRequest } from '../middleware/auth';


//Controller for creating a short URL.
export const shortenUrl = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { longUrl, customId } = req.body;    
    try {        
        const userId = (req.user as IUser)._id;
        if (!userId) {
            res.status(404).json({ error: 'UserId not found' });
            return;
            }    
        const url = await createShortUrl(longUrl, userId, customId);
        res.status(201).json(url);
    } catch (error: any) {
        console.error('Error creating shortUrl:', error);
        res.status(500).json({ error: error.message });
    }
};

//Controller for redirecting a short URL.
export const redirectUrl = async (req: Request, res: Response): Promise<void> => {
    const { urlId } = req.params;
    try {        
        const url = await getUrl(urlId);  // Retrieve the URL from the service
        if (!url) {
            res.status(404).json({ error: 'URL not found' });
            return;
          }
          const origin = req.get('referer') || 'direct';
          await incrementClicks(urlId, origin);
          res.redirect(302, url.longUrl);
    } catch (error: any) {
        console.error('Error redirecting:', error);
        res.status(500).json({ error: error.message });
    }
};

//Controller for getting analytics of a short URL.
export const getUrlAnalytics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { urlId } = req.params;
    try {                
        const userId = (req.user as IUser)._id;
        if (!userId) {
            res.status(404).json({ error: 'UserId not found' });
            return;
        }
        const analytics = await getAnalytics(urlId, userId);  // Retrieve analytics
        if (!analytics) {
            res.status(404).json({ error: 'URL not found' });
            return;
          }
          res.status(200).json(analytics);
    } catch (error: any) {
        console.error('Error getting Link analytics:', error)
        res.status(500).json({ error: error.message });
    }
};

//Controller for getting the link history of a user.
export const getUserLinkHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = (req.user as IUser)._id;
      const user = await User.findById(userId).populate('urls');
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.status(200).json({ urls: user.urls });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

//Controller for deleting a Url.
  export const deleteUrl = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { urlId } = req.params;
    const userId = (req.user as any)._id;
    try {
        const result = await deleteShortUrl(urlId, userId);
        if (result) {
            res.status(200).json({ message: 'URL deleted successfully' });
        } else {
            res.status(404).json({ error: 'URL not found or not authorized' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
