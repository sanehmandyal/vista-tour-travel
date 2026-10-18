import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { packageApi } from '../../services/packageApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { PlusCircle, Search, Edit2, Trash2, ExternalLink, Package as PkgIcon } from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await packageApi.getAll({ limit: 100, status: '' });
      if (res.success && res.data) {
        setPackages(res.data);
      }
    } catch (err) {
      console.error('Failed to load packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const res = await packageApi.delete(id);
        if (res.success) {
          toast.success('Package deleted successfully');
          setPackages(prev => prev.filter(p => p._id !== id));
        }
      } catch (err) {
        toast.error(err.message || 'Failed to delete package');
      }
    }
  };

  const filtered = packages.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.destinationName && p.destinationName.toLowerCase().includes(search.toLowerCase())) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">Tour Packages</h1>
          <p className="text-xs text-slate-500">Manage all-inclusive itineraries, pricing, discounts, and duration.</p>
        </div>

        <Link
          to="/admin/packages/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Add New Package
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-soft border border-slate-100 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, destination, or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400">Total: {filtered.length}</span>
      </div>

      {/* Data Table */}
      {loading ? (
        <Loader text="Loading packages..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={PkgIcon}
          title="No tour packages found"
          description="Create your first vacation package to start taking bookings."
          actionLabel="Add Package"
          onAction={() => navigate('/admin/packages/new')}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Price / Discount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={pkg.featuredImage || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=150&q=80'}
                        alt={pkg.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=150&q=80';
                        }}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-navy-900 text-sm line-clamp-1">{pkg.title}</h4>
                        <p className="text-[11px] text-slate-400">⭐ {pkg.rating} ({pkg.reviewsCount} reviews)</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-navy-900">
                      {pkg.destinationName || pkg.destination?.name || 'India'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700">
                        {pkg.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {pkg.duration}
                    </td>
                    <td className="py-3 px-4 font-bold text-navy-900">
                      <div>{formatCurrency(pkg.discountedPrice || pkg.price)}</div>
                      {pkg.discountedPrice > 0 && (
                        <div className="text-[10px] text-slate-400 line-through">{formatCurrency(pkg.price)}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pkg.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        to={`/packages/${pkg.slug}`}
                        target="_blank"
                        className="p-1.5 inline-block text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => navigate(`/admin/packages/${pkg._id}/edit`)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg._id, pkg.title)}
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

export default Packages;
