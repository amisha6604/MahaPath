const Event = require('../models/event');
const Facility = require('../models/facility');
const locationCoords = require('../utils/locationCoords');

// Helper: build a Mongoose filter from query params shared by home/schedule/map
function buildFilter(query) {
  const filter = {};

  if (query.category && query.category !== 'All') {
    filter.category = query.category;
  }
  if (query.location && query.location !== 'All') {
    filter.location = query.location;
  }
  if (query.search) {
    const term = query.search.trim();
    filter.$or = [
      { title: { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } },
      { location: { $regex: term, $options: 'i' } }
    ];
  }
  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = new Date(query.from);
    if (query.to) filter.date.$lte = new Date(query.to);
  }

  return filter;
}

// Homepage: shows upcoming events (today onward), most recent first
exports.home = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await Event.find({ date: { $gte: today } }).sort({ date: 1 }).limit(6);

    res.render('home', { events });
  } catch (err) {
    console.error('❌ Home error:', err);
    res.status(500).render('error', { message: 'Could not load events right now.' });
  }
};

// Map: pulls REAL events from MongoDB and geocodes them via locationCoords.
// Only events whose `location` has a known lat/lng entry can be plotted.
exports.map = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const events = await Event.find(filter).sort({ date: 1 });

    const mappedEvents = events
      .filter(event => locationCoords[event.location])
      .map(event => ({
        title: event.title,
        location: event.location,
        category: event.category,
        latlng: locationCoords[event.location],
        date: event.date ? event.date.toISOString().slice(0, 10) : '',
        time: event.time
      }));

    const skippedCount = events.length - mappedEvents.length;

    const facilities = await Facility.find();
    const mappedFacilities = facilities.map(f => ({
      name: f.name,
      type: f.type,
      description: f.description,
      contact: f.contact,
      latlng: [f.lat, f.lng]
    }));

    res.render('map', {
      mappedEvents,
      mappedFacilities,
      skippedCount,
      categories: Event.CATEGORIES,
      facilityTypes: Facility.TYPES,
      locations: Object.keys(locationCoords),
      query: req.query
    });
  } catch (err) {
    console.error('❌ Map error:', err);
    res.status(500).render('error', { message: 'Could not load the map right now.' });
  }
};

// Schedule: full searchable/filterable list of every event
exports.schedule = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const events = await Event.find(filter).sort({ date: 1 });

    res.render('schedule', {
      events,
      categories: Event.CATEGORIES,
      locations: Object.keys(locationCoords),
      query: req.query
    });
  } catch (err) {
    console.error('❌ Schedule error:', err);
    res.status(500).render('error', { message: 'Could not load the schedule right now.' });
  }
};

// Show the form to add a new event (organizers only)
exports.addForm = (req, res) => {
  res.render('add', {
    categories: Event.CATEGORIES,
    locations: Object.keys(locationCoords),
    error: null,
    values: {}
  });
};

// Handle form submission and add the event to DB
exports.addEvent = async (req, res) => {
  try {
    const { title, location, category, date, time, description } = req.body;

    if (!title || !location || !date || !time) {
      return res.status(400).render('add', {
        categories: Event.CATEGORIES,
        locations: Object.keys(locationCoords),
        error: 'Title, location, date, and time are required.',
        values: req.body
      });
    }

    const newEvent = new Event({
      title,
      location,
      category,
      date,
      time,
      description,
      createdBy: req.session.user.id
    });
    await newEvent.save();
    res.redirect('/schedule');
  } catch (err) {
    console.error('❌ Error saving event:', err);
    res.status(500).render('add', {
      categories: Event.CATEGORIES,
      locations: Object.keys(locationCoords),
      error: 'Could not save the event. Please check your inputs and try again.',
      values: req.body
    });
  }
};

// Delete an event based on its ID (organizers only)
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.redirect('/schedule');
  } catch (err) {
    console.error('❌ Error deleting event:', err);
    res.status(500).render('error', { message: 'Could not delete that event.' });
  }
};

// Show the edit form with pre-filled values (organizers only)
exports.editForm = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).render('error', { message: 'Event not found.' });
    }
    res.render('edit', {
      event,
      categories: Event.CATEGORIES,
      locations: Object.keys(locationCoords),
      error: null
    });
  } catch (err) {
    console.error('❌ Edit Form Error:', err);
    res.status(500).render('error', { message: 'Could not load that event.' });
  }
};

// Handle update submission (organizers only)
exports.updateEvent = async (req, res) => {
  try {
    const { title, location, category, date, time, description } = req.body;

    if (!title || !location || !date || !time) {
      const event = await Event.findById(req.params.id);
      return res.status(400).render('edit', {
        event: { ...event.toObject(), ...req.body, _id: req.params.id },
        categories: Event.CATEGORIES,
        locations: Object.keys(locationCoords),
        error: 'Title, location, date, and time are required.'
      });
    }

    await Event.findByIdAndUpdate(req.params.id, { title, location, category, date, time, description });
    res.redirect('/schedule');
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).render('error', { message: 'Could not update that event.' });
  }
};
