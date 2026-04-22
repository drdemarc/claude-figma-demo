import { useState, useEffect } from 'react'
import type { Article, NewsResponse } from '../types/news'

// In production, all users share a single CDN-cached response from /api/news.
// The CDN cache has a 10-minute TTL, so Newsdata.io is called at most once per
// 10-minute window regardless of traffic volume.
//
// In dev, there is no local API server, so we call Newsdata.io directly and use
// a localStorage cache to avoid burning the 200 req/day quota during development.
const IS_DEV = import.meta.env.DEV

const FETCH_URL = IS_DEV
  ? `https://newsdata.io/api/1/latest?apikey=${import.meta.env.VITE_NEWSDATA_API_KEY}&country=us&language=en&category=top&prioritydomain=top&image=1&removeduplicate=1`
  : '/api/news'

const CACHE_KEY = 'newsfeed:cache'
const CACHE_TTL = 10 * 60 * 1000

interface CacheEntry {
  articles: Article[]
  fetchedAt: number
}

function readCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as CacheEntry) : null
  } catch {
    return null
  }
}

function writeCache(articles: Article[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ articles, fetchedAt: Date.now() }))
  } catch {
    // Silently fail — private mode or quota exceeded
  }
}

interface UseNewsResult {
  articles: Article[]
  loading: boolean
  error: string | null
}

export function useNews(): UseNewsResult {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchNews() {
      // Dev only: serve from localStorage if cache is still fresh
      if (IS_DEV) {
        const cached = readCache()
        if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
          if (!cancelled) {
            setArticles(cached.articles)
            setLoading(false)
          }
          return
        }
      }

      try {
        const res = await fetch(FETCH_URL)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: NewsResponse = await res.json()
        const results = data.results ?? []
        if (IS_DEV) writeCache(results)
        if (!cancelled) {
          setArticles(results)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          // Fall back to stale cache on failure rather than showing an error
          const cached = readCache()
          if (cached) {
            setArticles(cached.articles)
          } else {
            setError(err instanceof Error ? err.message : 'Failed to load news')
          }
          setLoading(false)
        }
      }
    }

    fetchNews()
    return () => { cancelled = true }
  }, [])

  return { articles, loading, error }
}
