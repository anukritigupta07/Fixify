const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'super_admin']
  }
}, { timestamps: true });

adminSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
};

adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const adminModel = mongoose.model('Admin', adminSchema);
module.exports = adminModel;