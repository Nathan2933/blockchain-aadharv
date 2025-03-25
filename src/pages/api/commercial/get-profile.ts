import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../lib/mongodb';
import CommercialSpace from '../../../models/CommercialSpace';

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

    // Find commercial space by id and exclude password
    const commercialSpace = await CommercialSpace.findById(decoded.id).select('-password');
    
    if (!commercialSpace) {
      return res.status(404).json({ message: 'Commercial space not found' });
    }

    // Return commercial space data
    res.status(200).json({
      commercial: {
        id: commercialSpace._id,
        firmName: commercialSpace.firmName,
        managerName: commercialSpace.managerName,
        email: commercialSpace.email,
        phone: commercialSpace.phone,
        gstNumber: commercialSpace.gstNumber,
        cinNumber: commercialSpace.cinNumber,
        address: commercialSpace.address,
        requestedFields: commercialSpace.requestedFields,
        approvalStatus: commercialSpace.status,
        rejectionReason: commercialSpace.rejectionReason,
        createdAt: commercialSpace.createdAt
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