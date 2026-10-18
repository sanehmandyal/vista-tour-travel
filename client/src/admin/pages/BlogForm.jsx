import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogApi } from '../../services/blogApi';
import { adminApi } from '../../services/adminApi';
import { processDeviceImage } from '../../utils/imageUpload';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

export const BlogForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Travel Guides',
    coverImage: '',
    readTime: '5 min read',
    excerpt: '',
    content: '',
    status: 'published'
  });

  useEffect(() => {
    if (isEdit) {
      const fetchBlog = async () => {
        try {
          const res = await blogApi.getAll({ limit: 100 });
          if (res.success && res.data) {
            const b = res.data.find(item => item._id === id);
            if (b) {
              setFormData({
                title: b.title || '',
                category: b.category || 'Travel Guides',
                coverImage: b.coverImage || '',
                readTime: b.readTime || '5 min read',
                excerpt: b.excerpt || '',
                content: b.content || '',
                status: b.status || 'published'
              });
            }
          }
        } catch (err) {
          toast.error('Failed to load blog data');
        }
      };
      fetchBlog();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const dataUri = await processDeviceImage(file);
      setFormData(prev => ({ ...prev, coverImage: dataUri }));
      toast.success('Cover photo loaded from your device!');
    } catch (err) {
      toast.error(err.message || 'Failed to process cover image');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.coverImage || !formData.content || !formData.excerpt) {
      toast.error('Please complete all fields.');
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await blogApi.update(id, formData);
        toast.success('Article updated successfully');
      } else {
        await blogApi.create(formData);
        toast.success('Article published successfully');
      }
      navigate('/admin/blogs');
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/blogs')}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">
            {isEdit ? 'Edit Article' : 'Compose New Article'}
          </h1>
          <p className="text-xs text-slate-500">Share travel itineraries, destination deep-dives, and guides.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-6">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Article Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Top 10 Things to Do in Manali This Winter"
            className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500"
            >
              <option value="Travel Guides">Travel Guides</option>
              <option value="Travel Tips">Travel Tips</option>
              <option value="Destinations">Destinations</option>
              <option value="Adventure">Adventure</option>
              <option value="Hotels">Hotels</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Read Time Estimate</label>
            <input
              type="text"
              name="readTime"
              value={formData.readTime}
              onChange={handleChange}
              placeholder="e.g. 5 min read"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Cover Photo */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Cover Image URL or File *</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              required
              placeholder="https://images.unsplash.com/..."
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
            />
            <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer shrink-0">
              <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload'}
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          {formData.coverImage && (
            <div className="mt-3 h-40 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Short Excerpt (max 300 chars) *</label>
          <textarea
            rows={2}
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            maxLength={300}
            placeholder="Brief preview text for cards..."
            className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Article Body */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Article Content *</label>
          <textarea
            rows={10}
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Write full article here..."
            className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-mono text-xs"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/admin/blogs')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            <Save className="w-4 h-4 mr-1.5" /> {isEdit ? 'Update Article' : 'Publish Article'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
