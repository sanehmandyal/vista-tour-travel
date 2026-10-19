import mongoose from 'mongoose';

const pageItemSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    image: { type: String, default: '' },
    link: { type: String, default: '' },
    stat: { type: String, default: '' }
  },
  { _id: true }
);

const pageSectionSchema = new mongoose.Schema(
  {
    sectionId: { type: String, required: true },
    name: { type: String, default: '' },
    badge: { type: String, default: '' },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    images: [{ type: String }],
    buttonText: { type: String, default: '' },
    buttonLink: { type: String, default: '' },
    items: [pageItemSchema],
    order: { type: Number, default: 0 },
    isEnabled: { type: Boolean, default: true }
  },
  { _id: true }
);

const pageContentSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    hero: {
      badge: { type: String, default: '' },
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      image: { type: String, default: '' },
      buttonText: { type: String, default: '' },
      buttonLink: { type: String, default: '' },
      secondaryButtonText: { type: String, default: '' },
      secondaryButtonLink: { type: String, default: '' },
      isEnabled: { type: Boolean, default: true }
    },
    sections: [pageSectionSchema],
    metaTitle: {
      type: String,
      default: ''
    },
    metaDescription: {
      type: String,
      default: ''
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const PageContent = mongoose.model('PageContent', pageContentSchema);
export default PageContent;
