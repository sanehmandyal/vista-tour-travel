import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { blogApi } from '../services/blogApi';
import { formatDate } from '../utils/formatDate';
import { BookOpen, Clock, Calendar, ArrowRight, Search, User } from 'lucide-react';
import { CardSkeleton } from '../components/common/Skeleton';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';

export const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const categories = [
    'All',
    'Travel Tips',
    'Destinations',
    'Travel Guides',
    'Adventure',
    'Hotels'
  ];

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 6 };
      if (category && category !== 'All') params.category = category;
      if (search) params.search = search;

      const res = await blogApi.getAll(params);
      if (res.success && res.data) {
        setBlogs(res.data);
        if (res.pagination) setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Failed to load blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [category, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs();
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-16 px-4 sm:px-6 relative overflow-hidden text-center">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-300 uppercase tracking-widest bg-brand-500/20 px-3 py-1 rounded-full mb-3 border border-brand-400/30">
            <BookOpen className="w-3.5 h-3.5" /> Stories & Guides
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Travel Blog & Insights
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Local travel tips, packing checklists, seasonal guides, and hidden gems across India.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-soft border border-slate-100 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs - Hidden scrollbar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  category === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
            />
          </form>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No articles found"
            description="Try changing your search terms or category filter."
            actionLabel="Reset Filters"
            onAction={() => { setCategory('All'); setSearch(''); setPage(1); }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={`/blog/${blog.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all border border-slate-100 flex flex-col hover:-translate-y-1"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-slate-200">
                    <img
                      src={blog.coverImage || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'}
                      alt={blog.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="primary" className="bg-white/95 backdrop-blur-sm font-semibold">
                        {blog.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formatDate(blog.createdAt)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {blog.readTime || '5 min read'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-navy-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                        {blog.title}
                      </h3>

                      <p className="text-slate-500 text-xs sm:text-sm mt-2 line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={blog.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={blog.author?.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold text-slate-700">{blog.author?.name || 'Vista Team'}</span>
                      </div>

                      <span className="text-xs font-bold text-brand-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Story <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
