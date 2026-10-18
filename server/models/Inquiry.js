import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    subject: {
      type: String,
      default: 'General Travel Inquiry',
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true
    },
    destination: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Resolved'],
      default: 'New'
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
