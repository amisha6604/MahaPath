// Seeds the NearbyPlace collection with popular pilgrimage stops near Prayagraj.
// These are the Varanasi/Ayodhya/Mirzapur locations that were previously (incorrectly)
// mixed into the Mahakumbh event map — they belong here instead, as "worth visiting
// nearby" content, not as if they were part of the Mahakumbh site itself.
//
// Usage: node scripts/seedNearbyPlaces.js

require('dotenv').config();
const mongoose = require('mongoose');
const NearbyPlace = require('../models/nearbyPlace');

const places = [
  {
    name: 'Kashi Vishwanath Temple',
    city: 'Varanasi',
    distanceFromPrayagraj: '~120 km',
    shortDescription: 'One of the twelve Jyotirlingas, among the holiest Shiva temples in India.',
    history: 'The Kashi Vishwanath Temple is one of the most revered Shiva temples in India, considered one of the twelve Jyotirlingas — sacred sites believed to house a direct manifestation of Lord Shiva. The temple has been destroyed and rebuilt multiple times through history, with the current structure dating to the 18th century. Its golden spire is one of the most recognizable sights in Varanasi, and it draws pilgrims year-round, with numbers swelling further around major festivals.',
    imageUrl: '',
    displayOrder: 1
  },
  {
    name: 'Dashashwamedh Ghat',
    city: 'Varanasi',
    distanceFromPrayagraj: '~120 km',
    shortDescription: 'The most famous ghat in Varanasi, known for its nightly Ganga Aarti.',
    history: 'Dashashwamedh Ghat is the main and most spectacular ghat on the Ganges in Varanasi. Its name is linked to a legend that Lord Brahma performed ten (dasha) horse (ashwa) sacrifices (medha) here. Today, it is best known for the nightly Ganga Aarti — a synchronized ritual of fire, chanting, and music performed by priests at dusk, drawing large crowds of devotees and visitors every evening.',
    imageUrl: '',
    displayOrder: 2
  },
  {
    name: 'Assi Ghat',
    city: 'Varanasi',
    distanceFromPrayagraj: '~120 km',
    shortDescription: 'A quieter, spiritually significant ghat at the confluence of the Assi and Ganga rivers.',
    history: 'Assi Ghat sits at the southern end of Varanasi\'s ghats, at the point where the Assi stream meets the Ganga. It holds religious significance in the Puranas and is a popular spot for morning yoga, meditation, and simply watching the sunrise over the river — a calmer alternative to the more crowded ghats further north.',
    imageUrl: '',
    displayOrder: 3
  },
  {
    name: 'Ram Janmabhoomi',
    city: 'Ayodhya',
    distanceFromPrayagraj: '~166 km',
    shortDescription: 'The birthplace of Lord Rama, one of the most significant pilgrimage sites in India.',
    history: 'Ram Janmabhoomi in Ayodhya is revered as the birthplace of Lord Rama, one of the most important deities in Hinduism and the central figure of the epic Ramayana. The site has profound religious and historical significance, and today features a grand temple complex that has become a major pilgrimage destination, drawing devotees from across the country.',
    imageUrl: '',
    displayOrder: 4
  },
  {
    name: 'Vindhyachal Temple',
    city: 'Mirzapur',
    distanceFromPrayagraj: '~90 km',
    shortDescription: 'A revered Shakti Peeth dedicated to Goddess Vindhyavasini.',
    history: 'The Vindhyachal Temple, dedicated to Goddess Vindhyavasini, is considered one of the Shakti Peethas — sites sacred to the goddess Shakti in Hindu tradition. Set along the Ganges near Mirzapur, it is part of a well-known pilgrimage circuit that also includes the nearby Ashtabhuja and Kali Khoh temples, and draws large numbers of devotees, especially during Navratri.',
    imageUrl: '',
    displayOrder: 5
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const existing = await NearbyPlace.countDocuments();
    if (existing > 0) {
      console.log(`ℹ️ NearbyPlace collection already has ${existing} entries — skipped to avoid duplicates.`);
      return process.exit(0);
    }

    await NearbyPlace.insertMany(places);
    console.log(`✅ Seeded ${places.length} nearby places.`);
    console.log('ℹ️  imageUrl fields are empty — cards will show a themed placeholder until you add real image URLs via /nearby/edit/:id (admin only).');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  });
