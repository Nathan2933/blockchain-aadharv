import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../lib/mongodb';
import CommercialSpace from '../../../models/CommercialSpace';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Verify token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    
    // Find commercial space
    const commercialSpace = await CommercialSpace.findById(decoded.id);
    if (!commercialSpace) {
      return res.status(404).json({ message: 'Commercial space not found' });
    }

    // Update status to pending
    commercialSpace.status = 'pending';
    commercialSpace.updatedAt = new Date();
    
    await commercialSpace.save();

    res.status(200).json({ 
      message: 'Approval request submitted successfully',
      status: 'pending'
    });
  } catch (error) {
    console.error('Approval request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 