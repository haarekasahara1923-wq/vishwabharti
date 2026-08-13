import styles from "./AnnouncementBar.module.css";

const DEFAULT_ANNOUNCEMENTS = [
  "📚 Admissions Open for Session 2025-26 — Limited Seats Available!",
  "🏆 Vishwa Bharti Higher Secondary School — Affiliated & Recognized School, Gwalior, MP",
  "📢 For admission enquiries call: +91-9425773348",
];

type Props = {
  announcements: string[];
};

export default function AnnouncementBar({ announcements }: Props) {
  const items =
    announcements && announcements.length > 0
      ? announcements
      : DEFAULT_ANNOUNCEMENTS;

  return (
    <div className={styles.tickerWrapper}>
      <div className={styles.tickerContent}>
        {items.map((text, idx) => (
          <span key={idx} className={styles.announcementItem}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
