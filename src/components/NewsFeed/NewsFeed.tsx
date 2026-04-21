import { useState } from 'react'
import { useNews } from '../../hooks/useNews'
import { Header } from '../Header/Header'
import { CategoryTabs } from '../CategoryTabs/CategoryTabs'
import { ArticleCard } from '../ArticleCard/ArticleCard'
import type { Tab } from '../CategoryTabs/CategoryTabs'
import styles from './NewsFeed.module.scss'

const TAB_CATEGORY_MAP: Record<Tab, string | null> = {
  Top: null,
  Tech: 'technology',
  Business: 'business',
  Sports: 'sports',
  Health: 'health',
}

export function NewsFeed() {
  const [activeTab, setActiveTab] = useState<Tab>('Top')
  const { articles, loading, error } = useNews()

  const filtered = TAB_CATEGORY_MAP[activeTab] === null
    ? articles
    : articles.filter((a) =>
        a.category?.some((c) => c.toLowerCase() === TAB_CATEGORY_MAP[activeTab])
      )

  return (
    <>
      <Header />
      <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <main className={styles.feed}>
        {loading && (
          <div className={styles.state}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.skeleton} aria-hidden="true" />
            ))}
          </div>
        )}
        {error && (
          <div className={styles.state}>
            <p className={styles.errorMsg}>Unable to load news. Please try again.</p>
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className={styles.state}>
            <p className={styles.errorMsg}>No articles found.</p>
          </div>
        )}
        {!loading && !error && filtered.map((article) => (
          <ArticleCard key={article.article_id} article={article} />
        ))}
      </main>
    </>
  )
}
