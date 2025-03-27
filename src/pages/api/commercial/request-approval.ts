import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import CommercialSpace from '../../../models/CommercialSpace';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find commercial space by email
    const commercialSpace = await CommercialSpace.findOne({ email });
    if (!commercialSpace) {
      return res.status(404).json({ message: 'Commercial space not found' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, commercialSpace.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if status is rejected before allowing re-request
    if (commercialSpace.status !== 'rejected') {
      return res.status(400).json({ 
        message: 'Can only request approval for rejected accounts',
        status: commercialSpace.status 
      });
    }

    // Update status to pending
    commercialSpace.status = 'pending';
    commercialSpace.updatedAt = new Date();
    await commercialSpace.save();

    // Send success response
    res.status(200).json({ 
      message: 'Approval request submitted successfully',
      status: 'pending'
    });

  } catch (error) {
    console.error('Approval request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 