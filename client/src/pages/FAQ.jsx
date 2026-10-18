import React, { useEffect, useState } from 'react';
import { faqApi } from '../services/faqApi';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import Loader from '../components/common/Loader';

export const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState('');

  const categories = [
    'All',
    'Booking',
    'Payment',
    'Cancellation',
    'Hotels',
    'Transportation',
    'Packages'
  ];

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const params = activeCategory !== 'All' ? { category: activeCategory } : {};
      const res = await faqApi.getAll(params);
      if (res.success && res.data) {
        setFaqs(res.data);
      }
    } catch (err) {
      console.error('Failed to load FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();

    const handleUpdate = () => fetchFaqs();
    window.addEventListener('rtt_faqs_updated', handleUpdate);
    return () => window.removeEventListener('rtt_faqs_updated', handleUpdate);
  }, [activeCategory]);

  const filteredFaqs = faqs.filter((faq) => {
    if (!search) return true;
    return (
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-16 px-4 sm:px-6 relative overflow-hidden text-center">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-300 uppercase tracking-widest bg-brand-500/20 px-3 py-1 rounded-full mb-3 border border-brand-400/30">
            <HelpCircle className="w-3.5 h-3.5" /> Help & Support
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Find immediate answers regarding booking procedures, payment options, cancellation policies, and travel logistics.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12">
        {/* Search & Categories */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-soft border border-slate-100 mb-8 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search frequently asked questions..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setOpenIndex(0); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordions */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader text="Loading FAQs..." />
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-100">
            No questions found matching your search.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq._id || idx}
                  className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-navy-900 hover:text-brand-600 transition-colors"
                  >
                    <span className="text-sm sm:text-base pr-4">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-brand-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;
