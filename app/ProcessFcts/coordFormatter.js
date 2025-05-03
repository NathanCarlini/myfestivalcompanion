import proj4 from 'proj4';

// Définir les projections (par exemple, WGS84 et Web Mercator)
const wgs84 = '+proj=latlong +datum=WGS84 +no_defs'; // Latitude/Longitude (WGS84)
const webMercator = '+proj=merc +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'; // Web Mercator

// Fonction pour convertir les coordonnées XY (Web Mercator) en latitude/longitude (WGS84)
export default function convertXYToLatLon(x: number, y: number): { latitude: number, longitude: number } {
  const [longitude, latitude] = proj4(webMercator, wgs84, [x, y]); // Conversion
  return { latitude, longitude };
}



// Exemple de coordonnées XY (Web Mercator) pour Mayotte
const x = 45.0736802335;  // Longitude en Web Mercator
const y = -12.6875073612; // Latitude en Web Mercator

// Conversion
// const result = convertXYToLatLon(x, y);

// Affichage des résultats
// console.log(`Latitude: ${result.latitude}, Longitude: ${result.longitude}`);
