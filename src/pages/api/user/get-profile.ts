import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    
    // Connect to database
    await dbConnect();

    // Find user by id and exclude password
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        aadharNumber: user.aadharNumber,
        panNumber: user.panNumber,
        address: user.address,
        age: user.age,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
} 