// Known Mahakumbh / Prayagraj-area locations mapped to [lat, lng].
// IMPORTANT: keys here must exactly match the `location` value stored on an Event
// (see the <select> in views/add.ejs) or that event won't be plottable on the map.
const locationCoordinates = {
  "Sangam": [25.4292, 81.8805],
  "Kumbh Mela Ground": [25.4305, 81.8778],
  "Triveni Ghat": [25.4467, 81.8406],
  "Dashashwamedh Ghat": [25.3062, 83.0066],
  "Assi Ghat": [25.2802, 83.0048],
  "Kashi Vishwanath Temple": [25.3109, 83.0104],
  "Hanuman Mandir, Prayagraj": [25.4461, 81.8394],
  "Ram Janmabhoomi, Ayodhya": [26.7956, 82.1991],
  "Vindhyachal Temple": [25.1424, 82.5817],
  "Akshayavat, Prayagraj": [25.4272, 81.8256],
  "Anand Bhawan": [25.4448, 81.8478]
};

module.exports = locationCoordinates;
