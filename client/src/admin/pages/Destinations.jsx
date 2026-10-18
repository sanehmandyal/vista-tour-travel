import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { destinationApi } from '../../services/destinationApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { PlusCircle, Search, Edit2, Trash2, ExternalLink, MapPin } from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await destinationApi.getAll({ limit: 100 });
      if (res.success && res.data) {
        setDestinations(res.data);
      }
    } catch (err) {
      console.error('Failed to load destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const res = await destinationApi.delete(id);
        if (res.success) {
          toast.success('Destination deleted successfully');
          setDestinations(prev => prev.filter(d => d._id !== id));
        }
      } catch (err) {
        toast.error(err.message || 'Failed to delete destination');
      }
    }
  };

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">Destinations</h1>
          <p className="text-xs text-slate-500">Manage vacation spots, highlights, and regional travel regions.</p>
        </div>

        <Link
          to="/admin/destinations/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Add New Destination
        </Link>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl p-4 shadow-soft border border-slate-100 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by destination name or state..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400">Total: {filtered.length}</span>
      </div>

      {/* Data Table */}
      {loading ? (
        <Loader text="Loading destinations..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No destinations found"
          description="Create your first vacation destination to get started."
          actionLabel="Add Destination"
          onAction={() => navigate('/admin/destinations/new')}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">State / Region</th>
                  <th className="py-3 px-4">Starting Price</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={d.heroImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=150&q=80'}
                        alt={d.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=150&q=80';
                        }}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-navy-900 text-sm">{d.name}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{d.shortDescription}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <span className="font-semibold">{d.state}</span>
                      <span className="text-slate-400 block text-[11px]">{d.region}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-navy-900">
                      {formatCurrency(d.startingPrice)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        d.featured ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {d.featured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        to={`/destinations/${d.slug}`}
                        target="_blank"
                        className="p-1.5 inline-block text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => navigate(`/admin/destinations/${d._id}/edit`)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(d._id, d.name)}
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

export default Destinations;
