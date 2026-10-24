// Curated emergency helplines (single source of truth) — used by scripts/seedResources.js and
// utils/bootstrapContent.js. Keyed by phone number so re-running never creates duplicates.
//
// The 1920 / 1944 / 1945 / 1010 numbers are the Maha Kumbh 2025 helplines published on the
// official Kumbh website (kumbh.gov.in). The remaining entries are national emergency numbers.
// These are safety-critical: never replace them with generated placeholder data.
module.exports = [
  { name: 'Maha Kumbh Helpline', number: '1920', category: 'General Mahakumbh Helpline', description: 'Official Maha Kumbh 2025 helpline for visitor assistance.' },
  { name: 'Mela Police Helpline', number: '1944', category: 'Police', description: 'Police helpline for the Mela area (Maha Kumbh 2025).' },
  { name: 'Mela Fire Services', number: '1945', category: 'Fire', description: 'Fire services helpline for the Mela area (Maha Kumbh 2025).' },
  { name: 'Food and Supplies Helpline', number: '1010', category: 'Food & Supplies', description: 'Complaints and queries about food and supplies (Maha Kumbh 2025).' },
  { name: 'Police Emergency', number: '112', category: 'Police', description: 'National emergency response number.' },
  { name: 'Ambulance / Medical Emergency', number: '108', category: 'Medical', description: 'Emergency ambulance service.' },
  { name: 'Fire Emergency', number: '101', category: 'Fire', description: 'National fire emergency number.' },
  { name: 'Women Helpline', number: '1091', category: 'Women Helpline', description: 'Assistance for women in distress.' },
  { name: 'Tourist Helpline (India)', number: '1363', category: 'Tourist Helpline', description: 'Ministry of Tourism 24x7 multilingual helpline.' },
  { name: 'Disaster Management Helpline', number: '1070', category: 'Disaster Management', description: 'State disaster management control room.' },
  { name: 'Railway Enquiry', number: '139', category: 'Railway Enquiry', description: 'Train enquiry and railway assistance.' }
];
