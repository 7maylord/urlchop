import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '../middleware/auth';

export const generateToken = (userId: string): string => {
  return jwt.sign({ _id: userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user: IUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // Save the user to the database
    await user.save();
    // Typeguard to check if new user contains _id property
    if (!user._id) {
        throw new Error('User ID is missing');
      }  
    // Generate token
    const token = generateToken(user._id);
    res.status(201).json({ message: 'User created successfully', user, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user: IUser | null = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    if (!user._id) {
        throw new Error('User ID is missing');
      }
      
    const token = generateToken(user._id.toString());
    res.status(200).json({ message: 'User logged in successfully', user, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
};
