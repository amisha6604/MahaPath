// Clears the generated SAMPLE content so it can be re-created with `node scripts/seedDemoData.js`
// (for example after the sample text was improved). Unlike scripts/dropDatabase.js this keeps:
//   - all user accounts (including your admin account)
//   - curated facilities, helplines, FAQs and nearby places
//
// It DELETES: all events, Lost & Found reports, incidents, traffic advisories, crowd-density
// reports and sample facilities (isDemo, or tagged "[Demo data]" by the older seed script).
//
// Usage:
//   node scripts/resetDemoContent.js --yes
//   node scripts/seedDemoData.js

require('dotenv').config();
const mongoose = require('mongoose');

const Event = require('../models/event');
const LostFound = require('../models/lostFound');
const Incident = require('../models/incident');
const TrafficDiversion = require('../models/trafficDiversion');
const CrowdReport = require('../models/crowdReport');
const Facility = require('../models/facility');

if (!process.argv.includes('--yes')) {
  console.log('This deletes all events, lost & found reports, incidents, traffic advisories,');
  console.log('crowd reports and sample facilities. Accounts and curated content are kept.');
  console.log('\nRe-run with --yes to confirm:  node scripts/resetDemoContent.js --yes');
  process.exit(0);
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const results = await Promise.all([
      Event.deleteMany({}),
      LostFound.deleteMany({}),
      Incident.deleteMany({}),
      TrafficDiversion.deleteMany({}),
      CrowdReport.deleteMany({}),
      Facility.deleteMany({ $or: [{ isDemo: true }, { description: { $regex: '\\[Demo data\\]' } }] })
    ]);
    const labels = ['events', 'lost & found reports', 'incidents', 'traffic advisories', 'crowd reports', 'sample facilities'];
    results.forEach((r, i) => console.log(`🗑️  Removed ${r.deletedCount} ${labels[i]}`));
    console.log('\n✅ Done. Now run: node scripts/seedDemoData.js');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Reset error:', err);
    process.exit(1);
  });
