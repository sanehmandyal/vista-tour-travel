import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSchema);
export default NewsletterSubscriber;
