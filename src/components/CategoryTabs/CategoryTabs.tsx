import styles from './CategoryTabs.module.scss'

const TABS = ['Top', 'Tech', 'Business', 'Sports', 'Health'] as const
type Tab = typeof TABS[number]

interface CategoryTabsProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function CategoryTabs({ activeTab, onTabChange }: CategoryTabsProps) {
  return (
    <nav className={styles.tabs} aria-label="News categories">
      <ul className={styles.list} role="tablist">
        {TABS.map((tab) => (
          <li key={tab} role="presentation">
            <button
              role="tab"
              aria-selected={activeTab === tab}
              className={activeTab === tab ? `${styles.tab} ${styles.active}` : styles.tab}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export type { Tab }
export { TABS }
