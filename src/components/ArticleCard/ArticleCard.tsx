import { useState } from 'react'
import type { Article } from '../../types/news'
import { formatTimeAgo } from '../../utils/time'
import styles from './ArticleCard.module.scss'

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [imgError, setImgError] = useState(false)

  const timeAgo = formatTimeAgo(article.pubDate)

  return (
    <article className={styles.card}>
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        aria-label={article.title}
      >
        <div className={styles.meta}>
          <span className={styles.publisher}>{article.source_name}</span>
          {timeAgo && <span className={styles.time}>{timeAgo}</span>}
        </div>

        <div className={styles.body}>
          <div className={styles.text}>
            <h2 className={styles.title}>{article.title}</h2>
            {article.description && (
              <p className={styles.description}>{article.description}</p>
            )}
          </div>

          <div className={styles.thumbnail}>
            {article.image_url && !imgError ? (
              <img
                src={article.image_url}
                alt=""
                className={styles.image}
                onError={() => setImgError(true)}
                loading="lazy"
              />
            ) : (
              <div className={styles.placeholder} aria-hidden="true" />
            )}
          </div>
        </div>
      </a>
    </article>
  )
}
