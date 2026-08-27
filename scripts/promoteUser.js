// One-off CLI script to promote a user's role since there's no admin dashboard yet (that's Phase 5).
// Usage:
//   node scripts/promoteUser.js <username> <role>
//   node scripts/promoteUser.js amish organizer
//   node scripts/promoteUser.js amish admin

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

const [, , username, role] = process.argv;

if (!username || !role) {
  console.log('Usage: node scripts/promoteUser.js <username> <role>');
  console.log('Roles: visitor | organizer | admin');
  process.exit(1);
}

if (!['visitor', 'organizer', 'admin'].includes(role)) {
  console.log(`❌ Invalid role "${role}". Must be one of: visitor, organizer, admin`);
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      console.log(`❌ No user found with username "${username}". Register that account first.`);
      process.exit(1);
    }
    user.role = role;
    await user.save();
    console.log(`✅ ${user.username} is now a "${role}". They must log out and log back in for it to take effect.`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Could not connect to MongoDB:', err);
    process.exit(1);
  });
