// Seeds the Faq collection with the curated content provided for MahaPath.
// Priority 1-10 marks the "Top 10" recommended for homepage/main FAQ visibility;
// everything else uses higher priority numbers (100+) and only shows on the full /faq page.
//
// Usage: node scripts/seedFaqs.js

require('dotenv').config();
const mongoose = require('mongoose');
const Faq = require('../models/faq');

const faqs = [
  // ===== About Maha Kumbh =====
  {
    question: 'What is Maha Kumbh?',
    answer: 'Maha Kumbh is one of the world\'s largest religious and spiritual gatherings, held at Prayagraj at the confluence of the Ganga, Yamuna and traditionally revered Saraswati rivers. Millions of pilgrims visit to participate in sacred bathing, spiritual activities, religious ceremonies and cultural events.',
    category: 'About Maha Kumbh',
    priority: 1
  },
  {
    question: 'Why is Prayagraj important during Maha Kumbh?',
    answer: 'Prayagraj is home to the Triveni Sangam, the sacred confluence of the Ganga, Yamuna and Saraswati. The Sangam is the spiritual focal point of the Prayagraj Kumbh and one of the primary destinations for pilgrims.',
    category: 'About Maha Kumbh',
    priority: 110
  },
  {
    question: 'What is an Amrit Snan?',
    answer: 'Amrit Snan refers to the highly auspicious ritual bathing days during Kumbh. These days attract exceptionally large crowds and are associated with important religious observances and processions.',
    category: 'About Maha Kumbh',
    priority: 111
  },
  {
    question: 'What were the major bathing days of Maha Kumbh 2025?',
    answer: '(2025 historical information) The major 2025 bathing dates included Makar Sankranti (14 January), Mauni Amavasya (29 January), Basant Panchami (3 February), Maghi Purnima (12 February) and Maha Shivratri (26 February).',
    category: 'About Maha Kumbh',
    priority: 112
  },

  // ===== Navigation & Getting Around =====
  {
    question: 'How do I find my way around the Maha Kumbh area?',
    answer: 'Use MahaPath\'s interactive map to locate ghats, temples, events, hospitals, toilets, food points, parking areas, transport points and other important facilities.',
    category: 'Navigation & Getting Around',
    priority: 2
  },
  {
    question: 'How can I find the nearest hospital or medical facility?',
    answer: 'Open the MahaPath map and select Medical Help to find nearby hospitals, first-aid points and emergency facilities. You can also use the "Find Nearest Facility" tool for a distance-sorted list.',
    category: 'Navigation & Getting Around',
    priority: 3
  },
  {
    question: 'How can I find toilets and drinking-water facilities?',
    answer: 'Use the Facilities layer on the MahaPath map to locate nearby toilets and water facilities.',
    category: 'Navigation & Getting Around',
    priority: 7
  },
  {
    question: 'How do I find a particular event or attraction?',
    answer: 'Open the Events/Schedule section or search by event name, category, date or location. MahaPath can show the event\'s venue, timings and route on the map.',
    category: 'Navigation & Getting Around',
    priority: 6
  },

  // ===== Transport =====
  {
    question: 'How can I reach Maha Kumbh in Prayagraj?',
    answer: 'You can reach Prayagraj by train, bus, road or air. During Maha Kumbh 2025, additional railway infrastructure, buses and shuttle services were deployed to handle the huge visitor influx.',
    category: 'Transport',
    priority: 5
  },
  {
    question: 'How do I get around once I reach Prayagraj?',
    answer: 'Depending on the day and crowd conditions, visitors can use buses, shuttle services, walking routes and other designated transport options. During major bathing periods, special arrangements may apply.',
    category: 'Transport',
    priority: 120
  },
  {
    question: 'Can I drive my private vehicle directly to the Mela area?',
    answer: 'Access and parking arrangements can change significantly depending on crowd conditions and important bathing days. Visitors should check the latest traffic restrictions and designated parking areas before travelling — see our Traffic Advisories page for current updates.',
    category: 'Transport',
    priority: 121
  },

  // ===== Safety & Emergency =====
  {
    question: 'What should I do if I get separated from my family?',
    answer: 'Go immediately to the nearest Lost & Found centre or ask nearby police or volunteers for assistance. You can also report or search for a separated family member using MahaPath\'s Lost & Found section.',
    category: 'Safety & Emergency',
    priority: 4
  },
  {
    question: 'What should I do in a medical emergency?',
    answer: 'Contact emergency services or the nearest medical facility immediately. Use MahaPath\'s map to locate the closest hospital or first-aid point — but for a genuine emergency, call the numbers on our Helplines page directly rather than waiting on the app.',
    category: 'Safety & Emergency',
    priority: 130
  },
  {
    question: 'What should I do if I lose my phone, wallet or belongings?',
    answer: 'Report the loss at the appropriate Lost & Found or police assistance centre, or file a report through MahaPath\'s Lost & Found section, and keep your identification details and important contact numbers accessible.',
    category: 'Safety & Emergency',
    priority: 131
  },
  {
    question: 'Is Maha Kumbh safe for children and elderly people?',
    answer: 'Large bathing days can involve extremely high crowd density and long walking distances, so families should plan carefully. MahaPath can help you find medical points, less crowded routes (via crowd density), toilets, and emergency contacts in advance.',
    category: 'Safety & Emergency',
    priority: 132
  },

  // ===== Stay & Essentials =====
  {
    question: 'Where can I stay during Maha Kumbh?',
    answer: 'Accommodation can include hotels, guesthouses, camps and tented accommodation, depending on availability and budget. Maha Kumbh 2025 included extensive temporary accommodation infrastructure.',
    category: 'Stay & Essentials',
    priority: 140
  },
  {
    question: 'What should I carry when visiting Maha Kumbh?',
    answer: 'Carry essentials such as government ID, phone and power bank, required medicines, drinking water, comfortable footwear, weather-appropriate clothing and emergency contact information. Avoid carrying unnecessary valuables, especially during very crowded periods.',
    category: 'Stay & Essentials',
    priority: 8
  },
  {
    question: 'What should I do before visiting on a major Snan day?',
    answer: 'Plan your route, transport, meeting point, essential contacts and return journey in advance. On major bathing days, crowd and transport conditions can change substantially, so allow extra travel time and follow official instructions.',
    category: 'Stay & Essentials',
    priority: 141
  },

  // ===== Events & Experiences =====
  {
    question: 'What can I experience besides taking a holy dip?',
    answer: 'Maha Kumbh is not limited to bathing at the Sangam. Visitors can experience religious ceremonies, Akhara processions, cultural performances, spiritual discourses, heritage attractions, exhibitions, ghats, temples and ashrams.',
    category: 'Events & Experiences',
    priority: 150
  },
  {
    question: 'What are Akharas and why are they important?',
    answer: 'Akharas are traditional religious orders or organizations associated with ascetic and monastic traditions. They play a major role in the religious life and public ceremonies of Kumbh, including processions associated with major bathing occasions.',
    category: 'Events & Experiences',
    priority: 151
  },

  // ===== MahaPath-Specific FAQs =====
  {
    question: 'What is MahaPath?',
    answer: 'MahaPath is a digital companion designed to help visitors navigate, explore and experience Maha Kumbh more easily. It brings together information about events, locations, routes, facilities, safety, and important services in one place.',
    category: 'MahaPath-Specific FAQs',
    priority: 160
  },
  {
    question: 'Do I need an account to use MahaPath?',
    answer: 'You can browse general information (events, map, facilities, helplines) without an account. Creating a free account lets you report Lost & Found cases and incidents, and organizers/admins can manage events and facilities.',
    category: 'MahaPath-Specific FAQs',
    priority: 9
  },
  {
    question: 'Can I create my own Maha Kumbh itinerary?',
    answer: 'You can browse the schedule and nearby places to plan your own visit around the events and locations that interest you. A dedicated saved-itinerary feature is on our roadmap.',
    category: 'MahaPath-Specific FAQs',
    priority: 10
  },
  {
    question: 'Can I search for events and places?',
    answer: 'Yes. Use MahaPath\'s search (available from the navbar on every page) to find events, locations, and facilities across the site.',
    category: 'MahaPath-Specific FAQs',
    priority: 161
  },
  {
    question: 'Can MahaPath help me find nearby facilities?',
    answer: 'Yes — if you allow location access, the "Find Nearest Facility" tool can show you the closest medical centres, police booths, parking, and more, sorted by distance.',
    category: 'MahaPath-Specific FAQs',
    priority: 162
  },
  {
    question: 'Is the information on MahaPath live?',
    answer: 'MahaPath displays information from its available data sources. Event schedules, routes, crowd conditions, and facility availability may change, so please verify time-sensitive information through official authorities when it matters. Crowd density specifically is manually reported by organizers, not from live sensors.',
    category: 'MahaPath-Specific FAQs',
    priority: 163
  },
  {
    question: 'What should I do if I find incorrect information on MahaPath?',
    answer: 'Use the chat helper in the corner or contact an admin to let us know. Include the location, event, or information that appears incorrect so it can be reviewed.',
    category: 'MahaPath-Specific FAQs',
    priority: 164
  }
];

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
