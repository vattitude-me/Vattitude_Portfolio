# Vattitude

Vatsa's portfolio site, built with React, TypeScript, and Vite.

## Pages

- `/` — main portfolio (hero, about, services, portfolio, contact)
- `/art-timeline` — interactive scroll-driven Art History Timeline (see [docs/art-history-timeline-plan.md](docs/art-history-timeline-plan.md))
- `/art-timeline/:eraId` — deep-dive view for a single art era
- `/privacy`, `/terms` — legal pages

## Project structure

```
src/
  components/   shared UI components used on the main portfolio page
  pages/        route-level pages (ArtTimeline, EraDeepDive, Privacy, Terms)
  data/         static content data (art eras, etc.)
  lib/          third-party integrations (Firebase)
scripts/        build-time scripts (social preview prerendering)
public/         static assets served as-is
docs/           planning/spec docs
```

## Development

```bash
npm install
npm run dev       # start dev server
npm run build     # type-check, build, and prerender social preview images
npm run preview   # preview the production build
npm run lint      # run oxlint
```

## Deployment

Configured for both Netlify (`netlify.toml`) and Vercel (`vercel.json`), each serving `dist/` as an SPA.
