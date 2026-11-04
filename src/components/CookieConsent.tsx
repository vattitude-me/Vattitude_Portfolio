import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getStoredConsent, updateConsent } from '../lib/consent'
import { trackEvent } from '../lib/analytics'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Gentle delay so initial render is smooth and non-jarring
    const timer = setTimeout(() => {
      const stored = getStoredConsent()
      if (!stored) {
        setIsVisible(true)
      }
    }, 800)

    const handleReopen = () => setIsVisible(true)
    window.addEventListener('open-cookie-banner', handleReopen)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('open-cookie-banner', handleReopen)
    }
  }, [])

  const handleAccept = () => {
    updateConsent(true)
    trackEvent('cookie_consent', { status: 'granted' })
    setIsVisible(false)
  }

  const handleDecline = () => {
    updateConsent(false)
    trackEvent('cookie_consent', { status: 'denied' })
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          role="region"
          aria-label="Cookie consent banner"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 z-50 p-4 rounded-2xl bg-[#0a0f1d]/95 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] text-slate-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 shrink-0 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
                <circle cx="7" cy="15" r="1" fill="currentColor" />
                <circle cx="15.5" cy="15.5" r="1" fill="currentColor" />
              </svg>
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <h4 className="text-xs font-semibold text-white tracking-wide uppercase">
                Cookie Preferences
              </h4>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                We use cookies to analyze site traffic and improve your browsing experience. Read our{' '}
                <Link to="/privacy" className="text-cyan-400 underline decoration-cyan-400/40 hover:decoration-cyan-400 transition-colors">
                  Privacy Policy
                </Link>.
              </p>
            </div>

            <button
              onClick={handleDecline}
              aria-label="Dismiss cookie notice"
              className="text-slate-400 hover:text-white p-1 -mr-1 -mt-1 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-end gap-2">
            <button
              onClick={handleDecline}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-colors border border-white/10 hover:border-white/20 hover:bg-white/5 cursor-pointer font-medium"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-1.5 text-xs font-medium text-white rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_12px_rgba(6,182,212,0.35)] cursor-pointer"
            >
              Accept
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
