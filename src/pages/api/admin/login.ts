import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { ADMIN_CREDENTIALS } from '../../../config/admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { employeeId, password } = req.body;

    // Validate credentials
    if (employeeId !== ADMIN_CREDENTIALS.employeeId || 
        password !== ADMIN_CREDENTIALS.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: employeeId,
        role: 'admin'
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      admin: {
        employeeId,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 