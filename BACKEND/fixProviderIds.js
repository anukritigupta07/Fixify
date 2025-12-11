// scripts/fixProviderIds.js
require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/service.model');
const Utility = require('./models/utility.model');

async function run() {
  try {
    const uri = process.env.DB_CONNECT || process.env.MONGODB_URI;
    if (!uri) throw new Error('DB connection string missing in .env (DB_CONNECT or MONGODB_URI)');

    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    // CLI options: --dry-run or --provider-id=<id>
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const providerArg = args.find(a => a.startsWith('--provider-id='));
    let provider = null;

    if (providerArg) {
      const providedId = providerArg.split('=')[1];
      provider = await Utility.findById(providedId);
      if (!provider) {
        console.log(`❌ Provider with id ${providedId} not found.`);
        process.exit(1);
      }
      console.log('✅ Using provider override:', provider._id.toString());
    } else {
      // find a provider to use as default
      provider = await Utility.findOne({ status: 'active' }) || await Utility.findOne();
      if (!provider) {
        console.log('❌ No utility (provider) found in DB. Create at least one provider first and rerun.');
        process.exit(1);
      }
      console.log('✅ Using providerId:', provider._id.toString(), 'name:', provider.fullname?.firstname || provider.email || provider._id);
    }

    // find services with null, missing, or empty providerId
    // Use native collection.find to avoid Mongoose casting empty string to ObjectId
    const missing = await Service.collection
      .find({
        $or: [
          { providerId: { $exists: false } },
          { providerId: null },
          { providerId: '' }
        ]
      })
      .toArray();
    console.log(`Found ${missing.length} services missing/empty providerId`);

    if (missing.length === 0) {
      console.log('Nothing to update. Exiting.');
      process.exit(0);
    }

    const ops = missing.map(svc => ({
      updateOne: {
        filter: { _id: svc._id },
        update: { $set: { providerId: provider._id } }
      }
    }));

    if (dryRun) {
      console.log('--- DRY RUN ---');
      console.log('Operations to perform:', ops.length);
      missing.slice(0, 20).forEach(svc => console.log('Would update service:', svc._id.toString(), svc.name));
      if (missing.length > 20) console.log(`...and ${missing.length - 20} more`);
      console.log('Run without --dry-run to apply changes, or use --provider-id=<id> to set a specific provider.');
      process.exit(0);
    }

    const result = await Service.bulkWrite(ops);
    // bulkWrite result shape can vary; print entire result for inspection
    console.log('✅ bulkWrite result:', JSON.stringify(result, null, 2));
    console.log('Updated services count (approx):', missing.length);
    process.exit(0);
  } catch (err) {
    console.error('Error in migration:', err);
    process.exit(1);
  }
}

run();
