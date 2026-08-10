export interface TravelDestination {
  id: string
  country: string
  location: string
  date: string
  photos: string[]
}

const STORAGE_KEY = 'travel_timeline_data'

/**
 * Locally hosted landmark shots (Wikimedia Commons, downscaled to WebP) used
 * when a destination has no personal photos yet. Keys match `location` exactly;
 * `countryFallback` covers anything unmapped.
 */
const LANDMARKS: Record<string, string> = {
  'Las Vegas, NV': 'las-vegas',
  'Toronto, ON': 'toronto',
  'Denver, CO': 'denver',
  'Niagara Falls, ON': 'niagara-falls',
  'Ottawa, ON': 'ottawa',
  Cusco: 'cusco',
  Cancun: 'cancun',
  Dubai: 'dubai',
  Paris: 'paris',
  Amsterdam: 'amsterdam',
  Gatineau: 'gatineau',
  'Sao Paulo': 'sao-paulo',
  'New York, NY': 'new-york',
  Darlington: 'darlington',
  Rome: 'rome',
  Cairo: 'cairo',
  'Elmira, ON': 'elmira',
  Philippines: 'philippines',
  Tokyo: 'tokyo',
  'South Korea': 'south-korea',
  'Washington, D.C.': 'washington-dc',
  'Yellowknife and Whitehorse': 'yellowknife',
  Florida: 'florida',
  'Reykjavik, Snaefellsnes & South Coast': 'iceland',
}

const COUNTRY_FALLBACK: Record<string, string> = {
  'United States': 'new-york',
  Canada: 'toronto',
  France: 'paris',
  Italy: 'rome',
  Japan: 'tokyo',
  Egypt: 'cairo',
  Peru: 'cusco',
  Mexico: 'cancun',
  Brazil: 'sao-paulo',
  Netherlands: 'amsterdam',
  Iceland: 'iceland',
  'United Arab Emirates': 'dubai',
  Philippines: 'philippines',
  'South Korea': 'south-korea',
}

/** Landmark image for a destination, or null when nothing sensible maps. */
export function landmarkFor(dest: Pick<TravelDestination, 'location' | 'country'>): string | null {
  const slug = LANDMARKS[dest.location] ?? COUNTRY_FALLBACK[dest.country]
  return slug ? `/travel/${slug}.webp` : null
}

/** Photos the user actually supplied — placeholders from the old seed are dropped. */
export function realPhotos(dest: TravelDestination): string[] {
  return (dest.photos ?? []).filter(
    (p) => p && p.trim() && !/^photo\d_url$/.test(p.trim()),
  )
}

const INITIAL_DATA: TravelDestination[] = [
  { id: '1', country: 'United States', location: 'Las Vegas, NV', date: 'September 2021', photos: [] },
  { id: '2', country: 'Canada', location: 'Toronto, ON', date: 'November 2021', photos: [] },
  { id: '3', country: 'United States', location: 'Denver, CO', date: 'February 2023', photos: [] },
  { id: '4', country: 'Canada', location: 'Niagara Falls, ON', date: 'February 2023', photos: [] },
  { id: '5', country: 'Canada', location: 'Ottawa, ON', date: 'May 2023', photos: [] },
  { id: '6', country: 'United States', location: 'Las Vegas, NV', date: 'May – June 2023', photos: [] },
  { id: '7', country: 'Peru', location: 'Cusco', date: 'August 2023', photos: [] },
  { id: '8', country: 'Mexico', location: 'Cancun', date: 'November 2023', photos: [] },
  { id: '9', country: 'United Arab Emirates', location: 'Dubai', date: 'January – February 2024', photos: [] },
  { id: '10', country: 'France', location: 'Paris', date: 'May 2024', photos: [] },
  { id: '11', country: 'Netherlands', location: 'Amsterdam', date: 'June – July 2024', photos: [] },
  { id: '12', country: 'Canada', location: 'Gatineau', date: 'September 2024', photos: [] },
  { id: '13', country: 'Brazil', location: 'Sao Paulo', date: 'October 2024', photos: [] },
  { id: '14', country: 'United States', location: 'New York, NY', date: 'May 2025', photos: [] },
  { id: '15', country: 'Canada', location: 'Darlington', date: 'July 2025', photos: [] },
  { id: '16', country: 'Italy', location: 'Rome', date: 'August 2025', photos: [] },
  { id: '17', country: 'Egypt', location: 'Cairo', date: 'November 2025', photos: [] },
  { id: '18', country: 'Canada', location: 'Elmira, ON', date: 'April 2026', photos: [] },
  { id: '19', country: 'Philippines', location: 'Philippines', date: 'April 2026', photos: [] },
  { id: '20', country: 'Japan', location: 'Tokyo', date: 'May 2026', photos: [] },
  { id: '21', country: 'South Korea', location: 'South Korea', date: 'Spring 2026', photos: [] },
  { id: '22', country: 'United States', location: 'Washington, D.C.', date: 'July – August 2026', photos: [] },
  { id: '23', country: 'Canada', location: 'Yellowknife and Whitehorse', date: 'August 2026', photos: [] },
  { id: '24', country: 'United States', location: 'Florida', date: 'September 2026', photos: [] },
  { id: '25', country: 'Iceland', location: 'Reykjavik, Snaefellsnes & South Coast', date: 'October 2026', photos: [] },
]

export function loadDestinations(): TravelDestination[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as TravelDestination[]
      // Older saves seeded literal "photo1_url" strings; strip them on read so
      // those entries fall back to the landmark image instead of a broken img.
      return parsed.map((d) => ({ ...d, photos: realPhotos(d) }))
    }
  } catch {
    // ignore parse errors
  }
  return INITIAL_DATA
}

export function saveDestinations(data: TravelDestination[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // quota exceeded (large data-URL uploads) — keep the in-memory state usable
  }
}

const MONTH_INDEX: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
}

/**
 * Sort key from a free-text date. Handles "May 2024", ranges like
 * "May – June 2023" (sorts by the first month), and vaguer forms like
 * "Spring 2026" that carry only a year.
 */
export function dateSortKey(date: string): number {
  const year = Number(date.match(/(\d{4})/)?.[1] ?? 0)
  const month = date.toLowerCase().match(/[a-z]+/)?.[0]
  return year * 12 + (month && month in MONTH_INDEX ? MONTH_INDEX[month] : 0)
}

/** Chronological order — the spine has to read top-to-bottom by time. */
export function sortByDate(data: TravelDestination[]): TravelDestination[] {
  return [...data].sort((a, b) => dateSortKey(a.date) - dateSortKey(b.date))
}

export function exportJSON(data: TravelDestination[]): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'travel_history.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function mergeImport(
  existing: TravelDestination[],
  incoming: TravelDestination[],
): TravelDestination[] {
  const key = (d: TravelDestination) => `${d.location.toLowerCase()}|${d.date.toLowerCase()}`
  const seen = new Set(existing.map(key))
  const fresh = incoming
    .filter((d) => d && d.location && !seen.has(key(d)))
    .map((d) => ({ ...d, id: d.id || String(Date.now() + Math.random()), photos: realPhotos(d) }))
  return [...existing, ...fresh]
}
