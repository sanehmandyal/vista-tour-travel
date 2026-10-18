import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogApi } from '../../services/blogApi';
import { formatDate } from '../../utils/formatDate';
import { PlusCircle, Search, Edit2, Trash2, ExternalLink, BookOpen } from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await blogApi.getAll({ limit: 100 });
      if (res.success && res.data) {
        setBlogs(res.data);
      }
    } catch (err) {
      console.error('Failed to load blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete article "${title}"?`)) {
      try {
        const res = await blogApi.delete(id);
        if (res.success) {
          toast.success('Article deleted');
          setBlogs(prev => prev.filter(b => b._id !== id));
        }
      } catch (err) {
        toast.error(err.message || 'Failed to delete');
      }
    }
  };

  const filtered = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">Blog CMS</h1>
          <p className="text-xs text-slate-500">Publish itineraries, travel advice, and destination feature articles.</p>
        </div>

        <Link
          to="/admin/blogs/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Add New Article
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-soft border border-slate-100 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400">Total: {filtered.length}</span>
      </div>

      {loading ? (
        <Loader text="Loading articles..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No articles found"
          description="Write your first travel guide or tip article."
          actionLabel="Write Article"
          onAction={() => navigate('/admin/blogs/new')}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Published</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={b.coverImage || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=150&q=80'}
                        alt={b.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=150&q=80';
                        }}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-navy-900 text-sm line-clamp-1">{b.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{b.excerpt}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700">
                        {b.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {b.author?.name || 'Vista Team'}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatDate(b.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        to={`/blog/${b.slug}`}
                        target="_blank"
                        className="p-1.5 inline-block text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                        title="View Public"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => navigate(`/admin/blogs/${b._id}/edit`)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(b._id, b.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
