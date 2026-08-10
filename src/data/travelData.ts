export interface TravelDestination {
  id: string
  country: string
  location: string
  date: string
  photos: string[]
}

const STORAGE_KEY = 'travel_timeline_data'

const INITIAL_DATA: TravelDestination[] = [
  { id: '1', country: 'United States', location: 'Las Vegas, NV', date: 'September 2021', photos: ['', '', ''] },
  { id: '2', country: 'Canada', location: 'Toronto, ON', date: 'November 2021', photos: ['', '', ''] },
  { id: '3', country: 'United States', location: 'Denver, CO', date: 'February 2023', photos: ['', '', ''] },
  { id: '4', country: 'Canada', location: 'Niagara Falls, ON', date: 'February 2023', photos: ['', '', ''] },
  { id: '5', country: 'Canada', location: 'Ottawa, ON', date: 'May 2023', photos: ['', '', ''] },
  { id: '6', country: 'United States', location: 'Las Vegas, NV', date: 'May – June 2023', photos: ['', '', ''] },
  { id: '7', country: 'Peru', location: 'Cusco', date: 'August 2023', photos: ['', '', ''] },
  { id: '8', country: 'Mexico', location: 'Cancun', date: 'November 2023', photos: ['', '', ''] },
  { id: '9', country: 'United Arab Emirates', location: 'Dubai', date: 'January – February 2024', photos: ['', '', ''] },
  { id: '10', country: 'France', location: 'Paris', date: 'May 2024', photos: ['', '', ''] },
  { id: '11', country: 'Netherlands', location: 'Amsterdam', date: 'June – July 2024', photos: ['', '', ''] },
  { id: '12', country: 'Canada', location: 'Gatineau', date: 'September 2024', photos: ['', '', ''] },
  { id: '13', country: 'Brazil', location: 'Sao Paulo', date: 'October 2024', photos: ['', '', ''] },
  { id: '14', country: 'United States', location: 'New York, NY', date: 'May 2025', photos: ['', '', ''] },
  { id: '15', country: 'Canada', location: 'Darlington', date: 'July 2025', photos: ['', '', ''] },
  { id: '16', country: 'Italy', location: 'Rome', date: 'August 2025', photos: ['', '', ''] },
  { id: '17', country: 'Egypt', location: 'Cairo', date: 'November 2025', photos: ['', '', ''] },
  { id: '18', country: 'Canada', location: 'Elmira, ON', date: 'April 2026', photos: ['', '', ''] },
  { id: '19', country: 'Philippines', location: 'Philippines', date: 'April 2026', photos: ['', '', ''] },
  { id: '20', country: 'Japan', location: 'Tokyo', date: 'May 2026', photos: ['', '', ''] },
  { id: '21', country: 'South Korea', location: 'South Korea', date: 'Spring 2026', photos: ['', '', ''] },
  { id: '22', country: 'United States', location: 'Washington, D.C.', date: 'July – August 2026', photos: ['', '', ''] },
  { id: '23', country: 'Canada', location: 'Yellowknife and Whitehorse', date: 'August 2026', photos: ['', '', ''] },
  { id: '24', country: 'United States', location: 'Florida', date: 'September 2026', photos: ['', '', ''] },
  { id: '25', country: 'Iceland', location: 'Reykjavik, Snaefellsnes & South Coast', date: 'October 2026', photos: ['', '', ''] },
]

export function loadDestinations(): TravelDestination[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as TravelDestination[]
  } catch {
    // ignore parse errors
  }
  return INITIAL_DATA
}

export function saveDestinations(data: TravelDestination[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
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
  const fresh = incoming.filter((d) => !seen.has(key(d)))
  return [...existing, ...fresh]
}
