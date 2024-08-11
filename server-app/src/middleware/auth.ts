import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";

// Extend Request interface to include user property
export interface AuthenticatedRequest extends Request {
  user?: IUser; // Define user property as optional IUser type
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  // Verify JWT token from Authorization header
  const authHeader = req.headers.authorization;

  // Check if the header exists and is a string
  if (typeof authHeader === "string") {
    // Split the header to get the token
    const parts = authHeader.split(" ");

    if (parts.length === 2 && parts[0] === "Bearer") {
      const token = parts[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          _id: string;
        };
        // Find user by _id from decoded token
        const user = await User.findById({ _id: decoded._id });
        if (!user) {
          return res.status(401).send({ error: "Unauthorized: Not authenticated" });
        }
        // Set user property on request
        (req as AuthenticatedRequest).user = user;
        next();
      } catch (error) {
        res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
    } else {
      // If the header format is not correct
      res.status(401).json({ error: "Unauthorized: Malformed token" });
    }
  } else {
    // Handle case where Authorization header is not a string
    res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
  }
};
