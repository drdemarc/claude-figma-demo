# Newsfeed PWA

A mobile-first news feed Progressive Web App built with React, Vite, and SCSS. Designed from a Figma mockup using the Simple Design System community library.

## Features

- Live news feed from Newsdata.io
- Installable PWA with offline support
- Phone frame UI on desktop
- Category tab filtering

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (also generates PWA icons)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

Copy `.env.example` to `.env` and add your Newsdata.io API key:

```
VITE_NEWSDATA_API_KEY=your_key_here
```

## Build & Deploy

```bash
npm run build
```

Deploys automatically to Vercel on push to `main`. The `vercel.json` config handles SPA routing rewrites.

## Tech Stack

- React 18 + TypeScript
- Vite 6
- SCSS (no CSS frameworks)
- vite-plugin-pwa (Workbox)
- Newsdata.io API
