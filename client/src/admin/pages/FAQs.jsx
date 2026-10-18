import React, { useEffect, useState } from 'react';
import { faqApi } from '../../services/faqApi';
import { HelpCircle, PlusCircle, Trash2, Edit2 } from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

export const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    question: '',
    answer: '',
    category: 'Booking',
    order: 0
  });

  const categories = ['Booking', 'Payment', 'Cancellation', 'Hotels', 'Transportation', 'Packages', 'General'];

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await faqApi.getAll();
      if (res.success && res.data) {
        setFaqs(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({ question: '', answer: '', category: 'Booking', order: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setEditingId(faq._id);
    setForm({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'Booking',
      order: faq.order || 0
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question || !form.answer) {
      toast.error('Question and Answer are required');
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await faqApi.update(editingId, form);
        toast.success('FAQ updated');
      } else {
        await faqApi.create(form);
        toast.success('FAQ created');
      }
      setIsModalOpen(false);
      fetchFaqs();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this FAQ?')) {
      try {
        const res = await faqApi.delete(id);
        if (res.success) {
          toast.success('FAQ deleted');
          setFaqs(prev => prev.filter(f => f._id !== id));
        }
      } catch (err) {
        toast.error(err.message || 'Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">FAQ Management</h1>
          <p className="text-xs text-slate-500">Configure questions and answers for customer self-service.</p>
        </div>

        <Button onClick={handleOpenCreate} size="sm">
          <PlusCircle className="w-4 h-4 mr-1.5" /> Add New FAQ
        </Button>
      </div>

      {loading ? (
        <Loader text="Loading FAQs..." />
      ) : faqs.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No FAQs created yet"
          actionLabel="Add First FAQ"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((f) => (
            <div
              key={f._id}
              className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-brand-600 uppercase bg-brand-50 px-2 py-0.5 rounded">
                  {f.category}
                </span>
                <h3 className="text-base font-bold text-navy-900 mt-2 mb-2">{f.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{f.answer}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(f)}
                  className="p-1.5 text-slate-500 hover:text-brand-600 rounded-lg hover:bg-slate-50"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(f._id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit FAQ' : 'Add FAQ'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Question *</label>
            <input
              type="text"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              required
              placeholder="e.g. What is the cancellation policy?"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Answer *</label>
            <textarea
              rows={5}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              required
              placeholder="Provide a detailed, helpful answer..."
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {editingId ? 'Update FAQ' : 'Create FAQ'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FAQs;
