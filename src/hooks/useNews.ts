import { useState, useEffect } from 'react'
import type { Article, NewsResponse } from '../types/news'

const API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY
const API_URL = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&country=us&language=en&category=top&prioritydomain=top&image=1&removeduplicate=1`

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
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: NewsResponse = await res.json()
        if (!cancelled) {
          setArticles(data.results ?? [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load news')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchNews()
    return () => { cancelled = true }
  }, [])

  return { articles, loading, error }
}
