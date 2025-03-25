import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import CommercialSpace from '../../../models/CommercialSpace';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const commercialSpaces = await CommercialSpace.find({})
      .select('firmName managerName email status requestedFields createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json(commercialSpaces);
  } catch (error) {
    console.error('Error fetching commercial spaces:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 