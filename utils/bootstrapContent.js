const Faq = require('../models/faq');
const Helpline = require('../models/helpline');
const NearbyPlace = require('../models/nearbyPlace');
const curatedFaqs = require('../data/curatedFaqs');
const curatedHelplines = require('../data/curatedHelplines');
const curatedNearbyPlaces = require('../data/curatedNearbyPlaces');

// Makes sure the curated, factual content exists the moment the server starts, so a fresh
// clone of the repo (or a freshly dropped database) never shows a blank FAQ page, an empty
// helpline directory or an empty "Nearby Places" carousel.
//
// Design rules:
//  - Idempotent: safe to run on every start.
//  - Never overwrites admin edits: existing records are left alone ($setOnInsert), except that
//    a missing image URL is back-filled on curated nearby places.
//  - FAQs are only seeded into an EMPTY collection, so an admin who deliberately deletes an
//    FAQ doesn't see it come back on the next restart.
//  - Curated content only. Demo/sample data stays in scripts/seedDemoData.js.
async function ensureCuratedContent() {
  const summary = [];

  // FAQs — only when the collection is empty
  if ((await Faq.countDocuments()) === 0) {
    await Faq.insertMany(curatedFaqs);
    summary.push(`${curatedFaqs.length} FAQs`);
  }

  // Helplines — upsert by phone number (unique per helpline)
  let helplinesAdded = 0;
  for (const h of curatedHelplines) {
    const result = await Helpline.updateOne({ number: h.number }, { $setOnInsert: h }, { upsert: true });
    if (result.upsertedCount) helplinesAdded++;
  }
  if (helplinesAdded) summary.push(`${helplinesAdded} helplines`);

  // Nearby places — upsert by name, then back-fill a missing image only
  let placesAdded = 0;
  let imagesFilled = 0;
  for (const p of curatedNearbyPlaces) {
    const result = await NearbyPlace.updateOne({ name: p.name }, { $setOnInsert: p }, { upsert: true });
    if (result.upsertedCount) placesAdded++;

    if (p.imageUrl) {
      const filled = await NearbyPlace.updateOne(
        { name: p.name, $or: [{ imageUrl: '' }, { imageUrl: { $exists: false } }] },
        { $set: { imageUrl: p.imageUrl } }
      );
      if (filled.modifiedCount) imagesFilled++;
    }
  }
  if (placesAdded) summary.push(`${placesAdded} nearby places`);
  if (imagesFilled) summary.push(`${imagesFilled} place images`);

  if (summary.length) {
    console.log(`📚 Curated content added: ${summary.join(', ')}.`);
  }
}

module.exports = { ensureCuratedContent };
