const Facility = require('../models/facility');

exports.list = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type && req.query.type !== 'All') {
      filter.type = req.query.type;
    }
    const facilities = await Facility.find(filter).sort({ type: 1, name: 1 });
    res.render('facilities/index', {
      facilities,
      types: Facility.TYPES,
      query: req.query
    });
  } catch (err) {
    console.error('❌ Facility list error:', err);
    res.status(500).render('error', { message: 'Could not load facilities.' });
  }
};

exports.addForm = (req, res) => {
  res.render('facilities/add', { types: Facility.TYPES, error: null, values: {} });
};

exports.add = async (req, res) => {
  try {
    const { name, type, description, lat, lng, contact, capacity } = req.body;

    if (!name || !type || !lat || !lng) {
      return res.status(400).render('facilities/add', {
        types: Facility.TYPES,
        error: 'Name, type, latitude, and longitude are required.',
        values: req.body
      });
    }

    await Facility.create({
      name,
      type,
      description,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      contact,
      capacity: capacity ? parseInt(capacity, 10) : undefined,
      createdBy: req.session.user.id
    });

    res.redirect('/facilities');
  } catch (err) {
    console.error('❌ Facility add error:', err);
    res.status(500).render('facilities/add', {
      types: Facility.TYPES,
      error: 'Could not save that facility. Check your inputs and try again.',
      values: req.body
    });
  }
};

exports.editForm = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).render('error', { message: 'Facility not found.' });
    res.render('facilities/edit', { facility, types: Facility.TYPES, error: null });
  } catch (err) {
    console.error('❌ Facility edit form error:', err);
    res.status(500).render('error', { message: 'Could not load that facility.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, type, description, lat, lng, contact, capacity } = req.body;

    if (!name || !type || !lat || !lng) {
      const facility = await Facility.findById(req.params.id);
      return res.status(400).render('facilities/edit', {
        facility: { ...facility.toObject(), ...req.body, _id: req.params.id },
        types: Facility.TYPES,
        error: 'Name, type, latitude, and longitude are required.'
      });
    }

    await Facility.findByIdAndUpdate(req.params.id, {
      name,
      type,
      description,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      contact,
      capacity: capacity ? parseInt(capacity, 10) : undefined
    });

    res.redirect('/facilities');
  } catch (err) {
    console.error('❌ Facility update error:', err);
    res.status(500).render('error', { message: 'Could not update that facility.' });
  }
};

exports.remove = async (req, res) => {
  try {
    await Facility.findByIdAndDelete(req.params.id);
    res.redirect('/facilities');
  } catch (err) {
    console.error('❌ Facility delete error:', err);
    res.status(500).render('error', { message: 'Could not delete that facility.' });
  }
};

// Used by the map page to plot all facilities as JSON
exports.allAsJson = async () => {
  const facilities = await Facility.find();
  return facilities.map(f => ({
    name: f.name,
    type: f.type,
    description: f.description,
    contact: f.contact,
    lat: f.lat,
    lng: f.lng
  }));
};
