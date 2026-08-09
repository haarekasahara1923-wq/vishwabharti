"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./GalleryGrid.module.css";

type MediaItem = {
  id: number;
  title: string;
  type: "photo" | "video";
  url: string;
  thumbnailUrl?: string;
  category: string;
};

type Props = {
  items: MediaItem[];
};

export default function GalleryGrid({ items }: Props) {
  const [filter, setFilter] = useState<"all" | "photo" | "video">("all");
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);

  const filteredItems = items.filter(item => filter === "all" || item.type === filter);

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.filterTabs}>
        <button 
          className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === "photo" ? styles.active : ""}`}
          onClick={() => setFilter("photo")}
        >
          Photos
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === "video" ? styles.active : ""}`}
          onClick={() => setFilter("video")}
        >
          Videos
        </button>
      </div>

      <div className={styles.grid}>
        {filteredItems.map(item => (
          <div key={item.id} className={styles.gridItem} onClick={() => setActiveItem(item)}>
            {item.type === "video" ? (
              <video 
                src={item.thumbnailUrl || item.url}
                className={styles.itemImage}
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              <img 
                src={item.thumbnailUrl || item.url} 
                alt={item.title} 
                className={styles.itemImage}
                loading="lazy"
              />
            )}
            {item.type === "video" && (
              <div className={styles.playIcon}>▶️</div>
            )}
            <div className={styles.overlay}>
              <div className={styles.itemTitle}>{item.title}</div>
            </div>
          </div>
        ))}
      </div>

      {activeItem && (
        <div className={styles.lightbox} onClick={() => setActiveItem(null)}>
          <button className={styles.lightboxClose} onClick={() => setActiveItem(null)}>&times;</button>
          
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            {activeItem.type === "photo" ? (
              <img src={activeItem.url} alt={activeItem.title} style={{ maxWidth: '100%', maxHeight: '90vh' }} />
            ) : (
              <video src={activeItem.url} controls autoPlay style={{ maxWidth: '100%', maxHeight: '90vh' }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
