/**
 * Utilitas Perhitungan Jarak Geografis (Haversine Formula) & Geofencing Presensi
 * Menghitung jarak presisi antara koordinat pembuat rapat dan perangkat anggota yang memindai QR.
 */

const EARTH_RADIUS_METERS = 6371000; // Radius rata-rata bumi dalam meter

/**
 * Menghitung jarak dalam satuan meter antara 2 koordinat GPS menggunakan formula Haversine
 * @param {number} lat1 Latitude titik 1 (Pembuat rapat)
 * @param {number} lon1 Longitude titik 1 (Pembuat rapat)
 * @param {number} lat2 Latitude titik 2 (Anggota yang presensi)
 * @param {number} lon2 Longitude titik 2 (Anggota yang presensi)
 * @returns {number} Jarak dalam meter (bulat)
 */
export function calculateDistanceInMeters(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 0;
  }
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(EARTH_RADIUS_METERS * c);
}

/**
 * Format jarak meter agar mudah dibaca manusia (meter atau kilometer)
 * @param {number} meters
 * @returns {string} Contoh: "45 meter" atau "2.4 km"
 */
export function formatDistance(meters) {
  if (meters === null || meters === undefined || isNaN(meters)) return '-';
  if (meters < 1000) {
    return `${meters} meter`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

/**
 * Preset lokasi populer di Kota Palopo & Kampus Politeknik Dewantara
 */
export const PALOPO_LOCATION_PRESETS = [
  {
    id: 'lapangan-pancasila',
    name: 'Lapangan Pancasila Palopo',
    detail: 'Pusat Kota Palopo (Depan Kantor Walikota)',
    lat: -2.9928,
    lng: 120.1983,
    defaultRadius: 100,
  },
  {
    id: 'kampus-dewantara',
    name: 'Kampus Politeknik Dewantara',
    detail: 'Gedung Utama & Lab Multimedia',
    lat: -2.9980,
    lng: 120.2010,
    defaultRadius: 80,
  },
  {
    id: 'sekre-teramedia',
    name: 'Sekretariat UKM Teramedia',
    detail: 'Gedung Organisasi Kemahasiswaan Lt. 2',
    lat: -2.9975,
    lng: 120.2005,
    defaultRadius: 50,
  },
  {
    id: 'online-free',
    name: 'Rapat Daring / Bebas Lokasi',
    detail: 'Tanpa batasan radius geografis (Discord / Meet)',
    lat: 0,
    lng: 0,
    defaultRadius: 0, // 0 = no geofence
  },
];

