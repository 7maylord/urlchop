import { Router } from 'express';
import { shortenUrl, redirectUrl, getUrlAnalytics, getUserLinkHistory, deleteUrl } from '../controllers/urlController';
import { validateUrl } from '../middleware/validator';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/url', validateUrl, auth, shortenUrl);
router.get('/:urlId', redirectUrl);
router.get('/analytics/:urlId', auth, getUrlAnalytics);
router.get('/history/:userId', auth, getUserLinkHistory);
router.delete('/url/:urlId', auth, deleteUrl);

export default router;
