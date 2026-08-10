import { useEffect } from 'react'

/**
 * Per-route title / description / Open Graph tags.
 *
 * This only helps real browsers — social crawlers (LinkedIn, WhatsApp,
 * Facebook, Slack) fetch raw HTML and never run this. The share cards those
 * bots build come from the static files that scripts/prerender-social.mjs
 * writes at build time, which must be kept in sync with the values passed
 * here. Everything is restored on unmount so client-side navigation back to
 * the homepage doesn't leave a stale title behind.
 */

export const SITE_DEFAULTS = {
  title: 'Vattitude — Web Development, Branding & Digital Growth | Toronto',
  description:
    'Toronto-based digital agency building high-performance websites, apps, and brand identities. UI/UX design, SEO, e-commerce, and automation for businesses ready to grow.',
  url: 'https://vattitude.ca/',
  image: 'https://vattitude.ca/logo.png',
}

export interface SocialMeta {
  title: string
  description: string
  url: string
  image: string
}

function setMeta(name: string, content: string, prop = false) {
  const attr = prop ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function apply(meta: SocialMeta) {
  document.title = meta.title
  setMeta('title', meta.title)
  setMeta('description', meta.description)
  setMeta('og:type', 'website', true)
  setMeta('og:title', meta.title, true)
  setMeta('og:description', meta.description, true)
  setMeta('og:url', meta.url, true)
  setMeta('og:image', meta.image, true)
  setMeta('twitter:card', 'summary_large_image')
  setMeta('twitter:title', meta.title)
  setMeta('twitter:description', meta.description)
  setMeta('twitter:image', meta.image)
  setMeta('twitter:url', meta.url)

  const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  canonical?.setAttribute('href', meta.url)
}

export function useSocialMeta(meta: SocialMeta): void {
  const { title, description, url, image } = meta

  useEffect(() => {
    apply({ title, description, url, image })
    return () => apply(SITE_DEFAULTS)
  }, [title, description, url, image])
}
