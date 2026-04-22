import { useState, useEffect } from 'react'
import type { Article, NewsResponse } from '../types/news'

const API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY
const API_URL = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&country=us&language=en&category=top&prioritydomain=top&image=1&removeduplicate=1`

const CACHE_KEY = 'newsfeed:cache'
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes in ms

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
    // Silently fail if localStorage is unavailable (private mode, quota exceeded)
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
      // Serve from cache if it's still within the 10-minute window
      const cached = readCache()
      if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
        if (!cancelled) {
          setArticles(cached.articles)
          setLoading(false)
        }
        return
      }

      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: NewsResponse = await res.json()
        const results = data.results ?? []
        writeCache(results)
        if (!cancelled) {
          setArticles(results)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          // Fall back to stale cache rather than showing an error
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
