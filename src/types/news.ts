export interface Article {
  article_id: string
  title: string
  description: string | null
  link: string
  image_url: string | null
  pubDate: string
  source_name: string
  category: string[]
}

export interface NewsResponse {
  status: string
  totalResults: number
  results: Article[]
  nextPage: string | null
}
