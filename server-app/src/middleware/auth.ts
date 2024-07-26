import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';

// Extend Request interface to include user property
export interface AuthenticatedRequest extends Request {
  user?: IUser; // Define user property as optional IUser type
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    // Verify JWT token from Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {_id: string};
    // Find user by _id from decoded token
    const user = await User.findById({_id: decoded._id});
    if (!user) {
        return res.status(401).send({ error: 'Not authenticated' });
      }
  // Set user property on request
      (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

