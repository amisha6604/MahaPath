// Realistic text pools for the sample (demo) data in scripts/seedDemoData.js.
// Faker's lorem generator produces Latin gibberish and its commerce generator produces
// things like "Rustic Cotton Ball", neither of which belongs on a pilgrim-facing site.

// ---- Events ----------------------------------------------------------------------------
// `places` are preferred locations (filtered against utils/locationCoords at seed time).
exports.EVENT_TEMPLATES = [
  { title: 'Morning Ganga Aarti', category: 'Aarti', places: ['Sangam', 'Triveni Ghat, Sangam', 'Rasoolabad Ghat', 'Draupadi Ghat'], times: ['5:30 AM', '6:00 AM'],
    descriptions: ['Traditional morning aarti on the riverbank with Vedic chanting. Devotees are advised to arrive 30 minutes early.', 'Priests perform the morning Ganga Aarti with lamps and hymns. Open to all pilgrims.'] },
  { title: 'Evening Ganga Aarti', category: 'Aarti', places: ['Sangam', 'Triveni Ghat, Sangam', 'Rasoolabad Ghat', 'Draupadi Ghat'], times: ['6:30 PM', '7:00 PM'],
    descriptions: ['The evening aarti is held at dusk with lamps, conch shells and devotional singing. Seating is on a first-come basis.', 'A ceremonial evening aarti on the ghat, followed by the release of floral offerings into the river.'] },
  { title: 'Shahi Snan at the Sangam', category: 'Shahi Snan', places: ['Sangam', 'Triveni Ghat, Sangam'], times: ['4:30 AM', '5:00 AM'],
    descriptions: ['Ceremonial royal bath at the confluence. Entry to the bathing area is regulated; please follow police and volunteer instructions.', 'The most auspicious bathing occasion of the season. Expect heavy crowds and restricted movement near the Sangam.'] },
  { title: 'Akhara Procession to the Sangam', category: 'Procession', places: ['Kumbh Mela Ground', 'Jhunsi Sector, Kumbh Mela'], times: ['6:00 AM', '7:00 AM'],
    descriptions: ['The Akharas proceed in traditional order from the camps towards the Sangam. The route is barricaded and closed to the public during the procession.', 'A ceremonial procession with chariots, banners and music. Viewing areas are marked along the route.'] },
  { title: 'Pushpa Yatra Procession', category: 'Procession', places: ['Parade Ground, Prayagraj', 'Kumbh Mela Ground'], times: ['4:00 PM', '5:00 PM'],
    descriptions: ['A floral procession by local devotional groups. Traffic on the route is regulated for the duration.'] },
  { title: 'Satsang and Spiritual Discourse', category: 'Satsang', places: ['Kumbh Mela Ground', 'Maharshi Bharadwaj Ashram', 'Jhunsi Sector, Kumbh Mela'], times: ['10:00 AM', '4:00 PM'],
    descriptions: ['A discourse by senior saints on the Bhagavad Gita and the path of devotion. Open to all.', 'An open satsang with spiritual teachings, followed by prasad.'] },
  { title: 'Ramkatha Discourse', category: 'Satsang', places: ['Kumbh Mela Ground', 'Arail Ghat'], times: ['3:00 PM', '5:00 PM'],
    descriptions: ['A daily narration of the Ramayana with bhajans. Shaded seating is provided.'] },
  { title: 'Bhajan Sandhya', category: 'Cultural Program', places: ['Kumbh Mela Ground', 'Parade Ground, Prayagraj'], times: ['7:00 PM', '7:30 PM'],
    descriptions: ['An evening of devotional music by regional artists.', 'Bhajans and kirtan by visiting groups, with an open audience area.'] },
  { title: 'Classical Music Evening', category: 'Cultural Program', places: ['Parade Ground, Prayagraj', 'Anand Bhawan', 'Civil Lines, Prayagraj'], times: ['6:30 PM', '7:00 PM'],
    descriptions: ['A recital of Hindustani classical music by invited artists. Entry is free.', 'An evening concert featuring vocal and instrumental performances.'] },
  { title: 'Heritage Walk of Prayagraj', category: 'Cultural Program', places: ['Allahabad Fort', 'Anand Bhawan', 'Khusro Bagh', 'Chandrashekhar Azad Park'], times: ['7:00 AM', '4:30 PM'],
    descriptions: ['A guided walk through the historic sites of the city. Wear comfortable footwear and carry drinking water.'] },
  { title: 'Community Langar Seva', category: 'Other', places: ['Kumbh Mela Ground', 'Jhunsi Sector, Kumbh Mela', 'Arail Ghat'], times: ['12:00 PM', '1:00 PM'],
    descriptions: ['Free community meal served to pilgrims throughout the afternoon. Volunteers are welcome.'] },
  { title: 'Free Medical Check-up Camp', category: 'Other', places: ['Kumbh Mela Ground', 'Parade Ground, Prayagraj', 'Civil Lines, Prayagraj'], times: ['9:00 AM', '10:00 AM'],
    descriptions: ['Free health check-ups and first aid for pilgrims, run by volunteer doctors.'] },
  { title: 'Yoga and Meditation Session', category: 'Other', places: ['Kumbh Mela Ground', 'Maharshi Bharadwaj Ashram', 'Khusro Bagh'], times: ['6:00 AM', '6:30 AM'],
    descriptions: ['A guided morning session of yoga and pranayama for pilgrims of all ages.'] },
  { title: 'Sadhu Sabha', category: 'Other', places: ['Kumbh Mela Ground', 'Jhunsi Sector, Kumbh Mela'], times: ['11:00 AM'],
    descriptions: ['A gathering of sadhus and saints with discourse and blessings.'] }
];

// ---- Lost & Found ----------------------------------------------------------------------
exports.LOST_ITEMS = [
  { name: 'Black laptop bag', description: 'Black laptop bag with a charger and notebook inside. Red tag on the zip.' },
  { name: 'Smartphone in a black case', description: 'Android phone with a cracked screen guard; the lock screen shows a family photo.' },
  { name: 'Brown leather wallet', description: 'Contains ID cards, a few bank cards and some cash.' },
  { name: 'Bunch of house keys', description: 'Four keys on a steel ring with a small brass Om keychain.' },
  { name: 'Prescription spectacles', description: 'Black-framed glasses in a maroon hard case.' },
  { name: 'Blue backpack', description: 'Medium blue backpack with clothes and a water bottle inside.' },
  { name: 'Silver wristwatch', description: 'Analog wristwatch with a brown leather strap.' },
  { name: 'Maroon handbag', description: 'Ladies handbag containing a purse and personal items.' },
  { name: 'Power bank', description: 'White 10,000 mAh power bank with a charging cable attached.' },
  { name: 'Aadhaar and ID card holder', description: 'Transparent card holder with an Aadhaar card and a voter ID.' },
  { name: 'Rudraksha mala', description: 'Prayer beads in a small cloth pouch.' },
  { name: 'Grey travel bag', description: 'Grey duffel bag with a name tag, containing clothes and toiletries.' },
  { name: 'Digital camera', description: 'Compact digital camera in a black pouch.' },
  { name: 'Medicine pouch', description: 'Small pouch with daily medicines and a doctor\'s prescription.' },
  { name: 'Earphones and charger set', description: 'White earphones and a phone charger in a zip pouch.' },
  { name: 'Gold-coloured bangles', description: 'A pair of bangles wrapped in a handkerchief.' }
];

exports.PERSON_GARMENTS = ['kurta', 'saree', 'shawl', 'jacket', 'sweater', 'dhoti'];
exports.PERSON_COLORS = ['white', 'saffron', 'maroon', 'blue', 'green', 'grey', 'yellow', 'brown'];
exports.LOST_PERSON_NOTES = [
  'Separated from relatives in the crowd near the entry gate.',
  'Last seen near the bathing ghat with a family group.',
  'Speaks Hindi and a little English.',
  'Elderly; needs regular medication. Please contact the family if found.',
  'Was travelling with a group from out of town.'
];
exports.FOUND_PERSON_NOTES = [
  'Currently safe with volunteers at the nearest help desk.',
  'Waiting at the Lost & Found centre. Please bring an ID to claim.',
  'Found alone near the ghat and is being looked after by volunteers.'
];

// ---- Incidents -------------------------------------------------------------------------
exports.INCIDENTS = {
  'Medical': [
    { title: 'Pilgrim fainted near the ghat steps', description: 'An elderly pilgrim collapsed due to exhaustion. First-aid volunteers attended and an ambulance has been requested.' },
    { title: 'Heat exhaustion cases reported', description: 'Several pilgrims reported dizziness after waiting in long queues. Drinking water and shade have been arranged.' },
    { title: 'Slip injury at the bathing ghat', description: 'A pilgrim slipped on wet steps and needs first aid.' }
  ],
  'Security': [
    { title: 'Unattended bag reported', description: 'An unattended bag was reported near the entry barricade. The area has been cordoned off pending inspection.' },
    { title: 'Overcrowding at an entry gate', description: 'The crowd is building up at the gate; additional personnel have been requested to regulate the queue.' },
    { title: 'Dispute between two groups', description: 'A minor altercation was reported between two groups of visitors; police personnel are nearby.' }
  ],
  'Fire': [
    { title: 'Small fire near a food stall', description: 'A cooking-gas flare-up at a temporary stall was put out with the help of nearby staff. The area remains under watch.' },
    { title: 'Electrical sparking at a camp', description: 'Sparking was reported from a temporary wiring junction; power has been isolated for inspection.' }
  ],
  'Crowd Crush': [
    { title: 'Dangerous crowd density at the bridge approach', description: 'Density is rising on the approach and movement has slowed. Incoming groups should be diverted.' },
    { title: 'Bottleneck at a gate', description: 'Two streams of pilgrims are merging at the gate, causing a bottleneck.' }
  ],
  'Infrastructure': [
    { title: 'Barricade displaced', description: 'A section of barricade has shifted and needs to be secured.' },
    { title: 'Loose plank on the pontoon bridge', description: 'A loose plank was reported on the pontoon bridge; crossing is slowed until it is repaired.' },
    { title: 'Street lights not working', description: 'Lights are out along a stretch of the approach road, reducing visibility at night.' }
  ],
  'Other': [
    { title: 'Child waiting at the help desk', description: 'A child separated from family is waiting at the help desk; an announcement has been requested.' },
    { title: 'Public address system fault', description: 'The loudspeaker in the sector is not working, so announcements are not audible.' }
  ]
};

// ---- Traffic advisories ----------------------------------------------------------------
exports.TRAFFIC_ENTRIES = [
  { title: 'One-way traffic', description: 'Traffic is one-way during the advisory window. Please follow police instructions and signage.' },
  { title: 'Vehicle restriction', description: 'Parking and stopping are restricted along this stretch. Use the designated parking areas and shuttle service.' },
  { title: 'Route diversion', description: 'Traffic is diverted to the alternate route. Allow extra travel time and follow the marked diversion.' },
  { title: 'No entry for heavy vehicles', description: 'Heavy vehicles are barred during the advisory window. Light vehicles may continue as normal.' },
  { title: 'Pedestrian-only movement', description: 'The road is open to pedestrians only. Only authorised and emergency vehicles are permitted.' }
];
exports.TRAFFIC_ROUTES = [
  'MG Marg, Civil Lines', 'Sardar Patel Marg', 'Strachey Road', 'Naini Bridge approach',
  'GT Road (NH-19) near Prayagraj Junction', 'Jhunsi approach road', 'Parade Ground road', 'Old Yamuna Bridge approach'
];

// ---- Crowd density notes ---------------------------------------------------------------
exports.CROWD_NOTES = [
  'Queue moving steadily; volunteers are managing the flow.',
  'Entry paused briefly to ease pressure at the ghat.',
  'Barricading is in place and movement is orderly.',
  'Crowd building up after the morning aarti.',
  'Additional police personnel deployed at the approach.',
  'Water points and medical help are available nearby.'
];

// ---- Sample facilities -----------------------------------------------------------------
exports.FACILITY_BY_TYPE = {
  'Ghat': { label: 'Bathing Ghat', description: 'Designated bathing area with barricading and lifeguard cover.' },
  'Hospital': { label: 'Field Hospital', description: 'Field hospital with emergency care and ambulance access.' },
  'Police Booth': { label: 'Police Post', description: 'Police post for visitor assistance and crowd management.' },
  'Parking': { label: 'Parking Area', description: 'Designated parking area with a shuttle connection to the Mela grounds.' },
  'Medical Camp': { label: 'Medical Camp', description: 'First-aid and basic treatment for pilgrims.' }
};
