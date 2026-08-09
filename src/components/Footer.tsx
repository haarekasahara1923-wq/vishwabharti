import Link from "next/link";
import styles from "./Footer.module.css";

interface FooterProps {
  schoolName?: string;
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
}

export default function Footer({
  schoolName = "Vishwa Bharti Higher Secondary School",
  tagline = "Empowering Generations Since 1964 — Gwalior, MP",
  address = "Sainik Colony, Pinto Park, Gwalior (MP)",
  phone = "+91-9425773348",
  email = "vishwabhartischool1964@gmail.com",
  logoUrl,
}: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
            <img 
              src={logoUrl || "/images/logo.jpg"} 
              alt={`${schoolName} Logo`} 
              style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <h3 className={styles.footerTitle} style={{ margin: 0 }}>{schoolName}</h3>
          </div>
          <p className={styles.footerText}>{tagline}</p>
        </div>
        
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Quick Links</h3>
          <ul className={styles.footerLinks}>
            <li><Link href="/about" className={styles.footerLink}>About Us</Link></li>
            <li><Link href="/gallery" className={styles.footerLink}>Gallery</Link></li>
            <li><Link href="/contact" className={styles.footerLink}>Contact Us</Link></li>
            <li><Link href="/admin/login" className={styles.footerLink}>Admin Login</Link></li>
          </ul>
        </div>
        
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Contact</h3>
          <p className={styles.footerText}>
            📍 {address}<br />
            📞 {phone}<br />
            ✉️ {email}
          </p>
        </div>
      </div>
      
      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} {schoolName}. All rights reserved.
      </div>
    </footer>
  );
}

