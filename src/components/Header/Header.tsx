import styles from './Header.module.scss'

interface HeaderProps {
  title?: string
}

export function Header({ title = 'Your Latest News' }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <button className={styles.searchBtn} aria-label="Search">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="#111111" strokeWidth="1.5" />
          <path d="M13 13L17 17" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </header>
  )
}
