const Admin = require('../models/admin.model');
const User = require('../models/user.model');
const Utility = require('../models/utility.model');
const Booking = require('../models/bookings.model');
const Service = require('../models/service.model');

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
   

    const admin = await Admin.findOne({ username }).select('+password');
   
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
   
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = admin.generateAuthToken();
    res.json({ token, admin: { id: admin._id, username: admin.username, role: admin.role } });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProviders = await Utility.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalServices = await Service.countDocuments();
    const activeProviders = await Utility.countDocuments({ status: 'active' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    // Category-wise active providers with details
    const activeProvidersByCategory = await Utility.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$profession',
          count: { $sum: 1 },
          providers: {
            $push: {
              name: { $concat: ['$fullname.firstname', ' ', '$fullname.lastname'] },
              email: '$email',
              contact: '$contact',
              experience: '$experience'
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalUsers,
      totalProviders,
      totalBookings,
      totalServices,
      activeProviders,
      pendingBookings,
      completedBookings,
      activeProvidersByCategory
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all providers
exports.getAllProviders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const providers = await Utility.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Utility.countDocuments();

    res.json({
      providers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find()
      .populate('userId', 'fullname email phone')
      .populate('providerId', 'fullname email contact profession')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments();

    res.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add new user
exports.addUser = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password } = req.body;
    
    const hashedPassword = await require('bcrypt').hash(password, 10);
    
    const user = new User({
      fullname: { firstname, lastname },
      email,
      phone,
      password: hashedPassword
    });
    
    await user.save();
    res.status(201).json({ message: 'User added successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add new provider
exports.addProvider = async (req, res) => {
  try {
    const { firstname, lastname, email, contact, profession, experience, password } = req.body;
    
    const hashedPassword = await require('bcrypt').hash(password, 10);
    
    const provider = new Utility({
      fullname: { firstname, lastname },
      email,
      contact,
      profession: profession.toLowerCase(),
      experience,
      password: hashedPassword,
      status: 'active'
    });
    
    await provider.save();
    res.status(201).json({ message: 'Provider added successfully', provider });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete provider
exports.deleteProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    await Utility.findByIdAndDelete(providerId);
    res.json({ message: 'Provider deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const services = await Service.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments();

    res.json({
      services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add new service
exports.addService = async (req, res) => {
  try {
    const { name, category, description, price, image } = req.body;
    
    const service = new Service({
      name,
      category: category.toLowerCase(),
      description,
      price,
      image
    });
    
    await service.save();
    res.status(201).json({ message: 'Service added successfully', service });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    await Service.findByIdAndDelete(serviceId);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { name, category, description, price, image } = req.body;
    
    const service = await Service.findByIdAndUpdate(
      serviceId,
      {
        name,
        category: category.toLowerCase(),
        description,
        price,
        image
      },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json({ message: 'Service updated successfully', service });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    ).populate('userId', 'fullname email')
     .populate('providerId', 'fullname email');

    res.json({ message: 'Booking updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};