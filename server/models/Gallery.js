import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required']
    },
    category: {
      type: String,
      enum: ['Mountains', 'Beaches', 'Adventure', 'Hotels', 'Road Trips', 'Culture', 'Honeymoon'],
      default: 'Mountains'
    },
    location: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
