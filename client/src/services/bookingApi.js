import axiosClient from './axiosClient';

const STORAGE_KEY = 'rtt_custom_bookings';

const defaultBookings = [];

const FAKE_BOOKING_IDS = new Set(['bk-1', 'bk-2', 'bk-3', 'bk-4', 'bk-5']);
const FAKE_BOOKING_NUMBERS = new Set([
  'rtt-2026-108',
  'rtt-2026-109',
  'rtt-2026-110',
  'rtt-2026-111',
  'rtt-2026-112'
]);
const FAKE_BOOKING_NAMES = new Set([
  'aarav sharma',
  'vikram malhotra',
  'priya sundaram',
  'sunil mehta',
  'dr. rajesh khanna',
  'rajesh khanna'
]);
const FAKE_BOOKING_EMAILS = new Set([
  'aarav.sharma@gmail.com',
  'vikram.m@gmail.com',
  'priya.sundaram@yahoo.com',
  'sunil.mehta@corp.in',
  'rajesh.khanna@med.org'
]);

export const isFakeBooking = (b) => {
  if (!b) return true;
  if (b._id && FAKE_BOOKING_IDS.has(b._id.toLowerCase())) return true;
  if (b.bookingNumber && FAKE_BOOKING_NUMBERS.has(b.bookingNumber.toLowerCase())) return true;
  const customer = (b.customerName || b.user?.name || '').toLowerCase().trim();
  if (customer && FAKE_BOOKING_NAMES.has(customer)) return true;
  const email = (b.email || b.user?.email || '').toLowerCase().trim();
  if (email && FAKE_BOOKING_EMAILS.has(email)) return true;
  return false;
};

const getLocalBookings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(b => !isFakeBooking(b));
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
        }
        return cleaned;
      }
    }
  } catch (e) {
    console.warn('Error reading local bookings:', e);
  }
  return defaultBookings;
};

const saveLocalBookings = (list) => {
  try {
    const cleaned = (list || []).filter(b => !isFakeBooking(b));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    window.dispatchEvent(new CustomEvent('vtt_bookings_updated', { detail: cleaned }));
    window.dispatchEvent(new CustomEvent('rtt_bookings_updated', { detail: cleaned }));
  } catch (e) {
    console.warn('Error saving local bookings:', e);
  }
};

export const bookingApi = {
  create: async (bookingData) => {
    const list = getLocalBookings();
    const newBooking = {
      ...bookingData,
      _id: `bk-custom-${Date.now()}`,
      bookingNumber: `VTT-2026-${Math.floor(100 + Math.random() * 900)}`,
      bookingStatus: 'Pending',
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString()
    };
    const updated = [newBooking, ...list];
    saveLocalBookings(updated);

    try {
      await axiosClient.post('/bookings', bookingData);
    } catch (e) {}
    return { success: true, message: 'Booking request placed successfully!', data: newBooking };
  },

  getAll: async (params = {}) => {
    let list = [];
    try {
      const res = await axiosClient.get('/bookings', { params });
      if (res && res.success && Array.isArray(res.data)) {
        const remoteCleaned = res.data.filter(b => !isFakeBooking(b));
        const local = getLocalBookings();
        const extraLocal = local.filter(b => !remoteCleaned.some(remote => remote._id === b._id));
        list = [...extraLocal, ...remoteCleaned];
      } else {
        list = getLocalBookings();
      }
    } catch (err) {
      list = getLocalBookings();
    }
    if (params.status && params.status !== 'All') {
      list = list.filter(b => b.bookingStatus?.toLowerCase() === params.status?.toLowerCase());
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(b =>
        b.customerName?.toLowerCase().includes(q) ||
        b.bookingNumber?.toLowerCase().includes(q) ||
        b.phone?.toLowerCase().includes(q) ||
        b.service?.toLowerCase().includes(q)
      );
    }
    return {
      success: true,
      data: list,
      pagination: { total: list.length, totalPages: Math.ceil(list.length / (params.limit || 12)) || 1, page: params.page || 1 }
    };
  },

  getById: async (id) => {
    try {
      const res = await axiosClient.get(`/bookings/${id}`);
      if (res && res.success && res.data) return res;
    } catch (e) {}
    const list = getLocalBookings();
    const found = list.find(b => b._id === id || b.bookingNumber === id);
    if (found) return { success: true, data: found };
    return { success: false, message: 'Booking not found' };
  },

  updateStatus: async (id, statusData) => {
    const list = getLocalBookings();
    const updated = list.map(b => (b._id === id ? { ...b, ...statusData } : b));
    saveLocalBookings(updated);

    try {
      await axiosClient.put(`/bookings/${id}/status`, statusData);
    } catch (e) {}
    const found = updated.find(b => b._id === id);
    return { success: true, data: found };
  },

  delete: async (id) => {
    const list = getLocalBookings();
    const filtered = list.filter(b => b._id !== id);
    saveLocalBookings(filtered);

    try {
      await axiosClient.delete(`/bookings/${id}`);
    } catch (e) {}
    return { success: true, message: 'Booking deleted successfully' };
  }
};

export default bookingApi;
