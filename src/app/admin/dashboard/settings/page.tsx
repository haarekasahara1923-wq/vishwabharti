"use client";
import { useState, useEffect, useRef } from "react";

interface GalleryItem {
  id: number;
  title: string;
  type: string;
  cloudinaryUrl: string;
  thumbnailUrl?: string;
  category?: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Logo upload
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Hero Image Manager state
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [selectedHeroFromGallery, setSelectedHeroFromGallery] = useState<string>("");
  const [heroUploadFile, setHeroUploadFile] = useState<File | null>(null);
  const [heroUploadPreview, setHeroUploadPreview] = useState<string>("");
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroMsg, setHeroMsg] = useState("");
  const [heroTab, setHeroTab] = useState<"gallery" | "upload">("gallery");
  const heroInputRef = useRef<HTMLInputElement>(null);

  const defaultSettings = [
    { key: "school_name", label: "School Name", placeholder: "Vishwa Bharti Higher Secondary School" },
    { key: "school_tagline", label: "School Tagline", placeholder: "Empowering Generations Since 1964" },
    { key: "established_year", label: "Established Year", placeholder: "1964" },
    { key: "principal_name", label: "Principal Name", placeholder: "Dr. XYZ" },
    { key: "admission_open", label: "Admissions Open? (yes/no)", placeholder: "yes" },
  ];

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const map: Record<string, string> = {};
          data.settings.forEach((s: any) => { map[s.key] = s.value || ""; });
          setSettings(map);
        }
        setLoading(false);
      });

    // Load gallery photos for hero picker
    setGalleryLoading(true);
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setGalleryPhotos(data.items.filter((i: GalleryItem) => i.type === "photo"));
        }
        setGalleryLoading(false);
      })
      .catch(() => setGalleryLoading(false));
  }, []);

  // --- Logo handlers ---
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Logo file is too large. Please select an image smaller than 5MB.");
      if (logoInputRef.current) logoInputRef.current.value = "";
      return;
    }
    setSelectedLogoFile(file);
  };

  // --- Hero upload file handler ---
  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Hero image is too large. Please select an image smaller than 10MB.");
      if (heroInputRef.current) heroInputRef.current.value = "";
      return;
    }
    setHeroUploadFile(file);
    setHeroUploadPreview(URL.createObjectURL(file));
    setSelectedHeroFromGallery(""); // clear gallery selection
  };

  // --- Save Hero Image ---
  const handleSaveHeroImage = async () => {
    setHeroSaving(true);
    setHeroMsg("");

    try {
      let heroUrl = "";

      if (heroTab === "gallery" && selectedHeroFromGallery) {
        heroUrl = selectedHeroFromGallery;
      } else if (heroTab === "upload" && heroUploadFile) {
        setHeroMsg("Uploading hero image to Cloudinary...");
        const sigRes = await fetch("/api/cloudinary-sign");
        const sigData = await sigRes.json();
        if (!sigRes.ok || !sigData.signature) throw new Error(sigData.error || "Failed to get upload signature");

        const formData = new FormData();
        formData.append("file", heroUploadFile);
        formData.append("api_key", sigData.apiKey);
        formData.append("timestamp", sigData.timestamp);
        formData.append("signature", sigData.signature);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
          { method: "POST", body: formData }
        );
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error?.message || "Cloudinary upload failed");
        heroUrl = uploadData.secure_url;
      } else {
        setHeroMsg("Error: Please select a gallery image or upload a new one.");
        setHeroSaving(false);
        return;
      }

      setHeroMsg("Saving hero image...");
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: [{ key: "hero_image_url", value: heroUrl }] }),
      });
      const data = await res.json();
      if (data.success) {
        setSettings((prev) => ({ ...prev, hero_image_url: heroUrl }));
        setHeroMsg("✅ Hero image saved successfully!");
        setHeroUploadFile(null);
        setHeroUploadPreview("");
        if (heroInputRef.current) heroInputRef.current.value = "";
      } else {
        setHeroMsg("Error: " + (data.error || "Failed to save"));
      }
    } catch (err: any) {
      setHeroMsg("Error: " + err.message);
    } finally {
      setHeroSaving(false);
    }
  };

  // --- Remove hero image (reset to default) ---
  const handleRemoveHeroImage = async () => {
    if (!confirm("Remove custom hero image? The default image will be used.")) return;
    setHeroSaving(true);
    setHeroMsg("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: [{ key: "hero_image_url", value: "" }] }),
      });
      const data = await res.json();
      if (data.success) {
        setSettings((prev) => ({ ...prev, hero_image_url: "" }));
        setSelectedHeroFromGallery("");
        setHeroMsg("✅ Hero image reset to default.");
      } else {
        setHeroMsg("Error: " + (data.error || "Failed to reset"));
      }
    } catch (err: any) {
      setHeroMsg("Error: " + err.message);
    } finally {
      setHeroSaving(false);
    }
  };

  // --- Save General Settings ---
  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    let updatedSettings = { ...settings };

    try {
      if (selectedLogoFile) {
        setMsg("Uploading logo...");
        const sigRes = await fetch("/api/cloudinary-sign");
        const sigData = await sigRes.json();
        if (!sigRes.ok || !sigData.signature) throw new Error(sigData.error || "Failed to get upload signature");

        const formData = new FormData();
        formData.append("file", selectedLogoFile);
        formData.append("api_key", sigData.apiKey);
        formData.append("timestamp", sigData.timestamp);
        formData.append("signature", sigData.signature);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
          { method: "POST", body: formData }
        );
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error?.message || "Cloudinary upload failed");
        updatedSettings["school_logo_url"] = uploadData.secure_url;
        setSettings(updatedSettings);
      }

      setMsg("Saving settings...");
      const entries = Object.entries(updatedSettings).map(([key, value]) => ({ key, value }));
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: entries }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("✅ Settings saved successfully!");
        setSelectedLogoFile(null);
        if (logoInputRef.current) logoInputRef.current.value = "";
      } else {
        setMsg("Error: " + (data.error || "Unknown"));
      }
    } catch (err: any) {
      setMsg("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%", padding: "12px", borderRadius: "6px",
    border: "1px solid #ddd", fontSize: "1rem", boxSizing: "border-box"
  };
  const labelStyle: React.CSSProperties = {
    display: "block", marginBottom: "6px", fontWeight: "600", color: "#444"
  };
  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 20px", borderRadius: "6px 6px 0 0", border: "none",
    cursor: "pointer", fontWeight: 600, fontSize: "0.9rem",
    background: active ? "#0284c7" : "#e0f2fe",
    color: active ? "#fff" : "#0369a1",
    marginRight: "4px", transition: "all 0.2s ease"
  });

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "var(--secondary-color)", marginBottom: "30px" }}>⚙️ Site Settings</h1>

      {/* ===== HERO IMAGE MANAGER ===== */}
      <div style={{ background: "white", borderRadius: "12px", padding: "30px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "30px", border: "2px solid #bae6fd" }}>
        <h2 style={{ margin: "0 0 8px", color: "#0284c7", fontSize: "1.3rem" }}>🖼️ Hero Section Image Manager</h2>
        <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "20px" }}>
          Choose which image appears as the full-screen background on the homepage hero section.
        </p>

        {/* Current hero image preview */}
        {settings["hero_image_url"] && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ ...labelStyle, color: "#0369a1" }}>✅ Current Hero Image:</label>
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={settings["hero_image_url"]}
                alt="Current Hero"
                style={{ width: "100%", maxWidth: "480px", height: "160px", objectFit: "cover", borderRadius: "8px", border: "2px solid #0284c7", display: "block" }}
              />
              <button
                onClick={handleRemoveHeroImage}
                disabled={heroSaving}
                style={{ position: "absolute", top: "8px", right: "8px", background: "#b91c1c", color: "white", border: "none", borderRadius: "4px", padding: "4px 10px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
              >
                ✕ Remove
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ marginBottom: "0" }}>
          <button style={tabStyle(heroTab === "gallery")} onClick={() => setHeroTab("gallery")}>📸 Select from Gallery</button>
          <button style={tabStyle(heroTab === "upload")} onClick={() => setHeroTab("upload")}>⬆️ Upload New Image</button>
        </div>

        {/* Tab content */}
        <div style={{ border: "1px solid #bae6fd", borderRadius: "0 8px 8px 8px", padding: "20px", background: "#f0f9ff" }}>
          {heroTab === "gallery" ? (
            <>
              <p style={{ color: "#555", fontSize: "0.88rem", marginBottom: "14px" }}>
                Click any photo from your gallery to set it as the hero background.
              </p>
              {galleryLoading ? (
                <p style={{ color: "#888" }}>Loading gallery photos...</p>
              ) : galleryPhotos.length === 0 ? (
                <p style={{ color: "#888" }}>No photos in gallery yet. Upload some from the Gallery Manager first.</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", maxHeight: "320px", overflowY: "auto" }}>
                  {galleryPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => { setSelectedHeroFromGallery(photo.cloudinaryUrl); setHeroUploadFile(null); setHeroUploadPreview(""); }}
                      style={{
                        cursor: "pointer", borderRadius: "8px", overflow: "hidden", position: "relative",
                        border: selectedHeroFromGallery === photo.cloudinaryUrl ? "3px solid #0284c7" : "3px solid transparent",
                        transition: "border 0.2s ease", boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                      }}
                    >
                      <img src={photo.cloudinaryUrl} alt={photo.title} style={{ width: "100%", height: "90px", objectFit: "cover", display: "block" }} />
                      {selectedHeroFromGallery === photo.cloudinaryUrl && (
                        <div style={{ position: "absolute", top: 4, right: 4, background: "#0284c7", color: "white", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>✓</div>
                      )}
                      <div style={{ padding: "4px 6px", fontSize: "0.72rem", color: "#444", background: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{photo.title}</div>
                    </div>
                  ))}
                </div>
              )}
              {selectedHeroFromGallery && (
                <div style={{ marginTop: "12px", padding: "8px 12px", background: "#dcfce7", borderRadius: "6px", color: "#166534", fontSize: "0.88rem", fontWeight: 600 }}>
                  ✅ Image selected — click "Save Hero Image" below to apply.
                </div>
              )}
            </>
          ) : (
            <>
              <label style={labelStyle}>Upload a new image from your device (max 10MB):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroFileChange}
                ref={heroInputRef}
                style={fieldStyle}
              />
              {heroUploadPreview && (
                <div style={{ marginTop: "12px" }}>
                  <p style={{ marginBottom: "6px", fontSize: "0.88rem", color: "#0369a1", fontWeight: 600 }}>Preview:</p>
                  <img src={heroUploadPreview} alt="Hero Preview" style={{ width: "100%", maxWidth: "480px", height: "160px", objectFit: "cover", borderRadius: "8px", border: "2px solid #0284c7" }} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Hero save button & message */}
        {heroMsg && (
          <div style={{ marginTop: "12px", padding: "10px 14px", borderRadius: "6px", background: heroMsg.startsWith("Error") ? "#ffebee" : (heroMsg.includes("Uploading") ? "#fff3e0" : "#e8f5e9"), color: heroMsg.startsWith("Error") ? "#c62828" : (heroMsg.includes("Uploading") ? "#e65100" : "#2e7d32"), fontWeight: heroMsg.includes("...") ? "bold" : "normal" }}>
            {heroMsg}
          </div>
        )}
        <button
          onClick={handleSaveHeroImage}
          disabled={heroSaving || (!selectedHeroFromGallery && !heroUploadFile)}
          style={{ marginTop: "16px", padding: "12px 28px", background: "linear-gradient(135deg, #0284c7, #b91c1c)", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: (heroSaving || (!selectedHeroFromGallery && !heroUploadFile)) ? "not-allowed" : "pointer", opacity: (heroSaving || (!selectedHeroFromGallery && !heroUploadFile)) ? 0.6 : 1, transition: "all 0.2s ease" }}
        >
          {heroSaving ? "Saving..." : "💾 Save Hero Image"}
        </button>
      </div>

      {/* ===== GENERAL SETTINGS ===== */}
      {msg && (
        <div style={{ padding: "12px", borderRadius: "6px", marginBottom: "20px", background: msg.startsWith("Error") ? "#ffebee" : "e8f5e9", color: msg.startsWith("Error") ? "#c62828" : "#2e7d32", fontWeight: msg.includes("...") ? "bold" : "normal" }}>
          {msg}
        </div>
      )}

      {loading ? <p>Loading...</p> : (
        <div style={{ background: "white", borderRadius: "12px", padding: "30px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", maxWidth: "700px" }}>
          <h2 style={{ margin: "0 0 24px", color: "#444", fontSize: "1.1rem" }}>General Settings</h2>

          {/* Logo section */}
          <div style={{ marginBottom: "30px", paddingBottom: "20px", borderBottom: "1px solid #eee" }}>
            <label style={labelStyle}>School Logo</label>
            <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "10px" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#f0f0f0", overflow: "hidden", border: "1px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {settings["school_logo_url"] ? (
                  <img src={settings["school_logo_url"]} alt="Logo Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "0.8rem", color: "#888" }}>No Logo</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  ref={logoInputRef}
                  style={fieldStyle}
                />
                {selectedLogoFile && <p style={{ margin: "5px 0 0", fontSize: "0.8rem", color: "green" }}>{selectedLogoFile.name} selected.</p>}
              </div>
            </div>
          </div>

          {defaultSettings.map(({ key, label, placeholder }) => (
            <div key={key} style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>{label}</label>
              <input
                value={settings[key] || ""}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                placeholder={placeholder}
                style={fieldStyle}
              />
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: "12px 30px", background: "linear-gradient(135deg, #0284c7, #b91c1c)", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Saving..." : "💾 Save Settings"}
          </button>
        </div>
      )}
    </div>
  );
}
