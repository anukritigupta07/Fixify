const mongoose = require('mongoose');
const Service = require('./models/service.model');
const dotenv = require('dotenv');
dotenv.config();
// Provider ID: either set via env PROVIDER_ID or auto-detect an existing utility (provider)
const providerIdFromEnv = process.env.PROVIDER_ID && process.env.PROVIDER_ID.trim() !== '' ? process.env.PROVIDER_ID : null;

let providerId = providerIdFromEnv; // will be resolved before inserting

const sampleServices = [
  {
    name: 'Professional Plumbing Service',
    category: 'plumber',
    description: 'Expert plumbing solutions for all your water and drainage needs.',
    price: 500,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center',
    providerId,
  },
  {
    name: 'Home Electrical Repair',
    category: 'electrician',
    description: 'Licensed electricians for safe and reliable electrical installations and repairs.',
    price: 600,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&crop=center',
    providerId,
  },
  {
    name: 'AC & Appliance Technician',
    category: 'technician',
    description: 'Professional repair and maintenance for all home appliances and air conditioning systems.',
    price: 450,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&crop=center',
    providerId,
  },
];

async function createSampleServices() {
  try {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log('✅ Connected to MongoDB');

    // If PROVIDER_ID was provided, use it for all services
    if (providerId) {
      console.log('✅ Using providerId from env for all services:', providerId);
      const servicesToInsert = sampleServices.map(s => ({ ...s, providerId }));
      await Service.deleteMany({});
      console.log('🧹 Cleared existing services');
      const created = await Service.insertMany(servicesToInsert);
      console.log(`✅ Created ${created.length} services with providerId ${providerId}`);
      process.exit(0);
    }

    // Otherwise, assign provider per service based on profession (category)
    const Utility = require('./models/utility.model');

    // Collect professions needed from sample services
    const professions = [...new Set(sampleServices.map(s => s.category))];

    // Map profession -> providerId (ensure provider exists)
    const professionProviderMap = {};
    for (const prof of professions) {
      let provider = await Utility.findOne({ profession: prof, status: 'active' }) || await Utility.findOne({ profession: prof });
      if (!provider) {
        // create a simple provider for this profession
        const password = 'Password123!';
        let hashed = password;
        try {
          if (typeof Utility.hashPassword === 'function') {
            hashed = await Utility.hashPassword(password);
          }
        } catch (err) {
          console.warn('⚠️ Could not hash password for new provider:', err);
        }
        const email = `sample_${prof}@fixify.local`;
        provider = await Utility.create({
          fullname: { firstname: prof.charAt(0).toUpperCase() + prof.slice(1), lastname: 'Provider' },
          email,
          password: hashed,
          contact: '9999999999',
          profession: prof,
          experience: 1,
          status: 'active',
        });
        console.log('➕ Created sample provider for profession', prof, '->', provider._id.toString());
      } else {
        console.log('✅ Found provider for profession', prof, '->', provider._id.toString());
      }
      professionProviderMap[prof] = provider._id.toString();
    }

    // Attach providerId per service according to profession
    const servicesToInsert = sampleServices.map(s => ({ ...s, providerId: professionProviderMap[s.category] || Object.values(professionProviderMap)[0] }));

    await Service.deleteMany({});
    console.log('🧹 Cleared existing services');

    const created = await Service.insertMany(servicesToInsert);
    console.log(`✅ Created ${created.length} services assigned to providers by profession`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating services:', error);
    process.exit(1);
  }
}

createSampleServices();
