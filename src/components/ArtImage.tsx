import { useState } from 'react'

/* ------------------------------------------------------------------ *
 * Image with graceful fallback - never render a blank frame.
 * Shared by the timeline and the era deep-dive pages.
 * ------------------------------------------------------------------ */
export default function ArtImage({
  src,
  alt,
  className,
  eager = false,
}: {
  src: string
  alt: string
  className?: string
  eager?: boolean
}) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  return (
    <span className="relative block w-full h-full overflow-hidden">
      {status !== 'ok' && (
        <span
          aria-hidden
          className={`absolute inset-0 bg-gradient-to-br from-white/[0.07] to-white/[0.02] ${
            status === 'loading' ? 'animate-pulse' : ''
          }`}
        />
      )}
      {status === 'error' ? (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
          <svg className="w-7 h-7 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16v12H4z"
            />
          </svg>
          <span className="text-[11px] leading-snug text-white/40">{alt}</span>
        </span>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setStatus('ok')}
          onError={() => setStatus('error')}
          className={`${className ?? ''} ${status === 'ok' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
        />
      )}
    </span>
  )
}
