const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = EARTH_RADIUS_KM * c;
  return Math.round(distanceKm * 100) / 100;
};

export const sortSchoolsByDistance = <T extends { latitude: number; longitude: number }>(
  schools: T[],
  userLat: number,
  userLon: number
): (T & { distance_km: number })[] => {
  return schools
    .map((school) => ({
      ...school,
      distance_km: calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      ),
    }))
    .sort((a, b) => a.distance_km - b.distance_km);
};
