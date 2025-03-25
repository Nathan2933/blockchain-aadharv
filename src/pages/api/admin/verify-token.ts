import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { 
      id: string;
      role: string;
    };

    // Check if it's an admin token
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Token verification error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
} 