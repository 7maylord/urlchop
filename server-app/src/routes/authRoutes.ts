import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { validateRegister } from '../middleware/validator';

const router = Router();

/**
 * Route for user registration.
 */
router.post('/register', validateRegister, registerUser);

/**
 * Route for user login.
 */
router.post('/login', loginUser);

export default router;
