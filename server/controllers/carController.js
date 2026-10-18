import Car from '../models/Car.js';

const getExactCarImage = (name = '') => {
  const n = String(name).toLowerCase();
  if (n.includes('hycross') || n.includes('zenix')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/2023_Toyota_Kijang_Innova_Zenix_2.0_Q_Hybrid_Modellista_(front),_West_Surabaya.jpg?width=800';
  }
  if (n.includes('crysta') || (n.includes('innova') && !n.includes('hycross'))) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Innova_Crysta_2.4_Z_front_right.jpg?width=800';
  }
  if (n.includes('ertiga')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Ertiga(2).jpg?width=800';
  }
  if (n.includes('dzire') || n.includes('swift')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Dzire_VXi_VVT_(front).JPG?width=800';
  }
  if (n.includes('etios')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Etios_1.5_XLS_Sedan_2019.jpg?width=800';
  }
  if (n.includes('alto')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_-_Alto_800_LXi.JPG?width=800';
  }
  if (n.includes('wagonr') || n.includes('wagon r')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/2018_Suzuki_Karimun_Wagon_R_GL_(front).jpg?width=800';
  }
  if (n.includes('scorpio')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahindra_Scorpio.jpg?width=800';
  }
  if (n.includes('fortuner')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Fortuner_2.8_GR_Sport_4x4_2022.jpg?width=800';
  }
  if (n.includes('urbania')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller_Luxury.jpg?width=800';
  }
  if (n.includes('tempo') || n.includes('traveller')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller,_Leh-Manali_Highway.jpg?width=800';
  }
  return 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Innova_Crysta_2.4_Z_front_right.jpg?width=800';
};

const normalizeCar = (car) => {
  if (!car) return car;
  const doc = car.toObject ? car.toObject() : { ...car };
  const isGeneric = !doc.image || 
    doc.image.includes('images.unsplash.com') || 
    doc.image.includes('2018_Maruti_Suzuki_Dzire') ||
    doc.image.includes('2019_Maruti_Suzuki_Wagon');
  if (isGeneric) {
    doc.image = getExactCarImage(doc.name);
  }
  return doc;
};

// @desc    Get all cars / fleet models
// @route   GET /api/cars
// @access  Public
export const getCars = async (req, res, next) => {
  try {
    const filter = {};
    // If not requested by admin, default to available only
    if (req.query.all !== 'true') {
      filter.isAvailable = true;
    }
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }

    const cars = await Car.find(filter).sort({ order: 1, createdAt: -1 });
    const normalizedCars = cars.map(normalizeCar);
    res.status(200).json({
      success: true,
      count: normalizedCars.length,
      data: normalizedCars
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
export const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car model not found' });
    }
    res.status(200).json({
      success: true,
      data: normalizeCar(car)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new car model
// @route   POST /api/cars
// @access  Private/Admin
export const createCar = async (req, res, next) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Car model added to fleet successfully',
      data: car
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update car model
// @route   PUT /api/cars/:id
// @access  Private/Admin
export const updateCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const car = await Car.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car model not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Car model updated successfully',
      data: car
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete car model
// @route   DELETE /api/cars/:id
// @access  Private/Admin
export const deleteCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const car = await Car.findByIdAndDelete(id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car model not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Car model deleted from fleet successfully'
    });
  } catch (error) {
    next(error);
  }
};
