// Drops the database that MahaPath actually connects to — using the exact same
// MONGO_URI from .env that server.js uses. This avoids the common mistake of running
// `mongosh` with no arguments (which connects to local MongoDB) when your real data
// lives in MongoDB Atlas or elsewhere.
//
// Usage: node scripts/dropDatabase.js
//
// WARNING: this deletes EVERYTHING in the database — users, events, all of it.
// There's a 5-second pause before it runs so you can Ctrl+C if you change your mind.

require('dotenv').config();
const mongoose = require('mongoose');

console.log(`⚠️  About to drop the database at: ${process.env.MONGO_URI ? process.env.MONGO_URI.replace(/\/\/.*@/, '//<hidden>@') : '(MONGO_URI not set!)'}`);
console.log('   This deletes ALL data. Press Ctrl+C now to cancel...\n');

setTimeout(() => {
  mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
      await mongoose.connection.dropDatabase();
      console.log('✅ Database dropped. Run your seed scripts again to repopulate.');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Could not drop database:', err);
      process.exit(1);
    });
}, 5000);
