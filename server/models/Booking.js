import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: true
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
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
    address: {
      type: String,
      default: ''
    },
    travelDate: {
      type: Date,
      required: [true, 'Travel date is required']
    },
    adults: {
      type: Number,
      required: true,
      min: [1, 'At least 1 adult is required'],
      default: 1
    },
    children: {
      type: Number,
      default: 0,
      min: 0
    },
    pickupLocation: {
      type: String,
      default: 'Airport / Railway Station'
    },
    specialRequirements: {
      type: String,
      default: ''
    },
    packagePrice: {
      type: Number,
      required: true
    },
    taxes: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Partial', 'Refunded'],
      default: 'Pending'
    },
    bookingStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
