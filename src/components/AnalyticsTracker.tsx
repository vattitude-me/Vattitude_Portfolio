import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView, trackClick } from '../lib/analytics'

export default function AnalyticsTracker() {
  const location = useLocation()

  // Track page views on route change
  useEffect(() => {
    // Wait slightly so document.title set by useSocialMeta or individual pages has updated
    const timer = setTimeout(() => {
      const path = location.pathname + location.search
      trackPageView(path, document.title)
    }, 120)

    return () => clearTimeout(timer)
  }, [location.pathname, location.search])

  // Global delegated click listener for outbound links, app links, and interactive elements
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest('a, button') as
        | HTMLAnchorElement
        | HTMLButtonElement
        | null
      if (!target) return

      // Handle anchor link clicks
      if (target.tagName.toLowerCase() === 'a') {
        const anchor = target as HTMLAnchorElement
        const href = anchor.href
        if (!href) return

        const isExternal =
          href.startsWith('http') && !href.includes(window.location.hostname)
        const isApp = href.includes('vattitude.ca') || isExternal
        const text =
          anchor.textContent?.trim().slice(0, 60) ||
          anchor.getAttribute('aria-label') ||
          anchor.title ||
          'link'

        if (isExternal || isApp) {
          trackClick(text, isExternal ? 'outbound_link' : 'navigation_link', href)
        }
        return
      }

      // Handle button clicks
      if (target.tagName.toLowerCase() === 'button') {
        const btn = target as HTMLButtonElement
        const trackingLabel =
          btn.getAttribute('data-analytics') ||
          btn.getAttribute('aria-label') ||
          btn.textContent?.trim().slice(0, 50)

        if (trackingLabel) {
          trackClick(trackingLabel, 'button_click')
        }
      }
    }

    document.addEventListener('click', handleClick, { capture: true })
    return () => document.removeEventListener('click', handleClick, { capture: true })
  }, [])

  return null
}
