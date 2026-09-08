// Generates realistic-LOOKING demo data so the site doesn't feel empty during development/demos.
//
// IMPORTANT — read this before running:
// - This is FICTIONAL data for portfolio/demo purposes. It is NOT real Mahakumbh data.
// - Helplines and Nearby Places are intentionally NOT touched here — those must stay
//   factual (fake emergency numbers or fake historical claims would be actively misleading).
// - All demo users share the password below so you can log in as any of them to test
//   different roles.
// - Counts are in the hundreds, not millions — a real app doesn't need millions of rows
//   to look legitimate, and seeding that many would just make your local MongoDB slow
//   for no benefit. Adjust the COUNTS object below if you want more/fewer.
//
// Usage: node scripts/seedDemoData.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { fakerEN_IN: faker } = require('@faker-js/faker');

const User = require('../models/user');
const Event = require('../models/event');
const Facility = require('../models/facility');
const LostFound = require('../models/lostFound');
const Incident = require('../models/incident');
const TrafficDiversion = require('../models/trafficDiversion');
const CrowdReport = require('../models/crowdReport');
const locationCoords = require('../utils/locationCoords');

const DEMO_PASSWORD = 'Demo@1234';

// Faker v9+ removed pattern-string support from phone.number() — these small
// helpers replace it so the script stays compatible across faker versions.
function indianMobileNumber() {
  return '9' + faker.string.numeric(9);
}
function indianLandlineNumber() {
  return `05${faker.string.numeric(2)}-2${faker.string.numeric(6)}`;
}

const COUNTS = {
  visitors: 60,
  organizers: 12,
  events: 80,
  extraFacilities: 20,
  lostFound: 50,
  incidents: 40,
  traffic: 15
};

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function jitterCoord(base, spreadKm = 3) {
  // Roughly jitters a lat/lng by up to ~spreadKm kilometers, for scattering demo facilities
  const spreadDeg = spreadKm / 111; // ~111km per degree of latitude
  return base + (Math.random() - 0.5) * 2 * spreadDeg;
}

async function seedUsers() {
  const existing = await User.countDocuments();
  if (existing > 0) {
    console.log(`ℹ️ Users collection already has ${existing} entries — skipping user seeding.`);
    return User.find();
  }

  const hashed = await bcrypt.hash(DEMO_PASSWORD, 10);
  const users = [];

  for (let i = 0; i < COUNTS.visitors; i++) {
    users.push({
      username: `${faker.internet.username().toLowerCase().replace(/[^a-z0-9]/g, '')}${i}`,
      password: hashed,
      role: 'visitor'
    });
  }
  for (let i = 0; i < COUNTS.organizers; i++) {
    users.push({
      username: `organizer_${faker.internet.username().toLowerCase().replace(/[^a-z0-9]/g, '')}${i}`,
      password: hashed,
      role: 'organizer'
    });
  }

  const created = await User.insertMany(users);
  console.log(`✅ Seeded ${created.length} demo users (password for all: "${DEMO_PASSWORD}").`);
  return created;
}

async function seedEvents(users) {
  const existing = await Event.countDocuments();
  if (existing > 0) {
    console.log(`ℹ️ Events collection already has ${existing} entries — skipping event seeding.`);
    return;
  }

  const categories = Event.CATEGORIES;
  const locations = Object.keys(locationCoords);
  const organizers = users.filter(u => u.role === 'organizer');

  const titleTemplates = [
    'Morning Aarti at {location}',
    'Evening Ganga Aarti',
    'Shahi Snan Procession',
    'Satsang with {location} Ashram',
    'Cultural Program: Classical Music Evening',
    'Bhajan Sandhya',
    'Community Langar Seva',
    'Yoga & Meditation Session',
    'Sadhu Sabha Gathering',
    'Kirtan and Devotional Singing'
  ];

  const events = [];
  for (let i = 0; i < COUNTS.events; i++) {
    const location = randomFromArray(locations);
    const category = randomFromArray(categories);
    const organizer = randomFromArray(organizers);
    const daysOffset = faker.number.int({ min: -10, max: 60 }); // spread across past and future

    events.push({
      title: randomFromArray(titleTemplates).replace('{location}', location),
      description: faker.lorem.sentences(2),
      location,
      category,
      date: faker.date.soon({ days: 60, refDate: new Date(Date.now() + daysOffset * 86400000) }),
      time: `${faker.number.int({ min: 4, max: 20 })}:${randomFromArray(['00', '15', '30', '45'])}`,
      createdBy: organizer._id
    });
  }

  await Event.insertMany(events);
  console.log(`✅ Seeded ${events.length} demo events.`);
}

async function seedExtraFacilities(users) {
  const existingDemoFacilities = await Facility.countDocuments({ description: { $regex: '\\[Demo data\\]' } });
  if (existingDemoFacilities > 0) {
    console.log(`ℹ️ Demo facilities already seeded (${existingDemoFacilities} found) — skipping.`);
    return;
  }

  const organizers = users.filter(u => u.role === 'organizer' || u.role === 'visitor');

  // Base points to jitter around — real Prayagraj-area coordinates
  const basePoints = Object.values(locationCoords);

  const facilities = [];
  for (let i = 0; i < COUNTS.extraFacilities; i++) {
    const base = randomFromArray(basePoints);
    const type = randomFromArray(Facility.TYPES);
    facilities.push({
      name: `${type} — Demo Sector ${faker.number.int({ min: 1, max: 20 })}`,
      type,
      description: `[Demo data] Illustrative ${type.toLowerCase()} entry generated for portfolio purposes — not a real facility.`,
      lat: jitterCoord(base[0], 2),
      lng: jitterCoord(base[1], 2),
      contact: type === 'Hospital' || type === 'Police Booth' ? indianLandlineNumber() : '',
      capacity: type === 'Parking' || type === 'Medical Camp' ? faker.number.int({ min: 100, max: 3000 }) : undefined,
      createdBy: randomFromArray(organizers)._id
    });
  }

  await Facility.insertMany(facilities);
  console.log(`✅ Seeded ${facilities.length} additional demo facilities (clearly labeled as demo data).`);
}

async function seedLostFound(users) {
  const existing = await LostFound.countDocuments();
  if (existing > 0) {
    console.log(`ℹ️ LostFound collection already has ${existing} entries — skipping.`);
    return;
  }

  const locations = Object.keys(locationCoords);
  const reports = [];

  for (let i = 0; i < COUNTS.lostFound; i++) {
    const reportType = randomFromArray(LostFound.REPORT_TYPES);
    const isPerson = reportType.includes('Person');

    reports.push({
      reportType,
      name: isPerson ? faker.person.fullName() : faker.commerce.productName(),
      description: isPerson
        ? `Age ~${faker.number.int({ min: 5, max: 75 })}, ${faker.color.human()} clothing, ${faker.lorem.sentence()}`
        : faker.lorem.sentence(),
      lastSeenLocation: randomFromArray(locations),
      contactInfo: indianMobileNumber(),
      status: Math.random() > 0.4 ? 'Open' : 'Resolved',
      reportedBy: randomFromArray(users)._id
    });
  }

  await LostFound.insertMany(reports);
  console.log(`✅ Seeded ${reports.length} demo Lost & Found reports.`);
}

async function seedIncidents(users) {
  const existing = await Incident.countDocuments();
  if (existing > 0) {
    console.log(`ℹ️ Incidents collection already has ${existing} entries — skipping.`);
    return;
  }

  const locations = Object.keys(locationCoords);
  const incidents = [];

  const titlesByCategory = {
    'Medical': ['Person fainted in crowd', 'Elderly pilgrim needs assistance', 'Heat exhaustion case'],
    'Security': ['Suspicious unattended bag', 'Overcrowding at entry gate', 'Minor altercation reported'],
    'Fire': ['Small fire near food stall', 'Electrical spark reported'],
    'Crowd Crush': ['Dangerous crowd density at bridge', 'Bottleneck at Gate 4'],
    'Infrastructure': ['Barricade collapsed', 'Pontoon bridge instability reported'],
    'Other': ['Lost child reported', 'Public announcement system malfunction']
  };

  for (let i = 0; i < COUNTS.incidents; i++) {
    const category = randomFromArray(Incident.CATEGORIES);
    incidents.push({
      title: randomFromArray(titlesByCategory[category] || ['General incident reported']),
      description: faker.lorem.sentences(2),
      category,
      severity: randomFromArray(Incident.SEVERITIES),
      status: randomFromArray(Incident.STATUSES),
      location: `Near ${randomFromArray(locations)}`,
      reportedBy: randomFromArray(users)._id
    });
  }

  await Incident.insertMany(incidents);
  console.log(`✅ Seeded ${incidents.length} demo incidents.`);
}

async function seedTraffic(users) {
  const existing = await TrafficDiversion.countDocuments();
  if (existing > 0) {
    console.log(`ℹ️ TrafficDiversion collection already has ${existing} entries — skipping.`);
    return;
  }

  const organizers = users.filter(u => u.role === 'organizer');
  const diversions = [];

  for (let i = 0; i < COUNTS.traffic; i++) {
    const start = faker.date.soon({ days: 30, refDate: new Date(Date.now() - 10 * 86400000) });
    const end = new Date(start.getTime() + faker.number.int({ min: 1, max: 5 }) * 86400000);

    diversions.push({
      title: `${randomFromArray(['Route diversion', 'One-way traffic', 'Vehicle restriction'])} near ${randomFromArray(Object.keys(locationCoords))}`,
      description: faker.lorem.sentence(),
      affectedRoute: `${faker.location.street()} area`,
      severity: randomFromArray(['Low', 'Medium', 'High']),
      startDate: start,
      endDate: end,
      createdBy: randomFromArray(organizers)._id
    });
  }

  await TrafficDiversion.insertMany(diversions);
  console.log(`✅ Seeded ${diversions.length} demo traffic advisories.`);
}

async function seedCrowdReports(users) {
  const existing = await CrowdReport.countDocuments();
  if (existing > 0) {
    console.log(`ℹ️ CrowdReport collection already has ${existing} entries — skipping.`);
    return;
  }

  const facilities = await Facility.find();
  const organizers = users.filter(u => u.role === 'organizer' || u.role === 'admin');
  if (organizers.length === 0) {
    console.log('ℹ️ No organizer/admin users found — skipping crowd report seeding.');
    return;
  }

  const reports = [];
  for (const facility of facilities) {
    const reportCount = faker.number.int({ min: 1, max: 4 });
    for (let i = 0; i < reportCount; i++) {
      reports.push({
        facility: facility._id,
        density: randomFromArray(CrowdReport.DENSITY_LEVELS),
        note: Math.random() > 0.6 ? faker.lorem.sentence() : '',
        reportedBy: randomFromArray(organizers)._id,
        createdAt: faker.date.recent({ days: 5 })
      });
    }
  }

  await CrowdReport.insertMany(reports);
  console.log(`✅ Seeded ${reports.length} demo crowd density reports across ${facilities.length} facilities.`);
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('🌱 Seeding demo data...\n');

    const users = await seedUsers();
    await seedEvents(users);
    await seedExtraFacilities(users);
    await seedLostFound(users);
    await seedIncidents(users);
    await seedTraffic(users);
    await seedCrowdReports(users);

    console.log('\n✅ Done. This is fictional demo data for development/portfolio purposes.');
    console.log(`   Log in as any demo user with password: ${DEMO_PASSWORD}`);
    console.log('   Helplines and Nearby Places were NOT touched — those stay factual/curated.');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  });
