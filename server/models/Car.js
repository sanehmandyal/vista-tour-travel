import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Car model name is required (e.g. Toyota Innova Crysta)'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Sedan', 'SUV', 'MUV', 'Hatchback', 'Tempo Traveller', 'Luxury', '4x4 Off-Road'],
      default: 'SUV'
    },
    seatingCapacity: {
      type: String,
      default: '6 + 1 Seats',
      trim: true
    },
    luggageCapacity: {
      type: String,
      default: '4 Bags',
      trim: true
    },
    fuelType: {
      type: String,
      default: 'Diesel',
      trim: true
    },
    ratePerKm: {
      type: Number,
      default: 14,
      min: 0
    },
    rateDaily: {
      type: Number,
      default: 3500,
      min: 0
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
    },
    features: [
      {
        type: String,
        trim: true
      }
    ],
    description: {
      type: String,
      default: ''
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Car = mongoose.model('Car', carSchema);
export default Car;
