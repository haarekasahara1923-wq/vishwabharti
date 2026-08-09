"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./Header.module.css";

interface HeaderProps {
  phone?: string;
  schoolName?: string;
  logoUrl?: string;
}

export default function Header({ 
  phone = "+919425773348", 
  schoolName = "Vishwa Bharti Higher Secondary School",
  logoUrl 
}: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact Us", path: "/contact" },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoContainer} onClick={closeMenu}>
        <img 
          src={logoUrl || "/images/logo.jpg"} 
          alt={`${schoolName} Logo`} 
          style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div className={styles.schoolName}>
          {schoolName}
        </div>
      </Link>

      <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
        {navLinks.map((link) => (
          <Link 
            key={link.path} 
            href={link.path}
            onClick={closeMenu}
            className={`${styles.navLink} ${pathname === link.path ? styles.active : ''}`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      <div className={styles.headerRight}>
        <a href={`tel:${phone}`} className={styles.callButton}>
          📞 <span className={styles.callText}>Call Now</span>
        </a>
        <button 
          className={styles.hamburger} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}

