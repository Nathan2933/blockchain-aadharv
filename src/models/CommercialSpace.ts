import mongoose, { Document, Model } from 'mongoose';

export interface ICommercialSpace extends Document {
  firmName: string;
  managerName: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  requestedFields: string[];
  status: 'pending' | 'approved' | 'rejected';
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const commercialSpaceSchema = new mongoose.Schema({
  firmName: {
    type: String,
    required: true,
    trim: true
  },
  managerName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  requestedFields: [{
    type: String,
    required: true,
    enum: ['name', 'phone', 'email', 'aadhar', 'pan', 'address', 'age']
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
commercialSpaceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const CommercialSpace: Model<ICommercialSpace> = mongoose.models.CommercialSpace || mongoose.model<ICommercialSpace>('CommercialSpace', commercialSpaceSchema);

export default CommercialSpace;