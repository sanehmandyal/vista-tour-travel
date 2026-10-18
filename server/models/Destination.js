import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    country: {
      type: String,
      default: 'India',
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    region: {
      type: String,
      enum: ['North India', 'South India', 'West India', 'East India', 'Himalayas', 'Central India', 'International'],
      default: 'North India'
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    heroImage: {
      type: String,
      required: [true, 'Hero image URL is required']
    },
    gallery: [
      {
        type: String
      }
    ],
    attractions: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        image: { type: String, default: '' }
      }
    ],
    thingsToDo: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        icon: { type: String, default: 'Compass' }
      }
    ],
    bestTimeToVisit: {
      type: String,
      required: true
    },
    startingPrice: {
      type: Number,
      required: true,
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
