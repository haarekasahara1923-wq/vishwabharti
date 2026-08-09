import styles from "./about.module.css";
import { db } from "@/db";
import { aboutContent, siteSettings } from "@/db/schema";

export const revalidate = 0;

export default async function AboutPage() {
  let items: any[] = [];
  let settings: any[] = [];
  let errorMsg = '';
  try {
    const [i, s] = await Promise.all([
    db.select().from(aboutContent),
    db.select().from(siteSettings)
    ]);
    items = i;
    settings = s;
  } catch (err: any) {
    errorMsg = err.message || String(err);
  }

  const settingsMap: Record<string, string> = {};
  settings.forEach(s => {
    if (s.value) settingsMap[s.key] = s.value;
  });

  const director = items.find((i) => i.role === "director");
  const principal = items.find((i) => i.role === "principal");

  const aboutText = settingsMap["about_school_text"] || "A legacy of education and character building.";
  const visionText = settingsMap["vision_text"] || "To be a premier educational institution recognized for academic excellence and the holistic development of students.";
  const missionText = settingsMap["mission_text"] || "To provide high-quality education that empowers students to become responsible, confident, and compassionate global citizens.";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>About Vishwa Bharti Higher Secondary School</h1>
        <p className={styles.subtitle} style={{ whiteSpace: "pre-wrap", maxWidth: "800px", margin: "0 auto" }}>{aboutText}</p>
      </div>

      <section className={styles.contentSection}>
        {/* Director */}
        <div className={styles.messageCard}>
          <div className={styles.imagePlaceholder}>
            {director?.photoUrl ? (
              <img
                src={director.photoUrl}
                alt={director.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
              />
            ) : (
              <span>Director Photo</span>
            )}
          </div>
          <div className={styles.textContent}>
            <h2 className={styles.roleTitle}>Director&apos;s Message</h2>
            <h3 className={styles.name}>{director?.name || "â€”"}</h3>
            {director?.designation && (
              <p style={{ color: "#777", marginBottom: "10px", fontStyle: "italic" }}>{director.designation}</p>
            )}
            <p className={styles.message}>
              {director?.message || "Message coming soon..."}
            </p>
          </div>
        </div>

        <div className={`${styles.messageCard} ${styles.reverseCard}`}>
          <div className={styles.imagePlaceholder}>
            {principal?.photoUrl ? (
              <img
                src={principal.photoUrl}
                alt={principal.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
              />
            ) : (
              <span>Principal Photo</span>
            )}
          </div>
          <div className={styles.textContent}>
            <h2 className={styles.roleTitle}>Principal&apos;s Message</h2>
            <h3 className={styles.name}>{principal?.name || "â€”"}</h3>
            {principal?.designation && (
              <p style={{ color: "#777", marginBottom: "10px", fontStyle: "italic" }}>{principal.designation}</p>
            )}
            <p className={styles.message}>
              {principal?.message || "Message coming soon..."}
            </p>
          </div>
        </div>
      </section>

      <section className={styles.missionVision}>
        <div className={styles.mvCard}>
          <h3>Our Vision</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{visionText}</p>
        </div>
        <div className={styles.mvCard}>
          <h3>Our Mission</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{missionText}</p>
        </div>
      </section>
    </div>
  );
}

