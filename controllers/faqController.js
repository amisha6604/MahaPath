const Faq = require('../models/faq');

// Groups a flat list of FAQs into { category: [items] }, preserving the order
// categories first appear in (which itself follows the priority sort).
function groupByCategory(faqs) {
  const groups = [];
  const index = {};

  faqs.forEach(faq => {
    if (!(faq.category in index)) {
      index[faq.category] = groups.length;
      groups.push({ category: faq.category, items: [] });
    }
    groups[index[faq.category]].items.push(faq);
  });

  return groups;
}

// Public FAQ page — published only, grouped by category
exports.page = async (req, res) => {
  try {
    const faqs = await Faq.find({ isPublished: true }).sort({ priority: 1, category: 1 });
    res.render('faq/index', { faqGroups: groupByCategory(faqs) });
  } catch (err) {
    console.error('❌ FAQ page error:', err);
    res.status(500).render('error', { message: 'Could not load FAQs.' });
  }
};

// Used by the homepage for a "Top 10" preview — lowest priority number = most important
exports.getForHomepage = async (limit = 10) => {
  return Faq.find({ isPublished: true }).sort({ priority: 1 }).limit(limit);
};

// Used by the chatbot for keyword matching against published FAQ content
exports.getFaqsFlat = async () => {
  return Faq.find({ isPublished: true });
};

// ---------- Admin management ----------

exports.adminList = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ category: 1, priority: 1 });
    res.render('admin/faqs', { faqs, error: null, success: null });
  } catch (err) {
    console.error('❌ Admin FAQ list error:', err);
    res.status(500).render('error', { message: 'Could not load FAQs.' });
  }
};

exports.addForm = (req, res) => {
  res.render('admin/faq-form', { faq: null, error: null, values: {} });
};

exports.add = async (req, res) => {
  try {
    const { question, answer, category, priority, isPublished } = req.body;

    if (!question || !answer || !category) {
      return res.status(400).render('admin/faq-form', {
        faq: null,
        error: 'Question, answer, and category are required.',
        values: req.body
      });
    }

    await Faq.create({
      question,
      answer,
      category,
      priority: priority ? parseInt(priority, 10) : 100,
      isPublished: isPublished === 'on',
      lastUpdated: new Date()
    });

    res.redirect('/admin/faqs');
  } catch (err) {
    console.error('❌ FAQ add error:', err);
    res.status(500).render('admin/faq-form', {
      faq: null,
      error: 'Could not save that FAQ. Please try again.',
      values: req.body
    });
  }
};

exports.editForm = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).render('error', { message: 'FAQ not found.' });
    res.render('admin/faq-form', { faq, error: null, values: {} });
  } catch (err) {
    console.error('❌ FAQ edit form error:', err);
    res.status(500).render('error', { message: 'Could not load that FAQ.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { question, answer, category, priority, isPublished } = req.body;

    if (!question || !answer || !category) {
      const faq = await Faq.findById(req.params.id);
      return res.status(400).render('admin/faq-form', {
        faq,
        error: 'Question, answer, and category are required.',
        values: {}
      });
    }

    await Faq.findByIdAndUpdate(req.params.id, {
      question,
      answer,
      category,
      priority: priority ? parseInt(priority, 10) : 100,
      isPublished: isPublished === 'on',
      lastUpdated: new Date()
    });

    res.redirect('/admin/faqs');
  } catch (err) {
    console.error('❌ FAQ update error:', err);
    res.status(500).render('error', { message: 'Could not update that FAQ.' });
  }
};

exports.remove = async (req, res) => {
  try {
    await Faq.findByIdAndDelete(req.params.id);
    res.redirect('/admin/faqs');
  } catch (err) {
    console.error('❌ FAQ delete error:', err);
    res.status(500).render('error', { message: 'Could not delete that FAQ.' });
  }
};
