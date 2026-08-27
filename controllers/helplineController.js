const Helpline = require('../models/helpline');

exports.list = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    const helplines = await Helpline.find(filter).sort({ category: 1, name: 1 });
    res.render('helplines/index', { helplines, categories: Helpline.CATEGORIES, query: req.query });
  } catch (err) {
    console.error('❌ Helpline list error:', err);
    res.status(500).render('error', { message: 'Could not load helplines.' });
  }
};

exports.addForm = (req, res) => {
  res.render('helplines/add', { categories: Helpline.CATEGORIES, error: null, values: {} });
};

exports.add = async (req, res) => {
  try {
    const { name, number, category, description } = req.body;

    if (!name || !number) {
      return res.status(400).render('helplines/add', {
        categories: Helpline.CATEGORIES,
        error: 'Name and number are required.',
        values: req.body
      });
    }

    await Helpline.create({ name, number, category, description });
    res.redirect('/helplines');
  } catch (err) {
    console.error('❌ Helpline add error:', err);
    res.status(500).render('helplines/add', {
      categories: Helpline.CATEGORIES,
      error: 'Could not save that helpline. Please try again.',
      values: req.body
    });
  }
};

exports.remove = async (req, res) => {
  try {
    await Helpline.findByIdAndDelete(req.params.id);
    res.redirect('/helplines');
  } catch (err) {
    console.error('❌ Helpline delete error:', err);
    res.status(500).render('error', { message: 'Could not delete that helpline.' });
  }
};
