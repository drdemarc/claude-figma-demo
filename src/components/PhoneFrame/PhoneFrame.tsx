import styles from './PhoneFrame.module.scss'

interface PhoneFrameProps {
  children: React.ReactNode
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className={styles.phone}>
      <div className={styles.dynamicIsland} />
      <div className={styles.screen}>
        {children}
      </div>
      <div className={styles.homeIndicator} />
    </div>
  )
}
