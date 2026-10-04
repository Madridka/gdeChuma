import { readFile, writeFile } from "node:fs/promises";

const file = new URL("../src/data/cityDistances.json", import.meta.url);
const reference = JSON.parse(await readFile(file, "utf8"));
const radians = (degrees) => degrees * Math.PI / 180;
for (const city of reference.cities) {
  const deltaLatitude = radians(city.latitude - reference.origin.latitude);
  const deltaLongitude = radians(city.longitude - reference.origin.longitude);
  const a = Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(radians(reference.origin.latitude)) * Math.cos(radians(city.latitude)) *
    Math.sin(deltaLongitude / 2) ** 2;
  const distance = 2 * reference.earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  city.distanceKm = Math.round(distance / reference.roundingKm) * reference.roundingKm;
}
await writeFile(file, `${JSON.stringify(reference, null, 2)}\n`);
console.log(`Updated distances for ${reference.cities.length} cities.`);
