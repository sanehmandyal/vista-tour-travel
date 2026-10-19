import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      lowercase: true
    },
    country: {
      type: String,
      default: 'India',
      trim: true
    },
    state: {
      type: String,
      default: 'Haryana',
      trim: true
    },
    region: {
      type: String,
      default: 'North India'
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    heroImage: {
      type: String,
      default: ''
    },
    featuredImage: {
      type: String,
      default: ''
    },
    gallery: [
      {
        type: String
      }
    ],
    attractions: [
      {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        image: { type: String, default: '' }
      }
    ],
    thingsToDo: [
      {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        icon: { type: String, default: 'Compass' }
      }
    ],
    bestTimeToVisit: {
      type: String,
      default: 'September to March'
    },
    startingPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  { timestamps: true }
);

destinationSchema.index({ name: 'text', state: 'text', shortDescription: 'text' });

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
