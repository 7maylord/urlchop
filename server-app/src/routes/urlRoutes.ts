import { Router } from 'express';
import { shortenUrl, redirectUrl, getUrlAnalytics, getUserLinkHistory, deleteUrl } from '../controllers/urlController';
import { validateUrl } from '../middleware/validator';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/url', validateUrl, auth, shortenUrl);
router.get('/:urlId', redirectUrl);
//router.get('/url/:urlId', auth, getShortUrl);
router.get('/analytics/:shortUrl', auth, getUrlAnalytics);
router.get('/history/:userId', auth, getUserLinkHistory);
router.delete('/:shortUrl', auth, deleteUrl);

export default router;
