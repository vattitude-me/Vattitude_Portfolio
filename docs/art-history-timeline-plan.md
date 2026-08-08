# Art History Timeline - Interactive Single-Page Experience
## Planning Document

> Status: **Planning only - no code built yet.** This doc is meant to be dropped into a repo as the north-star spec before implementation begins.

---

## 1. Concept Summary

A single-page, scroll-driven journey through art history. As the user scrolls, the page flows through major artistic **Ages/Movements** (e.g., Prehistoric → Ancient → Medieval → Renaissance → Baroque → Romanticism → Impressionism → Modern → Contemporary). Each age has:

- A full-viewport "era section" with a distinct visual identity (color palette, background treatment, typography mood) that morphs smoothly into the next as you scroll - the "futuristic flow" between ages.
- A **hero artwork** - the single most famous/iconic piece representing that age - large, high-impact, center stage.
- **Key artist popups/cards** - clicking or hovering an artist chip opens a panel/modal with a portrait (if available), short bio, and 1–3 famous works with images.
- A **timeline scrubber/progress rail** (fixed on the side or bottom) showing all ages, current position, and allowing click-to-jump navigation.

The overall feel: modern editorial meets sci-fi data-viz - dark base UI, glassmorphism panels, animated gradient transitions, subtle particle/grid backgrounds, smooth parallax, and scroll-linked animation (not just fade-ins).

---

## 2. Free & Open Art Image / Data Sources

All of these provide free, high-res, mostly public-domain (CC0) images usable without licensing fees. Recommended to **verify each endpoint at build time** (APIs occasionally change auth requirements or URL structure), but as of last known state:

| Source | What it offers | License | Access method |
|---|---|---|---|
| **Wikimedia Commons / Wikidata** | Massive public-domain art image archive; nearly every famous painting has a Commons file | Public domain / CC0 / CC-BY-SA depending on file | REST API (`commons.wikimedia.org/w/api.php`), no key needed |
| **The Met (Metropolitan Museum of Art) Open Access API** | 470k+ high-res images, full object metadata (artist, date, movement, medium) | CC0 for public-domain works | REST API, no key needed (`collectionapi.metmuseum.org`) |
| **Art Institute of Chicago API** | Excellent structured API, IIIF image service for zoomable high-res images | CC0 for public-domain works | REST API, no key needed (`api.artic.edu/api/v1/artworks`) |
| **Rijksmuseum API** | Deep Dutch Golden Age collection (Vermeer, Rembrandt, etc.), high-res | Public domain (Rijksstudio) | REST API, **requires free API key** |
| **National Gallery of Art (Washington) Open Data** | Full dataset + images, strong Renaissance/Baroque/American collection | CC0 (Open Access program) | Bulk data / API |
| **Cleveland Museum of Art Open Access API** | 30k+ CC0 images, very developer-friendly, includes IIIF | CC0 | REST API, no key needed (`openaccess-api.clevelandart.org`) |
| **Europeana** | Aggregates thousands of European museums/archives | Mixed, filterable by CC0/public domain | REST API, requires free API key |
| **Smithsonian Open Access** | 4.5M+ images across all Smithsonian museums | CC0 | REST API, requires free API key |

**Recommendation for build phase:** Use **Wikimedia Commons** as the primary fallback/universal source (broadest coverage of "the one famous painting" per era) combined with **The Met** and **Art Institute of Chicago** APIs for higher-quality structured metadata + IIIF zoom images where the artwork exists in their collections. This gives resilience - if one API doesn't have a piece, another likely does.

**Note on caution:** Since I could not run a live web search in this session, exact current API endpoint URLs, auth requirements, and rate limits should be re-verified against official docs immediately before implementation (these platforms occasionally restructure). Treat the table above as directionally correct, not gospel.

---

## 3. Proposed Timeline / Ages Structure

Suggested set of 9 eras (adjustable - could trim to 6–7 for a tighter experience, or expand):

1. **Prehistoric Art** (~40,000–4,000 BCE) - Cave paintings (Lascaux, Altamira)
2. **Ancient & Classical Art** (~3000 BCE–400 CE) - Egyptian, Greek, Roman (e.g., Bust of Nefertiti, Parthenon friezes)
3. **Medieval Art** (~400–1400) - Byzantine icons, illuminated manuscripts, Gothic art
4. **Renaissance** (~1400–1600) - Da Vinci, Michelangelo, Raphael, Botticelli (Mona Lisa, The Birth of Venus)
5. **Baroque** (~1600–1750) - Caravaggio, Rembrandt, Vermeer (Girl with a Pearl Earring, The Night Watch)
6. **Romanticism & Neoclassicism** (~1750–1850) - Goya, Delacroix, David (Liberty Leading the People)
7. **Impressionism & Post-Impressionism** (~1860–1900) - Monet, Van Gogh, Degas (Starry Night, Water Lilies)
8. **Modern Art** (~1900–1970) - Picasso, Dalí, Kandinsky, Warhol (Guernica, The Persistence of Memory)
9. **Contemporary Art** (~1970–present) - Basquiat, Banksy, Kusama, digital/AI art movements

Each era entry (data-model level) should hold:

```
{
  id, name, yearRange, shortDescription,
  colorTheme: { primary, accent, gradientFrom, gradientTo },
  heroArtwork: { title, artist, year, imageUrl, sourceCredit, sourceLink },
  keyArtists: [
    { name, years, bio, portraitUrl, works: [{ title, imageUrl, year }] }
  ]
}
```

This structure means the whole experience can be driven by a single JSON/JS data file - easy to expand/edit without touching layout code.

---

## 4. Interaction & Scroll Experience Design

### 4.1 Core scroll mechanics
- **Scroll-linked, not just scroll-triggered.** Use scroll position mapped directly to animation progress (e.g., via `IntersectionObserver` + `requestAnimationFrame`, or a lightweight scroll-progress library) so backgrounds, hero art scale/opacity, and color themes interpolate smoothly rather than snapping.
- Each era = one full-viewport "scene." Optional: scroll-snap per section for a more deliberate, guided feel - OR continuous free-scroll for a more cinematic feel. (Recommend continuous free-scroll with strong visual cueing, since scroll-snap can feel janky on trackpads/mobile.)
- **Background morph:** the gradient/particle background of era N smoothly cross-fades and shifts hue toward era N+1's palette as the user scrolls through the transition zone between sections.
- **Hero artwork treatment:** artwork image starts slightly scaled down/faded as section enters, scales up to full prominence as it centers in viewport, then recedes as user continues - classic parallax "reveal" pattern.

### 4.2 Timeline navigation rail
- Fixed vertical rail (desktop) / horizontal bar (mobile) along one edge showing all era markers as nodes on a line.
- Current era node is highlighted/glowing; connecting line "fills in" as progress is made - like a circuit board or data stream animation (ties into the futuristic aesthetic).
- Clicking any node smooth-scrolls to that era instantly - lets users jump around rather than forcing linear scroll only.

### 4.3 Key artist popovers
- Within each era section, a horizontal row/cluster of **artist chips** (name + small thumbnail).
- Click (or tap) opens a **modal/side panel** with:
  - Artist portrait or self-portrait if available
  - Birth–death years, nationality, one-paragraph bio
  - 2–3 famous works as a small gallery (click to enlarge)
- Panel should animate in as a glass-panel slide/fade, consistent with the futuristic UI language, and be dismissible via close button, click-outside, or Esc key.
- Keyboard accessible (focus trap while open, Esc to close, tab-navigable).

### 4.4 "Dive into an age" deep-focus mode
- Each era section has a "Dive In" / expand affordance (e.g., a subtle pulsing icon near the hero artwork).
- Clicking triggers a **focused takeover view** of that era: the hero artwork enlarges to near-fullscreen with a soft dark overlay, supporting details (movement description, key characteristics, list of major artists) slide in around it.
- Exit returns smoothly to the scroll flow at the same scroll position.

### 4.5 Micro-interactions & futuristic flow details
- Subtle animated grid-lines, particle drift, or gradient-mesh backgrounds (canvas or CSS-only depending on perf budget) - sci-fi museum-of-the-future feel.
- Section transition "portals": a thin animated line/beam sweeps across the screen at each era boundary as a transition cue.
- Custom cursor or hover glow on interactive elements (artist chips, timeline nodes) for tactile, high-tech feel.
- Numbers/year ranges rendered in a monospace or techy display font contrasted against a more classical serif for artwork titles - deliberate tension between "ancient content" and "future interface."

---

## 5. Visual / Contemporary-Futuristic Design Direction

- **Palette:** Deep near-black base (`#0a0a0f`-ish) with each era carrying its own accent gradient (e.g., Prehistoric = ochre/rust, Renaissance = gold/cream, Baroque = deep burgundy/gold, Impressionism = soft lavender/teal, Modern = electric magenta/cyan, Contemporary = neon multi-color). This gives visual variety while keeping a consistent dark "gallery at night" shell.
- **Typography:** Pairing of a clean geometric sans (UI chrome, nav, timeline labels - feels futuristic) with a refined serif or display face for artwork titles and artist names (feels art-historical/editorial). Avoid generic system fonts for a "designed" feel.
- **Glassmorphism** for popup panels and the nav rail - translucent frosted panels over the animated background.
- **Motion easing:** everything on smooth cubic-bezier easing, no linear/jarring motion; respect `prefers-reduced-motion` for accessibility (fall back to simple fades, no parallax).
- **Imagery treatment:** hero artworks presented large, with a subtle vignette/glow frame rather than a plain `<img>` - museum-lighting effect.

---

## 6. Technical Approach (proposed, not yet built)

- **Format:** Single HTML page (or single React-style component/artifact) - self-contained, no build step required, per the "single page" ask.
- **Structure:**
  - Data layer: one JS object/array holding all era + artist + artwork data (from section 3), including image URLs sourced from the free databases in section 2.
  - Rendering: vanilla JS + CSS (or lightweight framework if the target repo already uses one) driving DOM structure from the data layer, so adding/editing an era is a data change, not a markup change.
  - Scroll engine: IntersectionObserver for section-enter/exit detection + a scroll-progress calculation for interpolated animations. Avoid heavy scroll-jacking libraries where possible for performance; prefer CSS scroll-timeline / native features where browser support allows, with JS fallback.
- **Performance considerations:**
  - Lazy-load era images (only load hero + artist thumbnails for current/adjacent sections).
  - Use responsive image sizes (museums' APIs typically offer multiple resolutions/IIIF resizing - request smaller sizes for thumbnails, full-res only for the "dive in" focus view).
  - Preload the next era's hero image slightly before it's needed.
- **Accessibility:**
  - All interactive elements keyboard-operable.
  - Alt text for every artwork image (artist + title, sourced from metadata).
  - Reduced-motion fallback path.
  - Sufficient color contrast maintained even as era theme colors shift (test each era's text/background contrast individually).
- **Attribution:** Every artwork must display artist, title, year, and source museum/collection with a link back - required by most CC0/open-access terms as good practice even where not legally mandated, and keeps the "art database" sourcing transparent to viewers.

---

## 7. Open Questions / Decisions Needed Before Build

1. **Scope of eras:** Use the 9 proposed above, or trim/expand? Fewer eras = tighter, more polished experience; more eras = more comprehensive but harder to keep every transition feeling premium.
2. **Framework constraint:** Should this be pure HTML/CSS/JS (max portability, easiest to drop into any repo) or built as a React component (if the target repo is React-based)?
3. **Scroll-snap vs. free scroll:** Deliberate section-by-section snap, or continuous cinematic scroll?
4. **Number of key artists per era:** 3–4 feels manageable; more risks clutter.
5. **Image sourcing strategy:** Pull images live from APIs at runtime (more dynamic, but dependent on uptime/CORS) vs. curate a fixed list of confirmed image URLs at build time (more reliable, but static). **Recommended: curate a fixed, verified list** for reliability and load speed, using the APIs as the research/sourcing tool rather than live runtime calls.
6. **Mobile experience:** Confirm whether the side timeline rail collapses to a bottom bar or a hamburger-style menu on small screens.

---

## 8. Suggested Next Steps

1. Confirm answers to Section 7's open questions.
2. Finalize the era list and, for each era, confirm the exact hero artwork + 3 key artists (with verified working image URLs from the sources in Section 2).
3. Build the data file first (all era/artist/artwork JSON), independent of visual design.
4. Build static layout/scroll skeleton with placeholder styling.
5. Layer in the futuristic visual design system (palette, type, glass panels, backgrounds).
6. Layer in scroll-linked animation and transitions.
7. Add artist popover interactions + "dive into an age" focus mode.
8. Accessibility + performance pass.
9. Cross-browser/device QA (scroll behavior is the highest-risk area for inconsistency).

