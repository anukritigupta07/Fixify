const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const utilitySchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, 'Firstname must be at least 3 characters long'],
    },
    lastname: {
      type: String,
      minlength: [3, 'Lastname must be at least 3 characters long'],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  contact: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
    enum: ['plumber', 'electrician', 'mechanic', 'technician', 'carpenter', 'painter'],
  },
  experience: {
    type: Number,
    required: true,
  },
  socketId: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'busy'],
    default: 'inactive',
  },
}, { timestamps: true });

// 🔐 Hash password
utilitySchema.statics.hashPassword = async function (password) {
  return bcrypt.hash(password, 10);
};

// ✅ Compare password
utilitySchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// 🔑 Generate auth token
utilitySchema.methods.generateAuthToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

module.exports = mongoose.model('utility', utilitySchema);
