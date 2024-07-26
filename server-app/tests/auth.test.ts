import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { auth, AuthenticatedRequest } from '../src/middleware/auth';

// Load environment variables from .env file
dotenv.config();

describe('verifyToken middleware', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it('should call next() if token is valid', () => {
    const token = jwt.sign({ _id: '123' }, process.env.JWT_SECRET as string);
    req.headers = { authorization: `Bearer ${token}` };

    // @ts-ignore
    auth(req as AuthenticatedRequest, res as Response, next);

    expect(next).toHaveBeenCalled();
     // Check if user exists before accessing _id
     const user = (req as AuthenticatedRequest).user;
     expect(user).toBeDefined(); // Ensure user is defined
     if (user && user._id) { // Check if user and user._id are defined
      expect(user._id.toString()).toBe('123'); // Safe access to _id
    } else {
      throw new Error('User ID is undefined');
    }
  });

  it('should return 401 and error message if token is missing', () => {
    // @ts-ignore
    auth(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Unauthorized: Missing token',
    });
  });

  it('should return 401 and error message if token is invalid', () => {
    req.headers = { authorization: 'Bearer invalidtoken' };

    // @ts-ignore
    auth(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Unauthorized: Invalid token',
    });
  });
});
