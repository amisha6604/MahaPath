// Generates realistic-LOOKING sample data so the site doesn't feel empty during development/demos.
// Text comes from curated pools in data/demoText.js (no lorem ipsum, no random product names).
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
const T = require('../data/demoText');

const DEMO_PASSWORD = 'Demo@1234';

// Faker v9+ removed pattern-string support from phone.number() — these small
// helpers replace it so the script stays compatible across faker versions.
function indianMobileNumber() {
  return '9' + faker.string.numeric(9);
}
function indianLandlineNumber() {
  return `0532-2${faker.string.numeric(6)}`; // Prayagraj STD code
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

  const allLocations = Object.keys(locationCoords);
  const organizers = users.filter(u => u.role === 'organizer');

  const events = [];
  for (let i = 0; i < COUNTS.events; i++) {
    const tpl = randomFromArray(T.EVENT_TEMPLATES);
    const pool = tpl.places.filter(l => allLocations.includes(l));
    const location = randomFromArray(pool.length ? pool : allLocations);

    const date = new Date(Date.now() + faker.number.int({ min: -10, max: 60 }) * 86400000);
    date.setHours(0, 0, 0, 0);

    events.push({
      title: tpl.title,
      description: randomFromArray(tpl.descriptions),
      location,
      category: tpl.category,
      date,
      time: randomFromArray(tpl.times),
      createdBy: randomFromArray(organizers)._id
    });
  }

  await Event.insertMany(events);
  console.log(`✅ Seeded ${events.length} sample events.`);
}

async function seedExtraFacilities(users) {
  const existingSample = await Facility.countDocuments({
    $or: [{ isDemo: true }, { description: { $regex: '\\[Demo data\\]' } }]
  });
  if (existingSample > 0) {
    console.log(`ℹ️ Sample facilities already seeded (${existingSample} found) — skipping.`);
    return;
  }

  const organizers = users.filter(u => u.role === 'organizer' || u.role === 'visitor');
  const basePoints = Object.values(locationCoords);

  const facilities = [];
  for (let i = 0; i < COUNTS.extraFacilities; i++) {
    const base = randomFromArray(basePoints);
    const type = randomFromArray(Facility.TYPES);
    const meta = T.FACILITY_BY_TYPE[type];
    facilities.push({
      name: `Sector ${i + 1} ${meta.label}`,
      type,
      description: meta.description,
      lat: jitterCoord(base[0], 2),
      lng: jitterCoord(base[1], 2),
      contact: type === 'Hospital' || type === 'Police Booth' ? indianLandlineNumber() : '',
      capacity: type === 'Parking' || type === 'Medical Camp' ? faker.number.int({ min: 100, max: 3000 }) : undefined,
      isDemo: true,
      createdBy: randomFromArray(organizers)._id
    });
  }

  await Facility.insertMany(facilities);
  console.log(`✅ Seeded ${facilities.length} sample facilities.`);
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
    const isFound = reportType.startsWith('Found');
    const place = randomFromArray(locations);

    let name;
    let description;
    if (isPerson) {
      name = faker.person.fullName();
      const age = faker.number.int({ min: 6, max: 78 });
      const outfit = `${randomFromArray(T.PERSON_COLORS)} ${randomFromArray(T.PERSON_GARMENTS)}`;
      const note = randomFromArray(isFound ? T.FOUND_PERSON_NOTES : T.LOST_PERSON_NOTES);
      description = `Age about ${age}, wearing a ${outfit}. ${note}`;
    } else {
      const item = randomFromArray(T.LOST_ITEMS);
      name = item.name;
      description = isFound
        ? `${item.description} Found near ${place} and deposited at the Lost & Found centre.`
        : item.description;
    }

    reports.push({
      reportType,
      name,
      description,
      lastSeenLocation: place,
      contactInfo: indianMobileNumber(),
      status: Math.random() > 0.4 ? 'Open' : 'Resolved',
      reportedBy: randomFromArray(users)._id
    });
  }

  await LostFound.insertMany(reports);
  console.log(`✅ Seeded ${reports.length} sample Lost & Found reports.`);
}

async function seedIncidents(users) {
  const existing = await Incident.countDocuments();
  if (existing > 0) {
    console.log(`ℹ️ Incidents collection already has ${existing} entries — skipping.`);
    return;
  }

  const locations = Object.keys(locationCoords);
  const incidents = [];

  for (let i = 0; i < COUNTS.incidents; i++) {
    const category = randomFromArray(Incident.CATEGORIES);
    const entry = randomFromArray(T.INCIDENTS[category]);
    incidents.push({
      title: entry.title,
      description: entry.description,
      category,
      severity: randomFromArray(Incident.SEVERITIES),
      status: randomFromArray(Incident.STATUSES),
      location: `Near ${randomFromArray(locations)}`,
      reportedBy: randomFromArray(users)._id
    });
  }

  await Incident.insertMany(incidents);
  console.log(`✅ Seeded ${incidents.length} sample incidents.`);
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
    const start = new Date(Date.now() + faker.number.int({ min: -10, max: 20 }) * 86400000);
    const end = new Date(start.getTime() + faker.number.int({ min: 1, max: 5 }) * 86400000);
    const route = randomFromArray(T.TRAFFIC_ROUTES);
    const entry = randomFromArray(T.TRAFFIC_ENTRIES);

    diversions.push({
      title: `${entry.title}: ${route}`,
      description: entry.description,
      affectedRoute: route,
      severity: randomFromArray(['Low', 'Medium', 'High']),
      startDate: start,
      endDate: end,
      createdBy: randomFromArray(organizers)._id
    });
  }

  await TrafficDiversion.insertMany(diversions);
  console.log(`✅ Seeded ${diversions.length} sample traffic advisories.`);
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
        note: Math.random() > 0.6 ? randomFromArray(T.CROWD_NOTES) : '',
        reportedBy: randomFromArray(organizers)._id,
        createdAt: faker.date.recent({ days: 5 })
      });
    }
  }

  await CrowdReport.insertMany(reports);
  console.log(`✅ Seeded ${reports.length} sample crowd density reports across ${facilities.length} facilities.`);
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

    console.log('\n✅ Done. This is sample data for development/portfolio purposes.');
    console.log(`   Log in as any demo user with password: ${DEMO_PASSWORD}`);
    console.log('   Helplines and Nearby Places were NOT touched — those stay factual/curated.');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  });
