/**
 * The travel record, transcribed from docs/travel_timeline/TravelHistory.
 *
 * Static on purpose: this is a published record, not a document being edited in
 * the browser, so it lives in the repo and ships with the bundle. Entries are
 * stored newest-first — the page reads backwards, the way the design does — and
 * `no` counts up from the oldest entry so the numbering never shifts when a new
 * trip is added at the top.
 *
 * Notes are factual descriptions of the places, not diary copy. Images are
 * locally hosted landmark photographs (Wikimedia Commons, downscaled to WebP in
 * public/travel) — one per entry, credited in the page footer.
 */

export interface Fact {
  label: string
  value: string
  /** Prints in the second spot colour — one per entry at most. */
  accent?: boolean
}

export interface Journey {
  /** Anchor id, also the image slug where they coincide. */
  id: string
  /** Entry number, counting up from the oldest. */
  no: number
  /** Rail/section grouping. Undated childhood entries group under 'Before'. */
  year: string
  /** Dateline above the headline, e.g. "July 2026". */
  period: string
  /** The city that carries the entry. */
  headline: string
  /** Country line under the headline — two countries are joined with an ampersand. */
  country: string
  cities: string[]
  /** Exact span as recorded, e.g. "Jul 31 – Aug 4, 2026". */
  dates: string
  note: string
  facts: Fact[]
  image: string
  /** Print aspect ratio; varied deliberately so the column never marches. */
  ratio: string
}

export const JOURNEYS: Journey[] = [
  {
    id: 'washington',
    no: 30,
    year: '2026',
    period: 'July 2026',
    headline: 'Washington',
    country: 'United States',
    cities: ['Washington, DC'],
    dates: 'Jul 31 – Aug 4, 2026',
    note: "Five days on the National Mall in high summer — the Smithsonian museums along the greensward, the Lincoln and Jefferson memorials at either end of the water, and the Capitol closing the axis. The city runs on L'Enfant's 1791 plan, which is why the monuments line up on sightlines you can walk in an afternoon.",
    facts: [
      { label: 'Days', value: '5' },
      { label: 'Cities', value: '1' },
      { label: 'Along', value: 'The National Mall', accent: true },
    ],
    image: '/travel/washington-dc.webp',
    ratio: '4 / 3',
  },
  {
    id: 'seoul',
    no: 29,
    year: '2026',
    period: 'May 2026',
    headline: 'Seoul',
    country: 'South Korea',
    cities: ['Seoul'],
    dates: 'May 20 – 24, 2026',
    note: 'Four days in Seoul on the back half of the same May itinerary — Gyeongbokgung and the tiled lanes of Bukchon north of the Han, Myeongdong and Hongdae after dark. The changing of the guard runs on the hour at Gwanghwamun, the palace’s front gate.',
    facts: [
      { label: 'Days', value: '4' },
      { label: 'Cities', value: '1' },
      { label: 'Palace', value: 'Gyeongbokgung' },
    ],
    image: '/travel/south-korea.webp',
    ratio: '3 / 2',
  },
  {
    id: 'japan-korea',
    no: 28,
    year: '2026',
    period: 'May 2026',
    headline: 'Tokyo',
    country: 'Japan & South Korea',
    cities: ['Tokyo', 'Osaka', 'Kyoto', 'Nara', 'Seoul'],
    dates: 'May 10 – 20, 2026',
    note: "Eleven days across Kantō and Kansai and then over to Korea — Shibuya and Asakusa in Tokyo, Dōtonbori in Osaka, the temple circuits of Kyoto, the deer park at Nara, all of it strung together on the Tōkaidō and Sanyō Shinkansen. Nara's Tōdai-ji still holds the Great Buddha cast there in the 8th century.",
    facts: [
      { label: 'Days', value: '11' },
      { label: 'Cities', value: '5' },
      { label: 'Countries', value: '2', accent: true },
    ],
    image: '/travel/tokyo.webp',
    ratio: '16 / 10',
  },
  {
    id: 'elmira',
    no: 27,
    year: '2026',
    period: 'April 2026',
    headline: 'Elmira',
    country: 'Canada',
    cities: ['Elmira, ON'],
    dates: 'Apr 2 – 4, 2026',
    note: "Three spring days in Waterloo Region's Mennonite country, an hour and a bit west of Toronto. Elmira gives the first Saturday of April over to its maple syrup festival, which bills itself as the largest single-day maple festival anywhere.",
    facts: [
      { label: 'Days', value: '3' },
      { label: 'Cities', value: '1' },
      { label: 'Region', value: 'Waterloo' },
    ],
    image: '/travel/elmira.webp',
    ratio: '4 / 3',
  },

  {
    id: 'egypt',
    no: 26,
    year: '2025',
    period: 'November 2025',
    headline: 'Cairo',
    country: 'Egypt',
    cities: ['Cairo', 'Luxor'],
    dates: 'Nov 21 – 25, 2025',
    note: 'Five days between the delta and Upper Egypt — Giza and the Egyptian Museum in Cairo, then Karnak, Luxor Temple and the Valley of the Kings upriver. The Great Pyramid of Khufu is the last of the seven ancient wonders still standing.',
    facts: [
      { label: 'Days', value: '5' },
      { label: 'Cities', value: '2' },
      { label: 'Oldest thing seen', value: 'c. 2560 BC', accent: true },
    ],
    image: '/travel/cairo.webp',
    ratio: '3 / 2',
  },
  {
    id: 'italy',
    no: 25,
    year: '2025',
    period: 'August 2025',
    headline: 'Rome',
    country: 'Italy & Vatican City',
    cities: ['Rome', 'Vatican City', 'Florence', 'Venice'],
    dates: 'Aug 16 – 23, 2025',
    note: "Eight days working north: the Colosseum and the Forum in Rome, St Peter's across the border in Vatican City, the Duomo and the Uffizi in Florence, and the canals at the end of it in Venice. Vatican City is the smallest sovereign state on earth, about half a square kilometre inside one city.",
    facts: [
      { label: 'Days', value: '8' },
      { label: 'Cities', value: '4' },
      { label: 'Countries', value: '2', accent: true },
    ],
    image: '/travel/rome.webp',
    ratio: '3 / 2',
  },
  {
    id: 'darlington',
    no: 24,
    year: '2025',
    period: 'July 2025',
    headline: 'Darlington',
    country: 'Canada',
    cities: ['Bowmanville, ON'],
    dates: 'Jul 11 – 12, 2025',
    note: 'An overnight under canvas at Darlington Provincial Park, on the Lake Ontario shore just south of Bowmanville. The park sits on the Waterfront Trail with a long strip of beach and the lake doing the horizon.',
    facts: [
      { label: 'Days', value: '2' },
      { label: 'Cities', value: '1' },
      { label: 'Nights camped', value: '1' },
    ],
    image: '/travel/darlington.webp',
    ratio: '16 / 10',
  },
  {
    id: 'new-york',
    no: 23,
    year: '2025',
    period: 'May 2025',
    headline: 'New York',
    country: 'United States',
    cities: ['New York, NY'],
    dates: 'May 17 – 20, 2025',
    note: 'Four days on Manhattan — Midtown, the High Line on the west side, and the museum stretch up Fifth Avenue. Central Park keeps 341 hectares in the middle of the island, which is the only reason the grid is bearable in May.',
    facts: [
      { label: 'Days', value: '4' },
      { label: 'Cities', value: '1' },
      { label: 'Park', value: '341 ha' },
    ],
    image: '/travel/new-york.webp',
    ratio: '4 / 3',
  },

  {
    id: 'brazil',
    no: 22,
    year: '2024',
    period: 'October 2024',
    headline: 'Rio de Janeiro',
    country: 'Brazil',
    cities: ['Rio de Janeiro', 'São Paulo'],
    dates: 'Oct 13 – 20, 2024',
    note: "Eight days between Brazil's two largest cities — Copacabana, Sugarloaf and the cog railway up Corcovado in Rio, then Avenida Paulista and Ibirapuera in São Paulo. Christ the Redeemer stands 30 m tall on a peak 710 m above Guanabara Bay, with the whole city laid out under its arms.",
    facts: [
      { label: 'Days', value: '8' },
      { label: 'Cities', value: '2' },
      { label: 'Corcovado', value: '710 m', accent: true },
    ],
    image: '/travel/rio-de-janeiro.webp',
    ratio: '16 / 10',
  },
  {
    id: 'gatineau',
    no: 21,
    year: '2024',
    period: 'September 2024',
    headline: 'Gatineau',
    country: 'Canada',
    cities: ['Gatineau, QC'],
    dates: 'Sep 1 – 2, 2024',
    note: 'A Labour Day weekend across the Ottawa River, where the language and the architecture both change at the bridge. Gatineau Park runs northwest out of the city over 361 square kilometres of the Gatineau Hills.',
    facts: [
      { label: 'Days', value: '2' },
      { label: 'Cities', value: '1' },
      { label: 'Park', value: '361 km²' },
    ],
    image: '/travel/gatineau.webp',
    ratio: '4 / 3',
  },
  {
    id: 'belgium',
    no: 20,
    year: '2024',
    period: 'June 2024',
    headline: 'Brussels',
    country: 'Belgium',
    cities: ['Brussels'],
    dates: 'Jun 28, 2024',
    note: 'One day in Brussels, taken as a rail hop out of the Netherlands and back — the Grand-Place, the Royal Galleries, the Manneken Pis and a great deal of walking in between. The square has been a UNESCO World Heritage site since 1998.',
    facts: [
      { label: 'Days', value: '1' },
      { label: 'Cities', value: '1' },
      { label: 'Square', value: 'Grand-Place' },
    ],
    image: '/travel/brussels.webp',
    ratio: '3 / 2',
  },
  {
    id: 'netherlands',
    no: 19,
    year: '2024',
    period: 'June 2024',
    headline: 'Amsterdam',
    country: 'Netherlands',
    cities: ['Amsterdam', 'Rotterdam'],
    dates: 'Jun 27 – Jul 1, 2024',
    note: "Four days in the Randstad — Amsterdam's canal ring and the Rijksmuseum, then Rotterdam, rebuilt after the war and looking nothing like its neighbour. The 17th-century ring is itself a World Heritage site.",
    facts: [
      { label: 'Days', value: '4' },
      { label: 'Cities', value: '2' },
      { label: 'Canal ring', value: '17th c.' },
    ],
    image: '/travel/amsterdam.webp',
    ratio: '4 / 3',
  },
  {
    id: 'france',
    no: 18,
    year: '2024',
    period: 'May 2024',
    headline: 'Paris',
    country: 'France',
    cities: ['Paris', 'Versailles'],
    dates: 'May 16 – 20, 2024',
    note: 'Five days in Paris with a day sent out west to Versailles — the Louvre, Montmartre, the bridges, then the palace gardens on their absurd axis. The Eiffel Tower stands 330 m over the Champ de Mars.',
    facts: [
      { label: 'Days', value: '5' },
      { label: 'Cities', value: '2' },
      { label: 'Eiffel Tower', value: '330 m', accent: true },
    ],
    image: '/travel/paris.webp',
    ratio: '3 / 4',
  },
  {
    id: 'dubai',
    no: 17,
    year: '2024',
    period: 'January 2024',
    headline: 'Dubai',
    country: 'United Arab Emirates',
    cities: ['Dubai'],
    dates: 'Jan 25 – Feb 10, 2024',
    note: 'Seventeen days across the turn of February, long enough to stop reading the city as a skyline — Downtown and the Marina, the old souks at Deira, the creek abras, the dunes inland. The Burj Khalifa is still the tallest building in the world at 828 m.',
    facts: [
      { label: 'Days', value: '17' },
      { label: 'Cities', value: '1' },
      { label: 'Burj Khalifa', value: '828 m', accent: true },
    ],
    image: '/travel/dubai.webp',
    ratio: '3 / 4',
  },

  {
    id: 'mexico',
    no: 16,
    year: '2023',
    period: 'November 2023',
    headline: 'Cancún',
    country: 'Mexico',
    cities: ['Cancún', 'Playa del Carmen', 'Chichén Itzá'],
    dates: 'Nov 10 – 17, 2023',
    note: "Eight days on the Yucatán's Caribbean edge with an inland run to Chichén Itzá. El Castillo, the step pyramid at the centre of the site, carries 365 steps across its four staircases — one for each day of the year.",
    facts: [
      { label: 'Days', value: '8' },
      { label: 'Cities', value: '3' },
      { label: 'El Castillo', value: '365 steps', accent: true },
    ],
    image: '/travel/cancun.webp',
    ratio: '3 / 2',
  },
  {
    id: 'peru',
    no: 15,
    year: '2023',
    period: 'August 2023',
    headline: 'Cusco',
    country: 'Peru',
    cities: ['Cusco', 'Lima'],
    dates: 'Aug 13 – 15, 2023',
    note: 'Three days between the coast and the Andes — Lima first, then up to the old Inca capital for the Plaza de Armas and the stonework at Qorikancha. Cusco sits around 3,400 m, high enough that the coca tea is a practical measure rather than a souvenir.',
    facts: [
      { label: 'Days', value: '3' },
      { label: 'Cities', value: '2' },
      { label: 'Altitude', value: '3,400 m', accent: true },
    ],
    image: '/travel/cusco.webp',
    ratio: '3 / 2',
  },
  {
    id: 'miami',
    no: 14,
    year: '2023',
    period: 'August 2023',
    headline: 'Miami',
    country: 'United States',
    cities: ['Miami, FL'],
    dates: 'Aug 11 – 12, 2023',
    note: 'Two days in Miami on the way south — South Beach, the Art Deco frontages along Ocean Drive, and Little Havana. The Miami Beach Architectural District preserves roughly 800 of those buildings in about one square mile.',
    facts: [
      { label: 'Days', value: '2' },
      { label: 'Cities', value: '1' },
      { label: 'Art Deco', value: '~800 buildings' },
    ],
    image: '/travel/florida.webp',
    ratio: '16 / 10',
  },
  {
    id: 'las-vegas',
    no: 13,
    year: '2023',
    period: 'May 2023',
    headline: 'Las Vegas',
    country: 'United States',
    cities: ['Las Vegas, NV', 'Grand Canyon'],
    dates: 'May 23 – Jun 6, 2023',
    note: 'Just over two weeks based in the Mojave, with the long drive east to the Grand Canyon in the middle of it. The canyon runs some 446 km and drops about a mile below the South Rim.',
    facts: [
      { label: 'Days', value: '15' },
      { label: 'Cities', value: '2' },
      { label: 'Canyon', value: '446 km', accent: true },
    ],
    image: '/travel/las-vegas.webp',
    ratio: '3 / 2',
  },
  {
    id: 'ottawa',
    no: 12,
    year: '2023',
    period: 'May 2023',
    headline: 'Ottawa',
    country: 'Canada',
    cities: ['Ottawa, ON'],
    dates: 'May 12 – 14, 2023',
    note: 'Three days in the capital in tulip season — Parliament Hill, the Rideau Canal, the National Gallery. The Canadian Tulip Festival grows out of a wartime gift of bulbs from the Dutch royal family, and it still shows in the numbers.',
    facts: [
      { label: 'Days', value: '3' },
      { label: 'Cities', value: '1' },
      { label: 'Canal', value: 'Rideau' },
    ],
    image: '/travel/ottawa.webp',
    ratio: '4 / 3',
  },
  {
    id: 'niagara',
    no: 11,
    year: '2023',
    period: 'February 2023',
    headline: 'Niagara Falls',
    country: 'Canada',
    cities: ['Niagara Falls, ON'],
    dates: 'Feb 18 – 20, 2023',
    note: 'A Family Day weekend at the falls in deep winter, with the spray frozen onto every railing and the crowds down to nothing. The Horseshoe Falls drop about 57 m and carry the bulk of the river.',
    facts: [
      { label: 'Days', value: '3' },
      { label: 'Cities', value: '1' },
      { label: 'Drop', value: '57 m', accent: true },
    ],
    image: '/travel/niagara-falls.webp',
    ratio: '3 / 4',
  },
  {
    id: 'denver',
    no: 10,
    year: '2023',
    period: 'February 2023',
    headline: 'Denver',
    country: 'United States',
    cities: ['Denver, CO'],
    dates: 'Feb 10 – 13, 2023',
    note: 'Four days in Denver with the Front Range parked on the western horizon — LoDo, Union Station, the capitol. The fifteenth step of that capitol sits exactly one mile above sea level, and the city has never let anyone forget it.',
    facts: [
      { label: 'Days', value: '4' },
      { label: 'Cities', value: '1' },
      { label: 'Elevation', value: '1,609 m' },
    ],
    image: '/travel/denver.webp',
    ratio: '4 / 3',
  },

  {
    id: 'jasper',
    no: 9,
    year: '2022',
    period: 'May 2022',
    headline: 'Jasper',
    country: 'Canada',
    cities: ['Jasper, AB'],
    dates: 'May 21 – 24, 2022',
    note: 'A long May weekend in the north end of the Rockies — Maligne Lake, Athabasca Falls, and the top of the Icefields Parkway with the snow still on it. Jasper is the largest of the mountain parks at roughly 11,000 square kilometres.',
    facts: [
      { label: 'Days', value: '4' },
      { label: 'Cities', value: '1' },
      { label: 'Park', value: '11,000 km²', accent: true },
    ],
    image: '/travel/jasper.webp',
    ratio: '3 / 2',
  },

  {
    id: 'los-angeles',
    no: 8,
    year: '2021',
    period: 'November 2021',
    headline: 'Los Angeles',
    country: 'United States',
    cities: ['Los Angeles, CA', 'Pasadena', 'Universal City'],
    dates: 'Nov 24 – 26, 2021',
    note: 'American Thanksgiving spent across greater LA — downtown, Old Town Pasadena, and the backlots at Universal City. The Hollywood sign on the ridge above Griffith Park has been up since 1923, when it was an advertisement for real estate.',
    facts: [
      { label: 'Days', value: '3' },
      { label: 'Cities', value: '3' },
      { label: 'Region', value: 'Greater LA' },
    ],
    image: '/travel/los-angeles.webp',
    ratio: '4 / 3',
  },
  {
    id: 'philadelphia',
    no: 7,
    year: '2021',
    period: 'November 2021',
    headline: 'Philadelphia',
    country: 'United States',
    cities: ['Philadelphia, PA', 'St. Louis, MO'],
    dates: 'Nov 20 – 23, 2021',
    note: 'Four days split between two river cities — Independence Hall and the Liberty Bell in one, the Gateway Arch in the other. The arch stands 192 m over the Mississippi, the tallest monument in the country.',
    facts: [
      { label: 'Days', value: '4' },
      { label: 'Cities', value: '2' },
      { label: 'Gateway Arch', value: '192 m', accent: true },
    ],
    image: '/travel/philadelphia.webp',
    ratio: '16 / 10',
  },

  {
    id: 'quebec',
    no: 6,
    year: '2018',
    period: 'December 2018',
    headline: 'Québec City',
    country: 'Canada',
    cities: ['Québec City', 'Montréal, QC'],
    dates: 'Dec 21 – 24, 2018',
    note: 'Four days in Québec over the solstice — Vieux-Montréal and the Mount Royal lookout first, then the ramparts of the upper town under snow, with the Château Frontenac standing over the Dufferin Terrace and the river below it. Québec is the only walled city north of Mexico with its fortifications still standing.',
    facts: [
      { label: 'Days', value: '4' },
      { label: 'Cities', value: '2' },
      { label: 'Château Frontenac', value: 'Opened 1893', accent: true },
    ],
    image: '/travel/quebec-city.webp',
    ratio: '3 / 2',
  },
  {
    id: 'banff',
    no: 5,
    year: '2018',
    period: 'September 2018',
    headline: 'Banff',
    country: 'Canada',
    cities: ['Calgary, AB', 'Banff'],
    dates: 'Aug 31 – Sep 4, 2018',
    note: 'Five days out of Calgary and into the Bow Valley — Lake Louise, Moraine Lake, and the drive between them at the end of the summer. Banff was the first national park in Canada, set aside in 1885.',
    facts: [
      { label: 'Days', value: '5' },
      { label: 'Cities', value: '2' },
      { label: 'Established', value: '1885' },
    ],
    image: '/travel/banff.webp',
    ratio: '4 / 3',
  },
  {
    id: 'punta-cana',
    no: 4,
    year: '2018',
    period: 'March 2018',
    headline: 'Punta Cana',
    country: 'Dominican Republic',
    cities: ['Punta Cana'],
    dates: 'Mar 25 – 29, 2018',
    note: "Five days on the eastern tip of Hispaniola, where the Bávaro beaches run for kilometres of palm and white sand. Punta Cana's coastline faces two seas at once — the Atlantic to the north, the Caribbean to the south.",
    facts: [
      { label: 'Days', value: '5' },
      { label: 'Cities', value: '1' },
      { label: 'Seas', value: 'Two', accent: true },
    ],
    image: '/travel/punta-cana.webp',
    ratio: '3 / 2',
  },

  {
    id: 'ontario',
    no: 3,
    year: '2017',
    period: 'July 2017 – today',
    headline: 'Ontario',
    country: 'Canada — home',
    cities: [
      'Toronto',
      'Whitney',
      'Collingwood',
      'Barrie',
      'Markham',
      'Innisfil',
      'Niagara-on-the-Lake',
      'Tobermory',
      'Burlington',
      'Kawartha Lakes',
      'Elora',
      'Ottawa',
    ],
    note: "Home base since July 2017, and the weekend map that grew out of it — Algonquin's west gate at Whitney, the Bruce Peninsula at Tobermory, the gorge at Elora, the Escarpment at Collingwood, and a dozen towns in between. Ontario is about a million square kilometres, which is why the road trips have never finished.",
    dates: 'July 2017 – present',
    facts: [
      { label: 'Towns', value: '12' },
      { label: 'Since', value: 'July 2017' },
      { label: 'Base', value: 'Toronto', accent: true },
    ],
    image: '/travel/toronto.webp',
    ratio: '16 / 10',
  },
  {
    id: 'malaysia',
    no: 2,
    year: '2011',
    period: 'September 2011',
    headline: 'Kuala Lumpur',
    country: 'Malaysia',
    cities: ['Kuala Lumpur', 'Langkawi'],
    dates: 'Sep 23 – 29, 2011',
    note: 'A week between the capital and the Andaman Sea — KLCC and Batu Caves in Kuala Lumpur, then the beaches and mangroves of Langkawi. The Petronas Towers held the title of tallest buildings in the world from 1998 to 2004, at 452 m.',
    facts: [
      { label: 'Days', value: '7' },
      { label: 'Cities', value: '2' },
      { label: 'Petronas Towers', value: '452 m', accent: true },
    ],
    image: '/travel/kuala-lumpur.webp',
    ratio: '3 / 4',
  },
  {
    id: 'india',
    no: 1,
    year: 'Before',
    period: 'Birth – June 2017',
    headline: 'India',
    country: 'India — where it starts',
    cities: [
      'Chennai',
      'Bangalore',
      'Delhi',
      'Goa',
      'Pune',
      'Tirupati',
      'Agra',
      'Pondicherry',
      'Rameswaram',
      'Chidambaram',
      'Mahabalipuram',
      'Jaipur',
      'Jodhpur',
      'Jaisalmer',
      'Bhubaneswar',
    ],
    dates: 'Birth – June 2017',
    note: 'Where the timeline starts, and the one entry with no dates worth keeping: the years before the move, from Chennai and Bangalore in the south up through Delhi and Agra to the desert forts of Rajasthan, with the shore temples at Mahabalipuram and Rameswaram somewhere in every school holiday. Fifteen cities and no itineraries — the dates blur because none of it was a trip.',
    facts: [
      { label: 'Cities', value: '15' },
      { label: 'Until', value: 'June 2017' },
      { label: 'Dates', value: 'Unrecorded', accent: true },
    ],
    image: '/travel/india.webp',
    ratio: '4 / 3',
  },
]

/** Section groupings in page order, newest first. */
export interface YearGroup {
  year: string
  /** Rail and sticky-numeral label — 'Before' has no numeral to print. */
  label: string
  entries: Journey[]
  /** "Four entries" line under the numeral. */
  countries: string[]
}

const WORD = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']

export function entryCountLabel(n: number): string {
  const word = WORD[n] ?? String(n)
  return `${word} ${n === 1 ? 'entry' : 'entries'}`
}

/** "Italy & Vatican City" -> both; "Canada — home" -> just the country. */
function countryNames(j: Journey): string[] {
  return j.country
    .split('&')
    .map((c) => c.split('—')[0].trim())
    .filter(Boolean)
}

export const GROUPS: YearGroup[] = (() => {
  const out: YearGroup[] = []
  for (const j of JOURNEYS) {
    let g = out.find((x) => x.year === j.year)
    if (!g) {
      g = { year: j.year, label: j.year === 'Before' ? 'Before' : j.year, entries: [], countries: [] }
      out.push(g)
    }
    g.entries.push(j)
    // The line under the numeral names each country of the year once, in order.
    for (const name of countryNames(j)) {
      if (!g.countries.includes(name)) g.countries.push(name)
    }
  }
  return out
})()

/** Rail marks: one per section, in page order. */
export const RAIL = GROUPS.map((g) => ({ year: g.year, label: g.label }))

export const STATS = {
  entries: JOURNEYS.length,
  countries: new Set(JOURNEYS.flatMap(countryNames)).size,
  cities: new Set(JOURNEYS.flatMap((j) => j.cities.map((c) => c.split(',')[0].trim()))).size,
}
