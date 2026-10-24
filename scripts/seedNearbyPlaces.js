// Seeds the NearbyPlace collection with popular pilgrimage stops near Prayagraj.
// These are the Varanasi/Ayodhya/Mirzapur locations that were previously (incorrectly)
// mixed into the Mahakumbh event map — they belong here instead, as "worth visiting
// nearby" content, not as if they were part of the Mahakumbh site itself.
//
// Usage: node scripts/seedNearbyPlaces.js

require('dotenv').config();
const mongoose = require('mongoose');
const NearbyPlace = require('../models/nearbyPlace');

const places = require('../data/curatedNearbyPlaces');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const existing = await NearbyPlace.countDocuments();
    if (existing > 0) {
      console.log(`ℹ️ NearbyPlace collection already has ${existing} entries — skipped to avoid duplicates.`);
      return process.exit(0);
    }

    await NearbyPlace.insertMany(places);
    console.log(`✅ Seeded ${places.length} nearby places.`);
    console.log('ℹ️  imageUrl fields are empty — cards will show a themed placeholder until you add real image URLs via /nearby/edit/:id (admin only).');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  });
