import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogApi } from '../services/blogApi';
import { formatDate } from '../utils/formatDate';
import { Calendar, Clock, ArrowLeft, Share2, Eye, ChevronRight, Compass } from 'lucide-react';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import toast from 'react-hot-toast';

export const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await blogApi.getBySlug(slug);
        if (res.success && res.data) {
          setBlog(res.data);
        }
      } catch (err) {
        console.error('Failed to load blog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Article link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading article..." />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Article Not Found</h2>
        <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4">
            <Link to="/" className="hover:text-brand-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/blog" className="hover:text-brand-600">Blog</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-navy-900 font-bold truncate max-w-xs">{blog.title}</span>
          </div>

          <Badge variant="primary" className="mb-3">{blog.category}</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 tracking-tight leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <img
                src={blog.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={blog.author?.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                }}
                className="w-10 h-10 rounded-full object-cover border border-brand-200"
              />
              <div>
                <p className="font-bold text-navy-900 text-sm">{blog.author?.name || 'Vista Team'}</p>
                <p className="text-[11px] text-slate-400">{blog.author?.role || 'Travel Guide'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-600" /> {formatDate(blog.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-600" /> {blog.readTime}
              </span>
              <button
                onClick={handleShare}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                title="Share Article"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        {/* Cover Image */}
        <div className="rounded-3xl overflow-hidden shadow-soft mb-10 h-80 sm:h-[450px] bg-slate-200">
          <img
            src={blog.coverImage || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80'}
            alt={blog.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80';
            }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Box */}
        <article className="bg-white rounded-3xl p-8 sm:p-12 shadow-soft border border-slate-100 prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-base whitespace-pre-line">
          {blog.content}
        </article>

        {/* CTA Card */}
        <div className="mt-12 bg-gradient-to-r from-brand-600 to-sky-600 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black mb-1">Inspired to Explore?</h3>
            <p className="text-brand-100 text-sm max-w-md">
              Let our travel planners design a personalized vacation matching this story.
            </p>
          </div>
          <Button
            variant="accent"
            size="lg"
            onClick={() => navigate('/destinations')}
            className="shrink-0 shadow-lg"
          >
            Explore Packages
          </Button>
        </div>

        {/* Related Articles */}
        {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-navy-900 mb-6">Related Stories & Guides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {blog.relatedBlogs.map((rel) => (
                <Link
                  key={rel._id}
                  to={`/blog/${rel.slug}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-soft border border-slate-100 group flex flex-col justify-between"
                >
                  <div className="h-40 w-full overflow-hidden bg-slate-100">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold text-brand-600 uppercase">{rel.category}</span>
                    <h4 className="text-sm font-bold text-navy-900 group-hover:text-brand-600 transition-colors line-clamp-2 mt-1">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
