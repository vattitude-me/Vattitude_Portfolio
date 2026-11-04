export type ConsentStatus = 'granted' | 'denied'

export const CONSENT_STORAGE_KEY = 'vattitude_cookie_consent'

export function getStoredConsent(): ConsentStatus | null {
  try {
    const val = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (val === 'granted' || val === 'denied') return val
  } catch {
    // localStorage unavailable (e.g. private mode restrictions)
  }
  return null
}

export function updateConsent(granted: boolean): void {
  const status: ConsentStatus = granted ? 'granted' : 'denied'
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, status)
  } catch {
    // ignore
  }

  if (typeof window !== 'undefined') {
    const w = window as unknown as {
      dataLayer?: unknown[]
      gtag?: (...args: unknown[]) => void
    }

    w.dataLayer = w.dataLayer || []
    if (typeof w.gtag !== 'function') {
      w.gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer!.push(arguments)
      }
    }

    w.dataLayer.push({
      event: 'consent_update',
      consent_status: status,
    })

    w.gtag('consent', 'update', {
      analytics_storage: status,
      ad_storage: status,
      ad_user_data: status,
      ad_personalization: status,
    })
  }
}
