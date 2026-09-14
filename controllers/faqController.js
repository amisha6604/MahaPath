// Static, curated FAQ content — intentionally not in the database since this needs
// to stay accurate and reviewed, not randomly generated or crowd-edited.
const FAQS = [
  {
    category: 'General',
    items: [
      { q: 'What is Mahapath?', a: 'Mahapath is a companion site for the Mahakumbh at Prayagraj — helping you find events, facilities (ghats, hospitals, police booths, parking, medical camps), report or search Lost & Found, check emergency helplines, see live traffic advisories, and view crowd density on an interactive map.' },
      { q: 'Is Mahapath an official government website?', a: 'No. Mahapath is an independent project and is not affiliated with any government body. Always cross-check critical information (helpline numbers, official advisories) with official government/administration sources.' },
      { q: 'Do I need an account to use Mahapath?', a: 'No — browsing events, the map, facilities, helplines, and nearby places is open to everyone. You only need an account to report a Lost & Found case or an incident; adding/editing events and facilities requires an organizer or admin account.' }
    ]
  },
  {
    category: 'Safety & Emergencies',
    items: [
      { q: 'I have a genuine emergency right now — what should I do?', a: 'Call the emergency helplines listed on our Helplines page immediately (police: 112, ambulance: 108, fire: 101) — do not wait on a website report for a real emergency. Incident reports on Mahapath are not monitored in real time.' },
      { q: 'How accurate is the crowd density shown on the map?', a: 'Crowd density is manually reported by organizers/admins on the ground, not live sensor data. Treat it as a helpful indicator, not a guarantee of current conditions.' },
      { q: 'How does "Find Nearest Facility" calculate distance?', a: 'It uses straight-line ("as the crow flies") distance, not actual road/walking routes. Use the "Get Directions" link on each result for real turn-by-turn navigation.' }
    ]
  },
  {
    category: 'Using the Site',
    items: [
      { q: 'How do I report a lost person or item?', a: 'Log in (or register — it takes a minute), then go to Resources → Lost & Found → Report Lost/Found. Include a clear description and your contact info.' },
      { q: 'I found my lost item/person — how do I close the report?', a: 'Go to your report on the Lost & Found page and click "Mark Resolved". Only the person who reported it (or an organizer/admin) can do this.' },
      { q: 'How do I add an event to the schedule?', a: 'You need an organizer or admin account. Ask an existing admin to upgrade your account via the Admin Dashboard, then use "+ Add Event" in the navbar.' }
    ]
  }
];

exports.page = (req, res) => {
  res.render('faq/index', { faqs: FAQS });
};

// Exposed so other features (e.g. a future chatbot widget) can reuse the same curated content
exports.getFaqs = () => FAQS;
