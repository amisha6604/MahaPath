const NearbyPlace = require('../models/nearbyPlace');

exports.list = async (req, res) => {
  try {
    const places = await NearbyPlace.find().sort({ displayOrder: 1, name: 1 });
    res.render('nearby/index', { places });
  } catch (err) {
    console.error('❌ Nearby places list error:', err);
    res.status(500).render('error', { message: 'Could not load nearby places.' });
  }
};

exports.detail = async (req, res) => {
  try {
    const place = await NearbyPlace.findById(req.params.id);
    if (!place) return res.status(404).render('error', { message: 'Place not found.' });
    res.render('nearby/detail', { place });
  } catch (err) {
    console.error('❌ Nearby place detail error:', err);
    res.status(500).render('error', { message: 'Could not load that place.' });
  }
};

exports.addForm = (req, res) => {
  res.render('nearby/add', { error: null, values: {} });
};

exports.add = async (req, res) => {
  try {
    const { name, city, distanceFromPrayagraj, shortDescription, history, imageUrl, mapsUrl, displayOrder } = req.body;

    if (!name || !city || !shortDescription || !history) {
      return res.status(400).render('nearby/add', {
        error: 'Name, city, short description, and history are required.',
        values: req.body
      });
    }

    await NearbyPlace.create({
      name, city, distanceFromPrayagraj, shortDescription, history, imageUrl, mapsUrl,
      displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
      createdBy: req.session.user.id
    });

    res.redirect('/nearby');
  } catch (err) {
    console.error('❌ Nearby place add error:', err);
    res.status(500).render('nearby/add', {
      error: 'Could not save that place. Please try again.',
      values: req.body
    });
  }
};

exports.editForm = async (req, res) => {
  try {
    const place = await NearbyPlace.findById(req.params.id);
    if (!place) return res.status(404).render('error', { message: 'Place not found.' });
    res.render('nearby/edit', { place, error: null });
  } catch (err) {
    console.error('❌ Nearby place edit form error:', err);
    res.status(500).render('error', { message: 'Could not load that place.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, city, distanceFromPrayagraj, shortDescription, history, imageUrl, mapsUrl, displayOrder } = req.body;

    if (!name || !city || !shortDescription || !history) {
      const place = await NearbyPlace.findById(req.params.id);
      return res.status(400).render('nearby/edit', {
        place: { ...place.toObject(), ...req.body, _id: req.params.id },
        error: 'Name, city, short description, and history are required.'
      });
    }

    await NearbyPlace.findByIdAndUpdate(req.params.id, {
      name, city, distanceFromPrayagraj, shortDescription, history, imageUrl, mapsUrl,
      displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0
    });

    res.redirect('/nearby');
  } catch (err) {
    console.error('❌ Nearby place update error:', err);
    res.status(500).render('error', { message: 'Could not update that place.' });
  }
};

exports.remove = async (req, res) => {
  try {
    await NearbyPlace.findByIdAndDelete(req.params.id);
    res.redirect('/nearby');
  } catch (err) {
    console.error('❌ Nearby place delete error:', err);
    res.status(500).render('error', { message: 'Could not delete that place.' });
  }
};

// Used by the homepage to show a limited scroller
exports.getForHomepage = async () => {
  return NearbyPlace.find().sort({ displayOrder: 1, name: 1 }).limit(8);
};
