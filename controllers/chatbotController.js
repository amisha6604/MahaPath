const { getFaqsFlat } = require('./faqController');

// Quick intents checked before falling back to FAQ keyword matching —
// these catch common short queries that wouldn't score well against FAQ text.
const QUICK_INTENTS = [
  { keywords: ['emergency', 'help', 'call', 'helpline', 'ambulance', 'police number'], reply: 'For real emergencies, call the numbers on our Helplines page immediately — don\'t wait on this chat.', link: '/helplines', linkText: 'Open Helplines' },
  { keywords: ['lost', 'found', 'missing'], reply: 'You can report or search Lost & Found reports here:', link: '/lost-found', linkText: 'Open Lost & Found' },
  { keywords: ['nearest', 'closest', 'near me', 'distance'], reply: 'Use the nearest-facility finder to find the closest hospital, police booth, parking, or medical camp:', link: '/nearest', linkText: 'Find Nearest Facility' },
  { keywords: ['traffic', 'route', 'road', 'diversion'], reply: 'Check current traffic advisories here:', link: '/traffic', linkText: 'Open Traffic Advisories' },
  { keywords: ['crowd', 'density', 'busy', 'crowded'], reply: 'You can check reported crowd density levels here:', link: '/crowd', linkText: 'Open Crowd Density' },
  { keywords: ['event', 'schedule', 'aarti', 'snan', 'program'], reply: 'Check the full event schedule here:', link: '/schedule', linkText: 'Open Schedule' },
  { keywords: ['map', 'location', 'where'], reply: 'You can see everything plotted on the interactive map:', link: '/map', linkText: 'Open Map' }
];

function scoreMatch(userWords, text) {
  const textWords = text.toLowerCase().split(/\W+/);
  let score = 0;
  userWords.forEach(w => {
    if (w.length > 2 && textWords.includes(w)) score++;
  });
  return score;
}

exports.reply = async (req, res) => {
  try {
    const message = (req.body.message || '').trim();
    if (!message) {
      return res.json({ reply: 'Ask me something about events, facilities, Lost & Found, traffic, or crowd density!' });
    }

    const lower = message.toLowerCase();
    const userWords = lower.split(/\W+/);

    // 1. Check quick intents first
    for (const intent of QUICK_INTENTS) {
      if (intent.keywords.some(k => lower.includes(k))) {
        return res.json({ reply: intent.reply, link: intent.link, linkText: intent.linkText });
      }
    }

    // 2. Fall back to FAQ keyword matching (now backed by the real Faq collection)
    const faqs = await getFaqsFlat();
    let best = null;
    let bestScore = 0;

    faqs.forEach(faq => {
      const score = scoreMatch(userWords, faq.question + ' ' + faq.answer);
      if (score > bestScore) {
        bestScore = score;
        best = faq;
      }
    });

    if (best && bestScore >= 2) {
      return res.json({ reply: best.answer });
    }

    return res.json({
      reply: "I'm not sure about that one — try browsing our FAQs, or check Helplines if this is urgent.",
      link: '/faq',
      linkText: 'View FAQs'
    });
  } catch (err) {
    console.error('❌ Chatbot reply error:', err);
    res.json({ reply: 'Something went wrong on my end — try browsing the FAQ page instead.', link: '/faq', linkText: 'View FAQs' });
  }
};
