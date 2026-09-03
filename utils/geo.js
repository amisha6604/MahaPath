// Haversine formula — computes straight-line ("as the crow flies") distance in km
// between two lat/lng points. This is NOT turn-by-turn road routing (that needs a
// paid routing API like Google Directions or Mapbox) — it's an honest approximation
// good enough for "which facility is nearest" recommendations.
function haversineDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = { haversineDistanceKm };
