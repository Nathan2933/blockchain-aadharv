import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import connectDB from '../../../lib/mongodb';
import CommercialSpace from '../../../models/CommercialSpace';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { firmName, managerName, email, phone, address, description, requestedFields, password } = req.body;

    // Check if email already exists
    const existingSpace = await CommercialSpace.findOne({ email });
    if (existingSpace) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new commercial space
    const commercialSpace = new CommercialSpace({
      firmName,
      managerName,
      email,
      phone,
      address,
      description,
      requestedFields,
      password: hashedPassword,
      status: 'pending'
    });

    await commercialSpace.save();

    res.status(201).json({ message: 'Registration successful. Waiting for admin approval.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 