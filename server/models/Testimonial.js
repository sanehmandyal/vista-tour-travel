import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    },
    destination: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true
    },
    packageTitle: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5
    },
    review: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'approved'
    }
  },
  { timestamps: true }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
