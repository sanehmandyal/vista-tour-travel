import React, { useEffect, useState } from 'react';
import { pageApi } from '../../services/pageApi';
import { processDeviceImage } from '../../utils/imageUpload';
import {
  FileText,
  Save,
  Upload,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Settings2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export const PagesCMS = () => {
  const [pages, setPages] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('home');
  const [pageData, setPageData] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [activeTab, setActiveTab] = useState('hero'); // 'hero', 'sections', 'seo'

  const fetchPagesList = async () => {
    setLoadingList(true);
    try {
      const res = await pageApi.getAll();
      if (res.success && Array.isArray(res.data)) {
        setPages(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  const loadPage = async (slug) => {
    setLoadingPage(true);
    try {
      const res = await pageApi.getBySlug(slug);
      if (res.success && res.data) {
        setPageData(res.data);
      } else {
        toast.error(`Could not load page content for ${slug}`);
      }
    } catch (err) {
      toast.error('Failed to load page');
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchPagesList();
  }, []);

  useEffect(() => {
    if (selectedSlug) {
      loadPage(selectedSlug);
    }
  }, [selectedSlug]);

  const handleHeroChange = (field, value) => {
    setPageData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value
      }
    }));
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingHero(true);
      const dataUri = await processDeviceImage(file, 1920, 1080, 0.85);
      handleHeroChange('image', dataUri);
      toast.success('Hero photo loaded from device!');
    } catch (err) {
      toast.error(err.message || 'Image processing failed');
    } finally {
      setUploadingHero(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSectionChange = (sectionIndex, field, value) => {
    setPageData(prev => {
      const updated = [...(prev.sections || [])];
      updated[sectionIndex] = {
        ...updated[sectionIndex],
        [field]: value
      };
      return { ...prev, sections: updated };
    });
  };

  const handleSectionImageUpload = async (sectionIndex, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUri = await processDeviceImage(file, 1200, 800, 0.85);
      handleSectionChange(sectionIndex, 'image', dataUri);
      toast.success('Section image updated!');
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleItemChange = (sectionIndex, itemIndex, field, value) => {
    setPageData(prev => {
      const updatedSections = [...(prev.sections || [])];
      const updatedItems = [...(updatedSections[sectionIndex].items || [])];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        [field]: value
      };
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        items: updatedItems
      };
      return { ...prev, sections: updatedSections };
    });
  };

  const handleAddItem = (sectionIndex) => {
    setPageData(prev => {
      const updatedSections = [...(prev.sections || [])];
      const items = [...(updatedSections[sectionIndex].items || [])];
      items.push({
        title: 'New Feature / Point',
        description: 'Describe this feature or value proposition...',
        icon: 'Sparkles',
        link: '',
        stat: ''
      });
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        items
      };
      return { ...prev, sections: updatedSections };
    });
    toast.success('Added new item block');
  };

  const handleRemoveItem = (sectionIndex, itemIndex) => {
    setPageData(prev => {
      const updatedSections = [...(prev.sections || [])];
      const items = updatedSections[sectionIndex].items.filter((_, idx) => idx !== itemIndex);
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        items
      };
      return { ...prev, sections: updatedSections };
    });
  };

  const handleToggleSection = (sectionIndex) => {
    setPageData(prev => {
      const updated = [...(prev.sections || [])];
      updated[sectionIndex] = {
        ...updated[sectionIndex],
        isEnabled: !updated[sectionIndex].isEnabled
      };
      return { ...prev, sections: updated };
    });
  };

  const handleSavePage = async () => {
    if (!pageData) return;
    try {
      setSaving(true);
      const res = await pageApi.update(selectedSlug, pageData);
      if (res.success) {
        toast.success(`"${pageData.title}" updated & published globally!`);
        setPageData(res.data);
      } else {
        toast.error('Failed to update page');
      }
    } catch (err) {
      toast.error(err.message || 'Error saving page content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">
            Dynamic Pages & CMS
          </h1>
          <p className="text-xs text-slate-500">
            Edit text, headings, hero banners, and sections of public pages without editing source code.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={selectedSlug === 'home' ? '/' : `/${selectedSlug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all"
          >
            <ExternalLink className="w-4 h-4 text-brand-600" /> View Live Page
          </a>

          <Button
            onClick={handleSavePage}
            disabled={saving || loadingPage}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving to Database...' : 'Save & Publish'}
          </Button>
        </div>
      </div>

      {/* Page Selector Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-soft border border-slate-100 flex flex-wrap gap-2">
        {pages.map(p => (
          <button
            key={p.slug}
            onClick={() => setSelectedSlug(p.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedSlug === p.slug
                ? 'bg-navy-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            {p.title || p.slug.toUpperCase()}
          </button>
        ))}
      </div>

      {loadingPage || !pageData ? (
        <Loader text={`Loading ${selectedSlug} content from database...`} />
      ) : (
        <div className="space-y-6">
          {/* Main Editing Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-6">
            {/* Page Title & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex-1 max-w-lg">
                <label className="text-xs font-bold text-slate-700 block mb-1">Page Title</label>
                <input
                  type="text"
                  value={pageData.title || ''}
                  onChange={(e) => setPageData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full text-base font-bold rounded-xl border border-slate-200 px-3.5 py-2 focus:outline-none focus:border-brand-500 text-navy-900"
                />
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
                  <button
                    type="button"
                    onClick={() => setPageData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      pageData.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {pageData.isPublished ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-slate-400" />}
                    {pageData.isPublished ? 'Published Globally' : 'Draft Mode'}
                  </button>
                </div>
              </div>
            </div>

            {/* Inner Subtabs: Hero vs Sections vs SEO */}
            <div className="flex border-b border-slate-200 gap-6 text-xs font-bold text-slate-500">
              <button
                onClick={() => setActiveTab('hero')}
                className={`pb-3 transition-colors ${activeTab === 'hero' ? 'border-b-2 border-brand-600 text-brand-600' : 'hover:text-navy-900'}`}
              >
                1. Hero Banner
              </button>
              <button
                onClick={() => setActiveTab('sections')}
                className={`pb-3 transition-colors flex items-center gap-1.5 ${activeTab === 'sections' ? 'border-b-2 border-brand-600 text-brand-600' : 'hover:text-navy-900'}`}
              >
                2. Page Sections ({pageData.sections?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('seo')}
                className={`pb-3 transition-colors ${activeTab === 'seo' ? 'border-b-2 border-brand-600 text-brand-600' : 'hover:text-navy-900'}`}
              >
                3. SEO Meta
              </button>
            </div>

            {/* Tab 1: Hero Banner */}
            {activeTab === 'hero' && (
              <div className="space-y-6 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Hero Badge / Pill Tag</label>
                    <input
                      type="text"
                      value={pageData.hero?.badge || ''}
                      onChange={(e) => handleHeroChange('badge', e.target.value)}
                      placeholder="e.g. 5.0 ★ Google Rated • 50+ Verified Reviews"
                      className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Hero Main Heading</label>
                    <input
                      type="text"
                      value={pageData.hero?.title || ''}
                      onChange={(e) => handleHeroChange('title', e.target.value)}
                      placeholder="Main powerful headline on this page..."
                      className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-bold text-navy-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Hero Subtitle / Description</label>
                    <textarea
                      rows={3}
                      value={pageData.hero?.subtitle || ''}
                      onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                      placeholder="Supporting descriptive paragraph below headline..."
                      className="w-full text-sm rounded-xl border border-slate-200 p-3.5 focus:outline-none focus:border-brand-500 font-normal leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Primary Button Label</label>
                    <input
                      type="text"
                      value={pageData.hero?.buttonText || ''}
                      onChange={(e) => handleHeroChange('buttonText', e.target.value)}
                      placeholder="e.g. Explore Destinations, Book Now"
                      className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Primary Button Link</label>
                    <input
                      type="text"
                      value={pageData.hero?.buttonLink || ''}
                      onChange={(e) => handleHeroChange('buttonLink', e.target.value)}
                      placeholder="e.g. /destinations, /contact, /booking"
                      className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
                    />
                  </div>
                </div>

                {/* Hero Image Upload */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Hero Background Image</span>
                    <span className="text-[11px] text-slate-400 font-normal">Stored in MongoDB Atlas</span>
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {pageData.hero?.image ? (
                      <div className="relative w-44 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
                        <img
                          src={pageData.hero.image}
                          alt="Hero Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-44 h-24 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}

                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="text"
                        value={pageData.hero?.image || ''}
                        onChange={(e) => handleHeroChange('image', e.target.value)}
                        placeholder="Paste image URL (https://...)"
                        className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2 bg-white focus:outline-none focus:border-brand-500"
                      />

                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-navy-900 text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                          <Upload className="w-3.5 h-3.5 text-brand-600" />
                          <span>{uploadingHero ? 'Processing...' : 'Upload from Device / Gallery'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleHeroImageUpload}
                            disabled={uploadingHero}
                            className="hidden"
                          />
                        </label>
                        {pageData.hero?.image && (
                          <button
                            type="button"
                            onClick={() => handleHeroChange('image', '')}
                            className="text-xs text-rose-600 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Sections */}
            {activeTab === 'sections' && (
              <div className="space-y-6 pt-2">
                {(!pageData.sections || pageData.sections.length === 0) ? (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-600">No custom sections defined for this page yet.</p>
                  </div>
                ) : (
                  pageData.sections.map((section, sIdx) => (
                    <div
                      key={section.sectionId || sIdx}
                      className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-navy-900 text-white flex items-center justify-center text-xs font-black">
                            {sIdx + 1}
                          </span>
                          <div>
                            <h3 className="text-sm font-bold text-navy-900">{section.name || section.sectionId}</h3>
                            <span className="text-[11px] text-slate-400 font-mono">ID: {section.sectionId}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleSection(sIdx)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              section.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {section.isEnabled ? 'Active' : 'Disabled'}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Section Title</label>
                          <input
                            type="text"
                            value={section.title || ''}
                            onChange={(e) => handleSectionChange(sIdx, 'title', e.target.value)}
                            className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:border-brand-500 font-semibold text-navy-900"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Badge / Tag</label>
                          <input
                            type="text"
                            value={section.badge || ''}
                            onChange={(e) => handleSectionChange(sIdx, 'badge', e.target.value)}
                            className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:border-brand-500 font-medium"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700 block mb-1">Section Subtitle / Tagline</label>
                          <input
                            type="text"
                            value={section.subtitle || ''}
                            onChange={(e) => handleSectionChange(sIdx, 'subtitle', e.target.value)}
                            className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:border-brand-500 font-medium"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                          <textarea
                            rows={3}
                            value={section.description || ''}
                            onChange={(e) => handleSectionChange(sIdx, 'description', e.target.value)}
                            className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-white focus:outline-none focus:border-brand-500 leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Items / Points in this Section */}
                      <div className="pt-2 border-t border-slate-200/60">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-navy-900">
                            Cards / Key Points ({section.items?.length || 0})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddItem(sIdx)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Point
                          </button>
                        </div>

                        {section.items && section.items.length > 0 && (
                          <div className="space-y-3">
                            {section.items.map((item, iIdx) => (
                              <div
                                key={iIdx}
                                className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                              >
                                <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center text-[11px] font-bold shrink-0">
                                  {iIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={item.title || ''}
                                  onChange={(e) => handleItemChange(sIdx, iIdx, 'title', e.target.value)}
                                  placeholder="Item Title"
                                  className="w-full sm:w-1/3 text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 focus:outline-none focus:border-brand-500 font-bold"
                                />
                                <input
                                  type="text"
                                  value={item.description || ''}
                                  onChange={(e) => handleItemChange(sIdx, iIdx, 'description', e.target.value)}
                                  placeholder="Item Description"
                                  className="flex-1 w-full text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 focus:outline-none focus:border-brand-500 font-normal"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(sIdx, iIdx)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 shrink-0"
                                  title="Remove Item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: SEO */}
            {activeTab === 'seo' && (
              <div className="space-y-5 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Meta Browser Title</label>
                  <input
                    type="text"
                    value={pageData.metaTitle || ''}
                    onChange={(e) => setPageData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Meta Description</label>
                  <textarea
                    rows={3}
                    value={pageData.metaDescription || ''}
                    onChange={(e) => setPageData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    className="w-full text-xs rounded-xl border border-slate-200 p-3.5 focus:outline-none focus:border-brand-500 leading-relaxed font-normal"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PagesCMS;
