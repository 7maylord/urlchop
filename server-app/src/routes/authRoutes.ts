import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController';
import { validateRegister } from '../middleware/validator';
import { auth } from "../middleware/auth";

const router = Router();

/**
 * Route for user registration.
 */
router.post('/register', validateRegister, registerUser);

/**
 * Route for user login.
 */
router.post('/login', loginUser);

/**
 * Route to get the current logged-in user's information
 */
router.get('/me', auth, getCurrentUser);

export default router;
