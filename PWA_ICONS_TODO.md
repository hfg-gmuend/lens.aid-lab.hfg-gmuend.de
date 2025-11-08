# PWA Icons TODO

The PWA manifest requires icon files. These need to be created from the existing favicon or logo.

## Required Icons

Place these in `frontend/static/`:

1. **icon-192.png** (192x192px)
   - Standard PWA icon size
   - Used for app launcher and splash screen

2. **icon-512.png** (512x512px)
   - High-resolution PWA icon
   - Used for larger displays and app stores

## How to Create

### Option 1: From Existing Favicon
If you have an SVG favicon, you can export it to PNG at the required sizes using:
- Inkscape: `inkscape -w 192 -h 192 favicon.svg -o icon-192.png`
- ImageMagick: `convert -background none -resize 192x192 favicon.svg icon-192.png`

### Option 2: Using Online Tools
- https://realfavicongenerator.net/ - Generate all icon sizes from one image
- https://www.pwabuilder.com/ - PWA icon generator

### Option 3: Design Tool
Use Figma, Photoshop, or similar to create:
- 192x192px PNG with transparent background
- 512x512px PNG with transparent background
- Should match the app's theme color (#FF6B4A - coral)
- Consider maskable safe zone (80% of icon)

## Current Status

The manifest.json file references these icons, but they don't exist yet.
The app will still work, but won't be installable as a PWA until icons are added.

## Temporary Solution

For testing, you can create simple placeholder icons:
```bash
# Create solid color placeholders (requires ImageMagick)
convert -size 192x192 xc:#FF6B4A icon-192.png
convert -size 512x512 xc:#FF6B4A icon-512.png
```
