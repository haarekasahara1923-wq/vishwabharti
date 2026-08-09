import styles from "./AnnouncementBar.module.css";

type Props = {
  announcements: string[];
};

export default function AnnouncementBar({ announcements }: Props) {
  if (!announcements || announcements.length === 0) return null;

  return (
    <div className={styles.tickerWrapper}>
      <div className={styles.tickerContent}>
        {announcements.map((text, idx) => (
          <span key={idx} className={styles.announcementItem}>
            📢 {text}
          </span>
        ))}
      </div>
    </div>
  );
}
