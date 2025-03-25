import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('Raw request body:', req.body);
  console.log('Request headers:', req.headers);

  try {
    console.log('Starting database connection...');
    await dbConnect();
    console.log('Connected to MongoDB in registration handler');

    const { name, email, phone, aadharNumber, panNumber, address, age, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !aadharNumber || !panNumber || !address || !age || !password) {
      console.log('Missing required fields:', {
        hasName: !!name,
        hasEmail: !!email,
        hasPhone: !!phone,
        hasAadhar: !!aadharNumber,
        hasPan: !!panNumber,
        hasAddress: !!address,
        hasAge: !!age,
        hasPassword: !!password
      });
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log('Received registration data:', {
      name,
      email,
      phone,
      aadharNumber,
      panNumber,
      address,
      age,
      passwordLength: password?.length
    });

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate Aadhar number format
    const aadharRegex = /^\d{12}$/;
    if (!aadharRegex.test(aadharNumber)) {
      return res.status(400).json({ message: 'Invalid Aadhar number format. Must be 12 digits.' });
    }

    // Validate PAN number format
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber)) {
      return res.status(400).json({ message: 'Invalid PAN number format. Must be in format ABCDE1234F' });
    }

    // Check if user already exists
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    console.log('Creating new user document...');
    const userData = {
      name,
      email,
      phone,
      aadharNumber,
      panNumber,
      address,
      age: Number(age),
      password: hashedPassword,
      role: 'USER'
    };
    console.log('User data to be saved:', { ...userData, password: '[HIDDEN]' });

    const user = new User(userData);

    console.log('Saving user to database...');
    const savedUser = await user.save();
    console.log('User saved successfully:', {
      id: savedUser._id,
      email: savedUser.email,
      role: savedUser.role
    });

    res.status(201).json({ 
      message: 'Registration successful',
      user: {
        id: savedUser._id,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    // Send more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.code === 11000) {
      // Handle duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field} already exists`
      });
    }

    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 