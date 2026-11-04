/**
 * Google Analytics 4 (GA4) & GTM tracking utility.
 * Measurement ID: G-3D5D66WY3J
 */

export const GA_MEASUREMENT_ID = 'G-3D5D66WY3J'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function ensureGtag(): (...args: unknown[]) => void {
  if (typeof window === 'undefined') return () => {}
  window.dataLayer = window.dataLayer || []
  if (typeof window.gtag !== 'function') {
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
  }
  return window.gtag
}

/**
 * Tracks a page view for Single Page Application navigation.
 */
export function trackPageView(path: string, title?: string): void {
  if (typeof window === 'undefined') return
  const gtag = ensureGtag()
  const pageTitle = title || document.title
  const pageLocation = window.location.href

  // 1. Direct GA4 event
  gtag('event', 'page_view', {
    page_title: pageTitle,
    page_location: pageLocation,
    page_path: path,
    send_to: GA_MEASUREMENT_ID,
  })

  // 2. GTM dataLayer event
  window.dataLayer?.push({
    event: 'page_view',
    page_title: pageTitle,
    page_location: pageLocation,
    page_path: path,
  })
}

/**
 * Tracks a custom event in both GA4 and GTM.
 */
export function trackEvent(
  eventName: string,
  eventParams: Record<string, unknown> = {}
): void {
  if (typeof window === 'undefined') return
  const gtag = ensureGtag()

  gtag('event', eventName, {
    ...eventParams,
    send_to: GA_MEASUREMENT_ID,
  })

  window.dataLayer?.push({
    event: eventName,
    ...eventParams,
  })
}

/**
 * Helper to track button or link clicks.
 */
export function trackClick(
  label: string,
  category = 'cta',
  url?: string,
  extra: Record<string, unknown> = {}
): void {
  trackEvent('click', {
    event_category: category,
    event_label: label,
    link_url: url,
    ...extra,
  })
}
