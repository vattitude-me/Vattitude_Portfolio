# Prompt / Instructions for AI Developer: Cinematic Travel Timeline SPA

## 1. Project Overview
Create a Single Page Application (SPA) that functions as a cinematic, scrollable timeline of my travel history. The interface must be highly immersive and responsive, utilizing smooth scroll-triggered animations (e.g., parallax effects, fade-ins, and zooming) to transition seamlessly between destinations. 

## 2. Core Features & Requirements
*   **Cinematic Scrollable Timeline:** Each travel destination should command the viewport as the user scrolls, creating a visual journey through time.
*   **Data Display:** Clearly display the Location Name (City & Country), and the Month and Year of the visit.
*   **Photo Gallery:** Display exactly 2 to 3 photos per destination. Use an aesthetic, modern layout for the images (e.g., a masonry grid, overlapping polaroid style, or dynamic background crossfading).
*   **Dynamic Data Management (CRUD):** 
    *   Include a hidden or toggleable admin/editor UI panel.
    *   Allow the addition of new places visited, or editing of existing places to correct dates/locations or update image URLs.
*   **Import/Export JSON:**
    *   **Export:** Provide a button to download the current state of the timeline as a `travel_history.json` file.
    *   **Import:** Provide an upload mechanism to populate the timeline via a JSON file.
    *   **Duplicate Handling (Crucial):** When importing JSON, the system MUST run a deduplication check (matching against location name and date). It should ignore duplicate entries to prevent redundant data.

## 3. Initial Data Payload
Use the following JSON structure to initialize the application state. This data combines historical travel records and upcoming planned trips in chronological order. Use placeholders for the `photos` array which I will update later.

```json
[
  {
    "id": "1",
    "country": "United States",
    "location": "Las Vegas, NV",
    "date": "September 2021",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "2",
    "country": "Canada",
    "location": "Toronto, ON",
    "date": "November 2021",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "3",
    "country": "United States",
    "location": "Denver, CO",
    "date": "February 2023",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "4",
    "country": "Canada",
    "location": "Niagara Falls, ON",
    "date": "February 2023",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "5",
    "country": "Canada",
    "location": "Ottawa, ON",
    "date": "May 2023",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "6",
    "country": "United States",
    "location": "Las Vegas, NV",
    "date": "May - June 2023",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "7",
    "country": "Peru",
    "location": "Cusco",
    "date": "August 2023",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "8",
    "country": "Mexico",
    "location": "Cancun",
    "date": "November 2023",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "9",
    "country": "United Arab Emirates",
    "location": "Dubai",
    "date": "January - February 2024",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "10",
    "country": "France",
    "location": "Paris",
    "date": "May 2024",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "11",
    "country": "Netherlands",
    "location": "Amsterdam",
    "date": "June - July 2024",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "12",
    "country": "Canada",
    "location": "Gatineau",
    "date": "September 2024",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "13",
    "country": "Brazil",
    "location": "Sao Paulo",
    "date": "October 2024",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "14",
    "country": "United States",
    "location": "New York, NY",
    "date": "May 2025",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "15",
    "country": "Canada",
    "location": "Darlington",
    "date": "July 2025",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "16",
    "country": "Italy",
    "location": "Rome",
    "date": "August 2025",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "17",
    "country": "Egypt",
    "location": "Cairo",
    "date": "November 2025",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "18",
    "country": "Canada",
    "location": "Elmira, ON",
    "date": "April 2026",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "19",
    "country": "Philippines",
    "location": "Philippines",
    "date": "April 2026",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "20",
    "country": "Japan",
    "location": "Tokyo",
    "date": "May 2026",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "21",
    "country": "South Korea",
    "location": "South Korea",
    "date": "Spring 2026",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "22",
    "country": "United States",
    "location": "Washington, D.C.",
    "date": "July - August 2026",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "23",
    "country": "Canada",
    "location": "Yellowknife and Whitehorse",
    "date": "August 2026",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "24",
    "country": "United States",
    "location": "Florida",
    "date": "September 2026",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  },
  {
    "id": "25",
    "country": "Iceland",
    "location": "Reykjavik, Snaefellsnes & South Coast",
    "date": "October 2026",
    "photos": ["photo1_url", "photo2_url", "photo3_url"]
  }
]
```

## 4. Technical Stack & Implementation Steps
*   **Frontend Framework:** Suggest using React with Vite or vanilla HTML/JS/CSS depending on your preferred approach for creating this SPA.
*   **Animations:** Use GSAP (with ScrollTrigger) or Framer Motion to handle the heavy lifting for the cinematic scroll effects and viewport triggers.
*   **State Persistence:** Utilize `localStorage` to save user edits, added destinations, and imported data so the timeline persists between browser reloads.
*   **Logic Checkpoint:** Before appending imported JSON array items to the state, filter out any objects where `location` and `date` strictly match an existing item in the array.
