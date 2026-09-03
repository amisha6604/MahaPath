// Known Mahakumbh / Prayagraj-area locations mapped to [lat, lng].
// IMPORTANT: keys here must exactly match the `location` value stored on an Event
// (see the <select> in views/add.ejs) or that event won't be plottable on the map.
// All entries below are genuinely in/around Prayagraj — Mahakumbh's actual location.
// (Varanasi/Ayodhya/Mirzapur landmarks now live in the NearbyPlace collection instead —
// see scripts/seedNearbyPlaces.js — since they're worth visiting nearby, not part of the Mela itself.)
const locationCoordinates = {
  "Sangam": [25.4292, 81.8805],
  "Kumbh Mela Ground": [25.4305, 81.8778],
  "Akshayavat, Prayagraj": [25.4272, 81.8256],
  "Anand Bhawan": [25.4448, 81.8478],
  "Allahabad Fort": [25.4262, 81.8433],
  "Khusro Bagh": [25.4419, 81.8459],
  "Bade Hanuman Mandir, Prayagraj": [25.4225, 81.8825],
  "Naini Bridge": [25.4180, 81.8410],
  "All Saints Cathedral, Prayagraj": [25.4530, 81.8447]
};

module.exports = locationCoordinates;
