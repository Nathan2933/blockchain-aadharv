import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '../../../lib/mongodb';
import CommercialSpace from '../../../models/CommercialSpace';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email, password } = req.body;

    // Find commercial space
    const commercialSpace = await CommercialSpace.findOne({ email });
    if (!commercialSpace) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, commercialSpace.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check status
    if (commercialSpace.status === 'pending') {
      return res.status(403).json({ 
        message: 'Your account is pending approval',
        status: 'pending'
      });
    }

    if (commercialSpace.status === 'rejected') {
      return res.status(403).json({ 
        message: 'Your account has been rejected',
        status: 'rejected'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: commercialSpace._id,
        email: commercialSpace.email,
        status: commercialSpace.status
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      commercialSpace: {
        id: commercialSpace._id,
        firmName: commercialSpace.firmName,
        email: commercialSpace.email,
        status: commercialSpace.status,
        requestedFields: commercialSpace.requestedFields
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 