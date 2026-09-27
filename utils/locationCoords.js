// Known Mahakumbh / Prayagraj-area locations mapped to [lat, lng].
// IMPORTANT: keys here must exactly match the `location` value stored on an Event
// (see the <select> in views/add.ejs) or that event won't be plottable on the map.
// All entries below are genuinely in/around Prayagraj — Mahakumbh's actual location.
// (Varanasi/Ayodhya/Mirzapur landmarks live in the NearbyPlace collection instead —
// see scripts/seedNearbyPlaces.js — since they're worth visiting nearby, not part of the Mela itself.)
//
// Coordinates are best-effort approximations, not surveyed GPS points — verify against
// official sources before treating this as production-grade precision.
const locationCoordinates = {
  "Sangam": [25.4292, 81.8805],
  "Triveni Ghat, Sangam": [25.4300, 81.8810],
  "Kumbh Mela Ground": [25.4305, 81.8778],
  "Akshayavat, Prayagraj": [25.4272, 81.8256],
  "Saraswati Koop": [25.4270, 81.8258],
  "Anand Bhawan": [25.4448, 81.8478],
  "Allahabad Fort": [25.4262, 81.8433],
  "Khusro Bagh": [25.4419, 81.8459],
  "Bade Hanuman Mandir, Prayagraj": [25.4225, 81.8825],
  "Naini Bridge": [25.4180, 81.8410],
  "All Saints Cathedral, Prayagraj": [25.4530, 81.8447],
  "Alopi Devi Mandir": [25.4392, 81.8567],
  "Mankameshwar Temple, Prayagraj": [25.4398, 81.8398],
  "Maharshi Bharadwaj Ashram": [25.4550, 81.8400],
  "Nagvasuki Temple": [25.4400, 81.8830],
  "Chandrashekhar Azad Park": [25.4480, 81.8500],
  "Prayagraj Junction": [25.4415, 81.8175],
  "Civil Lines, Prayagraj": [25.4520, 81.8380],
  "Jhunsi Sector, Kumbh Mela": [25.4450, 81.9020],
  "Arail Ghat": [25.4100, 81.8600],
  "Parade Ground, Prayagraj": [25.4470, 81.8460],
  "Rasoolabad Ghat": [25.4370, 81.8600],
  "Draupadi Ghat": [25.4340, 81.8700]
};

module.exports = locationCoordinates;
