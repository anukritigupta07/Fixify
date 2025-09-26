const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fixify');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
});

const Admin = mongoose.model('Admin', adminSchema);

async function createFixedAdmin() {
  try {
    // Delete existing admin if any
    await Admin.deleteMany({});
    
    const hashedPassword = await bcrypt.hash('Administrator01', 10);
    
    const admin = new Admin({
      username: 'FixifyAdmin01',
      email: 'admin@fixify.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Fixed Admin created successfully!');
    console.log('Username: FixifyAdmin01');
    console.log('Password: Administrator01');
    console.log('Login URL: http://localhost:3000/admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createFixedAdmin();