import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required']
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: 300
    },
    content: {
      type: String,
      required: [true, 'Blog content is required']
    },
    author: {
      name: { type: String, default: 'Vista Team' },
      role: { type: String, default: 'Senior Travel Guide' },
      avatar: { type: String, default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }
    },
    category: {
      type: String,
      enum: ['Travel Tips', 'Destinations', 'Travel Guides', 'Adventure', 'Hotels', 'Culture'],
      default: 'Destinations'
    },
    tags: [{ type: String }],
    readTime: {
      type: String,
      default: '5 min read'
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published'
    },
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

blogSchema.index({ title: 'text', excerpt: 'text' });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
