"use client";
import { useState } from "react";
import styles from "./LeadForm.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LeadForm({ isOpen, onClose }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    purpose: "Admission Inquiry",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917000898311";
    
    const message = `Hello Vishwa Bharti Higher Secondary School,
I am interested in reaching out.

*Name:* ${formData.name}
*Contact:* ${formData.contact}
*Address:* ${formData.address}
*Purpose:* ${formData.purpose}

Please contact me back.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <div className={styles.headerIcon}>🎓</div>
        <h2 className={styles.title}>Admission Enquiry</h2>
        <p className={styles.subtitle}>Fill in your details and we&apos;ll reach out via WhatsApp</p>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name *</label>
            <div className={styles.inputWrap}>
              <input 
                type="text" 
                required 
                placeholder="e.g. Ramesh Kumar"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Contact Number *</label>
            <div className={styles.inputWrap}>
              <input 
                type="tel" 
                required 
                placeholder="+91 98765 43210"
                value={formData.contact} 
                onChange={e => setFormData({...formData, contact: e.target.value})} 
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Address *</label>
            <div className={styles.inputWrap}>
              <input 
                type="text" 
                required 
                placeholder="Your city / area"
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} 
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Purpose *</label>
            <div className={styles.inputWrap}>
              <select 
                value={formData.purpose} 
                onChange={e => setFormData({...formData, purpose: e.target.value})}
              >
                <option value="Admission Inquiry">Admission Inquiry</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Job Application">Job Application</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className={styles.submitBtn}>
            📱 Send via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
