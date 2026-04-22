import type { VercelRequest, VercelResponse } from '@vercel/node'

const API_URL =
  `https://newsdata.io/api/1/latest` +
  `?apikey=${process.env.NEWSDATA_API_KEY}` +
  `&country=us&language=en&category=top&prioritydomain=top&image=1&removeduplicate=1`

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const upstream = await fetch(API_URL)
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: `Upstream error ${upstream.status}` })
      return
    }
    const data = await upstream.json()
    // Vercel CDN caches this response for 10 minutes for all users;
    // serves stale content for up to 24 h while revalidating in the background.
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=86400')
    res.json(data)
  } catch {
    res.status(500).json({ error: 'Failed to fetch news' })
  }
}
