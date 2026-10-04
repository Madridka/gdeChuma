import reference from "./cityDistances.json";

export const distanceOrigin = reference.origin;
export const cityDistances = reference.cities;

function normalizeCityName(value: string) {
  return value.normalize("NFKC")
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/g, "е")
    .replace(/[-‐‑‒–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^(?:город\s+|г\.\s*|г\s+)/, "");
}

const byName = new Map<string, typeof cityDistances[number]>();
for (const city of cityDistances) {
  for (const name of [city.name, ...city.aliases]) {
    byName.set(normalizeCityName(name), city);
  }
}

export function findCityDistance(value: string) {
  // Match a complete city name, including address segments separated by commas.
  // Partial matches could confuse an unknown place with a different known city.
  const matches = new Set(value.split(",")
    .map((part) => byName.get(normalizeCityName(part)))
    .filter((city) => city !== undefined));
  return matches.size === 1 ? [...matches][0] : undefined;
}
