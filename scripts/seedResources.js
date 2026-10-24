// Seeds the Facility and Helpline collections with realistic starter data so the app
// isn't empty on first run. IMPORTANT: coordinates and numbers here are best-effort
// approximations for demo purposes — verify against official Mahakumbh/Prayagraj
// authority sources before treating this as production data.
//
// Usage: node scripts/seedResources.js

require('dotenv').config();
const mongoose = require('mongoose');
const Facility = require('../models/facility');
const Helpline = require('../models/helpline');

const facilities = [
  { name: 'Sangam Ghat', type: 'Ghat', lat: 25.4292, lng: 81.8805, description: 'Confluence of Ganga, Yamuna, and Saraswati rivers — the main bathing point.' },
  { name: 'Kumbh Mela Ground Parking', type: 'Parking', lat: 25.4310, lng: 81.8790, capacity: 5000, description: 'Large vehicle parking near the mela ground.' },
  { name: 'Prayagraj Central Hospital (approx.)', type: 'Hospital', lat: 25.4358, lng: 81.8463, contact: '0532-2600000', description: 'General hospital — verify current contact and exact location.' },
  { name: 'Sangam Police Booth', type: 'Police Booth', lat: 25.4295, lng: 81.8800, contact: '112' },
  { name: 'Medical Camp - Sector 1 (approx.)', type: 'Medical Camp', lat: 25.4300, lng: 81.8770, description: 'First-aid and emergency medical camp.' }
];

const helplines = require('../data/curatedHelplines');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const existingFacilities = await Facility.countDocuments();
    const existingHelplines = await Helpline.countDocuments();

    if (existingFacilities === 0) {
      await Facility.insertMany(facilities);
      console.log(`✅ Seeded ${facilities.length} facilities.`);
    } else {
      console.log(`ℹ️ Facilities collection already has ${existingFacilities} entries — skipped to avoid duplicates.`);
    }

    if (existingHelplines === 0) {
      await Helpline.insertMany(helplines);
      console.log(`✅ Seeded ${helplines.length} helplines.`);
    } else {
      console.log(`ℹ️ Helplines collection already has ${existingHelplines} entries — skipped to avoid duplicates.`);
    }

    console.log('\n⚠️  Reminder: some coordinates, contact numbers, and names above are approximations for demo purposes.');
    console.log('   Verify against official sources before relying on this data for real use.');

    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  });
