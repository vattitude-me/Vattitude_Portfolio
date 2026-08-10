import type { ReactNode } from 'react'

/* ------------------------------------------------------------------ *
 * An 18th-century gilt frame, built from layered gradients (the carved
 * moulding) plus SVG cartouches at the corners and rail centres.
 *
 * Nothing here is an image file: the whole thing is tintable per era via
 * `accent`, and stays crisp at any viewport. The frame is fixed to the
 * viewport and the content scrolls *inside* it, which is why `inset` is a
 * number of pixels rather than padding on a wrapper.
 * ------------------------------------------------------------------ */

/** Acanthus-leaf corner cartouche. Drawn once, mirrored into all 4 corners. */
function CornerOrnament({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="gild" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4e4b8" />
          <stop offset="35%" stopColor="#c9a227" />
          <stop offset="60%" stopColor="#8a6d1f" />
          <stop offset="100%" stopColor="#d9c078" />
        </linearGradient>
      </defs>
      {/* Outer scroll */}
      <path
        d="M2 2 L46 2 C30 8 16 18 10 34 C6 44 4 56 2 62 Z"
        fill="url(#gild)"
        opacity="0.95"
      />
      {/* Acanthus curl */}
      <path
        d="M14 14 C30 16 42 26 46 42 C40 30 28 22 14 22 Z"
        fill={accent}
        opacity="0.5"
      />
      <path
        d="M8 40 C20 40 30 48 34 60 C28 50 18 46 8 48 Z"
        fill="url(#gild)"
        opacity="0.75"
      />
      {/* Bead accent */}
      <circle cx="20" cy="20" r="3.2" fill="#f6ebc6" opacity="0.9" />
      <circle cx="10" cy="52" r="2.1" fill="#f6ebc6" opacity="0.6" />
      <circle cx="52" cy="10" r="2.1" fill="#f6ebc6" opacity="0.6" />
    </svg>
  )
}

/** Centre cartouche on each rail - the small crest at the midpoint. */
function RailCrest({ accent, vertical = false }: { accent: string; vertical?: boolean }) {
  return (
    <svg
      viewBox="0 0 60 28"
      className="w-full h-full"
      style={vertical ? { transform: 'rotate(90deg)' } : undefined}
      aria-hidden
    >
      <path
        d="M30 2 C36 10 46 12 58 14 C46 16 36 18 30 26 C24 18 14 16 2 14 C14 12 24 10 30 2 Z"
        fill="url(#gild)"
        opacity="0.9"
      />
      <circle cx="30" cy="14" r="3.6" fill={accent} opacity="0.75" />
    </svg>
  )
}

export default function GildedFrame({
  children,
  accent = '#c9a227',
  inset = 30,
  className,
}: {
  children: ReactNode
  /** Era colour mixed into the ornament, so the frame shifts with the scene. */
  accent?: string
  /** Thickness of the moulding in px. Shrinks on small screens. */
  inset?: number
  className?: string
}) {
  // The carved profile: highlight, hollow, bead, then the gilt face. Reads as
  // depth without any texture map.
  // More stops = a deeper carved profile: outer bevel, hollow, bead, gilt face.
  const stops = `
      #4a3a10 0%, #8a6d1f 6%, #d9bd6b 13%, #f6ecc4 20%, #c9a227 30%,
      #6b5518 42%, #4a3a10 50%, #7d611b 58%, #d9bd6b 70%,
      #f0dfa8 79%, #b8912f 88%, #5c4813 100%`
  const moulding = `linear-gradient(180deg, ${stops})`

  return (
    <div className={`relative ${className ?? ''}`}>
      {/* Frame chrome - fixed, non-interactive, above the scrolling content. */}
      <div
        aria-hidden
        className="fixed inset-0 z-[80] pointer-events-none hidden sm:block"
        style={{ transition: 'filter 700ms ease' }}
      >
        {/* Four rails */}
        {(['top', 'bottom'] as const).map((side) => (
          <div
            key={side}
            className="absolute left-0 right-0"
            style={{
              [side]: 0,
              height: inset,
              background: moulding,
              boxShadow:
                side === 'top'
                  ? '0 6px 14px -4px rgba(0,0,0,0.85), inset 0 -1px 0 rgba(0,0,0,0.5)'
                  : '0 -6px 14px -4px rgba(0,0,0,0.85), inset 0 1px 0 rgba(0,0,0,0.5)',
            }}
          />
        ))}
        {(['left', 'right'] as const).map((side) => (
          <div
            key={side}
            className="absolute top-0 bottom-0"
            style={{
              [side]: 0,
              width: inset,
              background: `linear-gradient(90deg, ${stops})`,
              boxShadow:
                side === 'left'
                  ? '6px 0 14px -4px rgba(0,0,0,0.85)'
                  : '-6px 0 14px -4px rgba(0,0,0,0.85)',
            }}
          />
        ))}

        {/* Inner fillet - the dark lip where frame meets canvas. */}
        <div
          className="absolute"
          style={{
            top: inset,
            left: inset,
            right: inset,
            bottom: inset,
            boxShadow:
              'inset 0 0 0 1px rgba(0,0,0,0.75), inset 0 0 0 3px rgba(201,162,39,0.35), inset 0 0 26px 6px rgba(0,0,0,0.55)',
          }}
        />

        {/* Corner cartouches */}
        {(
          [
            ['top-0 left-0', 'none'],
            ['top-0 right-0', 'scaleX(-1)'],
            ['bottom-0 left-0', 'scaleY(-1)'],
            ['bottom-0 right-0', 'scale(-1,-1)'],
          ] as const
        ).map(([pos, transform]) => (
          <div
            key={pos}
            className={`absolute ${pos}`}
            style={{
              width: inset * 3.4,
              height: inset * 3.4,
              transform,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))',
            }}
          >
            <CornerOrnament accent={accent} />
          </div>
        ))}

        {/* Rail crests at the midpoints */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0"
          style={{ width: inset * 4.5, height: inset * 2.1 }}
        >
          <RailCrest accent={accent} />
        </div>
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 rotate-180"
          style={{ width: inset * 4.5, height: inset * 2.1 }}
        >
          <RailCrest accent={accent} />
        </div>
      </div>

      {/* Content scrolls inside the frame's opening. */}
      <div style={{ paddingLeft: `${inset}px`, paddingRight: `${inset}px` }} className="max-sm:!p-0 md:!px-0">
        {children}
      </div>
    </div>
  )
}
