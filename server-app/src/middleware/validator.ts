import { Request, Response, NextFunction } from 'express';
import validUrl from 'valid-url';
import { check, validationResult } from 'express-validator';

// Validate URL
export const validateUrl = (req: Request, res: Response, next: NextFunction) => {
    const { longUrl } = req.body;
    if (!validUrl.isUri(longUrl)) {
        return res.status(400).json({ message: 'Invalid URL' });
    }
    next();
};

// Validate User Registration
export const validateRegister = [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map(err => ({ field: (err as any).path, message: err.msg }));
        return res.status(422).json({ errors: extractedErrors });
        // return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];

