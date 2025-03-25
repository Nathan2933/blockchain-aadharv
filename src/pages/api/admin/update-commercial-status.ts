import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import CommercialSpace from '../../../models/CommercialSpace';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { id, status, rejectionReason } = req.body;

    if (!id || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const commercialSpace = await CommercialSpace.findById(id);
    if (!commercialSpace) {
      return res.status(404).json({ message: 'Commercial space not found' });
    }

    commercialSpace.status = status;
    if (status === 'rejected' && rejectionReason) {
      commercialSpace.rejectionReason = rejectionReason;
    }
    commercialSpace.updatedAt = new Date();

    await commercialSpace.save();

    res.status(200).json({ 
      message: `Commercial space ${status} successfully`,
      commercialSpace
    });
  } catch (error) {
    console.error('Error updating commercial space status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 