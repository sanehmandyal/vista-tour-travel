import Service from '../models/Service.js';
import { createSlug } from '../utils/slugify.js';

export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const slug = req.body.slug || createSlug(req.body.title);
    const service = await Service.create({ ...req.body, slug });
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndUpdate(id, req.body, { new: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.status(200).json({ success: true, message: 'Service updated successfully', data: service });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};
