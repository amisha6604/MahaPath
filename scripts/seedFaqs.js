// Seeds the Faq collection with the curated content provided for MahaPath.
// Priority 1-10 marks the "Top 10" recommended for homepage/main FAQ visibility;
// everything else uses higher priority numbers (100+) and only shows on the full /faq page.
//
// Usage: node scripts/seedFaqs.js

require('dotenv').config();
const mongoose = require('mongoose');
const Faq = require('../models/faq');

const faqs = require('../data/curatedFaqs');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const existing = await Faq.countDocuments();
    if (existing > 0) {
      console.log(`ℹ️ Faq collection already has ${existing} entries — skipped to avoid duplicates.`);
      return process.exit(0);
    }

    await Faq.insertMany(faqs);
    console.log(`✅ Seeded ${faqs.length} FAQs (10 marked as Top 10 for homepage visibility).`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  });
