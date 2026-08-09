"use client";
import { useState, useEffect } from "react";

export default function AdminContact() {
  const [info, setInfo] = useState<any>({ phone: "", whatsapp: "", email: "", address: "", mapEmbedUrl: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/contact")
      .then(r => r.json())
      .then(data => {
        if (data.success && data.info) setInfo(data.info);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });
      const data = await res.json();
      setMsg(data.success ? "Contact info saved!" : "Error: " + (data.error || "Unknown"));
    } catch {
      setMsg("Network error");
    } finally {
      setSaving(false);
    }
  };

  const fieldStyle: React.CSSProperties = { width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "1rem", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", marginBottom: "6px", fontWeight: "600", color: "#444" };

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "var(--secondary-color)", marginBottom: "30px" }}>Contact Info Manager</h1>

      {msg && (
        <div style={{ padding: "12px", borderRadius: "6px", marginBottom: "20px", background: msg.startsWith("Error") ? "#ffebee" : "#e8f5e9", color: msg.startsWith("Error") ? "#c62828" : "#2e7d32" }}>
          {msg}
        </div>
      )}

      {loading ? <p>Loading...</p> : (
        <div style={{ background: "white", borderRadius: "12px", padding: "30px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", maxWidth: "700px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>📞 Phone Number</label>
            <input value={info.phone || ""} onChange={e => setInfo({ ...info, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" style={fieldStyle} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>💬 WhatsApp Number</label>
            <input value={info.whatsapp || ""} onChange={e => setInfo({ ...info, whatsapp: e.target.value })} placeholder="91XXXXXXXXXX" style={fieldStyle} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>📧 Email Address</label>
            <input type="email" value={info.email || ""} onChange={e => setInfo({ ...info, email: e.target.value })} placeholder="school@example.com" style={fieldStyle} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>📍 Full Address</label>
            <textarea value={info.address || ""} onChange={e => setInfo({ ...info, address: e.target.value })} rows={3}
              placeholder="School full address..." style={{ ...fieldStyle, resize: "vertical" }} />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={labelStyle}>🗺️ Google Maps Embed URL</label>
            <textarea value={info.mapEmbedUrl || ""} onChange={e => setInfo({ ...info, mapEmbedUrl: e.target.value })} rows={3}
              placeholder="Paste Google Maps embed URL (src from iframe)..." style={{ ...fieldStyle, resize: "vertical", fontSize: "0.85rem" }} />
          </div>

          <button onClick={handleSave} disabled={saving}
            style={{ padding: "12px 30px", background: "var(--primary-color)", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
