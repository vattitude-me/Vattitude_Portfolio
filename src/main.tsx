import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import ArtTimeline from './pages/ArtTimeline'
import EraDeepDive from './pages/EraDeepDive'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/art-timeline" element={<ArtTimeline />} />
        <Route path="/art-timeline/:eraId" element={<EraDeepDive />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
