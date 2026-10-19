import React, { useEffect, useState } from 'react';
import { inquiryApi } from '../../services/inquiryApi';
import { formatDate } from '../../utils/formatDate';
import { MessageSquare, Search, Trash2, CheckCircle2, PhoneCall, Mail, MessageCircle, Send } from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const statuses = ['All', 'New', 'Contacted', 'Resolved'];

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search) params.search = search;

      const res = await inquiryApi.getAll(params);
      if (res.success && res.data) {
        setInquiries(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();

    const handleUpdate = () => fetchInquiries();
    window.addEventListener('rtt_inquiries_updated', handleUpdate);
    return () => window.removeEventListener('rtt_inquiries_updated', handleUpdate);
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await inquiryApi.update(id, { status: newStatus });
      if (res.success) {
        toast.success(`Inquiry status updated to ${newStatus}`);
        fetchInquiries();
      }
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this inquiry?')) {
      try {
        const res = await inquiryApi.delete(id);
        if (res.success) {
          toast.success('Inquiry deleted');
          setInquiries(prev => prev.filter(i => i._id !== id));
        }
      } catch (err) {
        toast.error(err.message || 'Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Admin Notification Link info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-soft">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Admin Notification Active
            </span>
            <span className="text-xs text-slate-400 font-medium">Hotline: +91 90688 88578</span>
          </div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">Customer Inquiries & Leads</h1>
          <p className="text-xs text-slate-500">Inquiries submitted from website are linked to Admin contact (+91 90688 88578) for instant dispatch.</p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/919068888578"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" /> Admin WhatsApp
          </a>
          <a
            href="tel:+919068888578"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Call Admin HQ
          </a>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl p-4 shadow-soft border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchInquiries()}
            placeholder="Search inquiries..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Inquiries Table */}
      {loading ? (
        <Loader text="Loading inquiries..." />
      ) : inquiries.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No inquiries found"
          description="Inquiries submitted by travelers on the website will appear here."
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Customer Contact</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Message</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Quick Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.map((inq) => {
                  const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
                  const replyText = `Hello ${inq.name || 'Traveler'}, Vista Tour and Travels here regarding your inquiry about "${inq.subject || inq.message || 'tour or cab inquiry'}". How can we assist you today?`;

                  return (
                    <tr key={inq._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-navy-900 text-sm">{inq.name}</p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                          <a href={`tel:${inq.phone}`} className="flex items-center gap-1 hover:text-brand-600 font-medium">
                            <PhoneCall className="w-3 h-3" /> {inq.phone}
                          </a>
                          <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-brand-600">
                            <Mail className="w-3 h-3" /> {inq.email}
                          </a>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-navy-900">
                        {inq.subject || inq.destination || 'General Tour Inquiry'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={inq.message}>
                        {inq.message}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                            inq.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            inq.status === 'Contacted' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {formatDate(inq.createdAt, true)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`}?text=${encodeURIComponent(replyText)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Reply Customer on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                          <a
                            href={`tel:${inq.phone}`}
                            className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Call Customer"
                          >
                            <PhoneCall className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(inq._id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inquiries;
