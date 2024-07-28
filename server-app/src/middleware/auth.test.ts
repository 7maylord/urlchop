import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { auth, AuthenticatedRequest } from '../middleware/auth';
import User from '../models/user';

// Load environment variables from .env.test file
dotenv.config({ path: '.env.test' });

// Mock the User model
jest.mock('../src/models/user');

describe('verifyToken middleware', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() if token is valid', async () => {
    const token = jwt.sign({ _id: '123' }, process.env.JWT_SECRET as string);
    req.headers = { authorization: `Bearer ${token}` };

    // Mock the User.findById method
    const mockUser = { _id: '123', username: 'testuser' };
    (User.findById as jest.Mock).mockResolvedValue(mockUser);

    // @ts-ignore
    await auth(req as AuthenticatedRequest, res as Response, next);
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

  it('should return 401 and error message if token is missing', async () => {
    // @ts-ignore
    await auth(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Unauthorized: Missing or invalid token',
    });
  });

  it('should return 401 and error message if token is invalid', async () => {
    req.headers = { authorization: 'Bearer invalidtoken' };

    // @ts-ignore
    await auth(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Unauthorized: Invalid token',
    });
  });
});
