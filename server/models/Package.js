import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Package title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      lowercase: true
    },
    destination: {
      type: mongoose.Schema.Types.Mixed,
      default: ''
    },
    destinationName: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'Family Trips'
    },
    duration: {
      type: String,
      default: 'Full Day'
    },
    daysCount: {
      type: Number,
      default: 1
    },
    nightsCount: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      default: 0,
      min: 0
    },
    discountedPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 15
    },
    description: {
      type: String,
      default: ''
    },
    featuredImage: {
      type: String,
      default: ''
    },
    images: [
      {
        type: String
      }
    ],
    itinerary: [
      {
        day: { type: Number, default: 1 },
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        meals: { type: String, default: '' },
        hotel: { type: String, default: '' }
      }
    ],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    hotels: {
      type: String,
      default: ''
    },
    transport: {
      type: String,
      default: ''
    },
    cancellationPolicy: {
      type: String,
      default: ''
    },
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: 'published'
    }
  },
  { timestamps: true }
);

packageSchema.index({ title: 'text', description: 'text', category: 1 });

const Package = mongoose.model('Package', packageSchema);
export default Package;
