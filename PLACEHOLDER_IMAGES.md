# Placeholder Images Implementation

## Overview
To improve perceived performance on slow network connections, low-quality placeholder images (LQIP) are shown while the full-resolution images load. This prevents users from seeing blank frames or loading spinners during slow image downloads.

## Files

### Placeholder Images (stored in `/public`)
- `placeholder-hero-prehistoric.jpg` (16KB) - Lascaux paintings
- `placeholder-hero-classical.jpg` (7.4KB) - Bust of Nefertiti
- `placeholder-hero-medieval.jpg` (17KB) - Angels at Mamre (Trinity)
- `placeholder-hero-renaissance.jpg` (8KB) - Mona Lisa
- `placeholder-hero-baroque.jpg` (10KB) - The Nightwatch
- `placeholder-hero-impressionism.jpg` (16KB) - Starry Night
- `placeholder-hero-modern.jpg` (10KB) - The Scream
- `placeholder-hero-contemporary.jpg` (21KB) - Ai Weiwei's Sunflower Seeds

Each is a 300x300px JPEG compressed at 35% quality (~60% smaller than originals).

### Component Changes

**ArtImage.tsx** - Enhanced with placeholder support:
- New optional `placeholder?: string` prop
- Displays placeholder while main image loads
- Smooth fade transition (700ms) from placeholder to full image
- Fallback gradient if no placeholder is provided
- No visual disruption if image fails to load

**ArtTimeline.tsx** - Now passes placeholders:
- Hero images show placeholder only for era overview (not when artist is selected)
- Artist portraits show placeholder while loading

### Data Changes

**artEras.ts**:
- Added `placeholderUrl?: string` to `heroArtwork` type
- Added `portraitPlaceholder?: string` to `Artist` type
- Each era's heroArtwork now includes a placeholder URL

## How It Works

1. **On Initial Load**: Placeholder (small, low-quality JPEG) displays immediately
2. **While Loading**: Main high-quality image loads in background
3. **On Complete**: Smooth fade transition (700ms) to full image
4. **On Error**: Falls back to gradient or error state

## Network Benefits

- Total placeholder size: ~124KB (all 8 images combined)
- User sees content immediately instead of blank/loading state
- Gracefully degrades if placeholders fail to load
- Works on all network conditions (3G, 4G, WiFi)

## Future Enhancements

- Add blur-hash encoded placeholders to reduce even further (requires build-time processing)
- Generate portrait placeholders for key artists
- Add placeholders to deep-dive artist work images
