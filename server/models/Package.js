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
      unique: true,
      lowercase: true
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Destination is required']
    },
    destinationName: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      enum: ['Family Trips', 'Honeymoon', 'Adventure', 'Weekend Getaways', 'Luxury Travel', 'Group Tours', 'Road Trips', 'Cultural'],
      required: [true, 'Category is required'],
      default: 'Family Trips'
    },
    duration: {
      type: String,
      required: [true, 'Duration is required (e.g. 5 Days / 4 Nights)']
    },
    daysCount: {
      type: Number,
      default: 5
    },
    nightsCount: {
      type: Number,
      default: 4
    },
    price: {
      type: Number,
      required: [true, 'Base price is required'],
      min: 0
    },
    discountedPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 15
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    featuredImage: {
      type: String,
      required: true
    },
    images: [
      {
        type: String
      }
    ],
    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        meals: { type: String, default: 'Breakfast included' },
        hotel: { type: String, default: '3/4-Star Hotel or Resort' }
      }
    ],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    hotels: {
      type: String,
      default: 'Verified 3-Star & 4-Star Accommodations with mountain/valley/beach views'
    },
    transport: {
      type: String,
      default: 'Dedicated AC Sedan / SUV with professional experienced driver'
    },
    cancellationPolicy: {
      type: String,
      default: 'Free cancellation up to 7 days before departure. 50% refund between 7 to 3 days. Non-refundable within 72 hours.'
    },
    importantInformation: {
      type: String,
      default: 'Please carry valid government photo identification. Warm clothing is recommended for hilly terrains.'
    },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }
    ],
    tags: [{ type: String }],
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'published'
    }
  },
  { timestamps: true }
);

packageSchema.index({ title: 'text', description: 'text', category: 1 });

const Package = mongoose.model('Package', packageSchema);
export default Package;
