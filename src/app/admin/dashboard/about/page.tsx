"use client";
import { useState, useEffect, useRef } from "react";

export default function AdminAbout() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [aboutSchoolText, setAboutSchoolText] = useState("");
  const [visionText, setVisionText] = useState("");
  const [missionText, setMissionText] = useState("");
  const [savingGeneral, setSavingGeneral] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const [resAbout, resSettings] = await Promise.all([
        fetch("/api/about"),
        fetch("/api/settings")
      ]);
      const dataAbout = await resAbout.json();
      const dataSettings = await resSettings.json();
      
      if (dataAbout.success) setItems(dataAbout.items);
      
      if (dataSettings.success) {
        const settingsMap: Record<string, string> = {};
        dataSettings.settings.forEach((s: any) => { settingsMap[s.key] = s.value; });
        setAboutSchoolText(settingsMap["about_school_text"] || "");
        setVisionText(settingsMap["vision_text"] || "");
        setMissionText(settingsMap["mission_text"] || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSaveGeneralInfo = async () => {
    setSavingGeneral(true);
    setMsg("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: [
            { key: "about_school_text", value: aboutSchoolText },
            { key: "vision_text", value: visionText },
            { key: "mission_text", value: missionText }
          ]
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("General info saved successfully!");
      } else {
        setMsg("Error: " + (data.error || "Unknown"));
      }
    } catch (err) {
      setMsg("Network error");
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Please select a photo smaller than 10MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    
    let finalPhotoUrl = editItem.photoUrl;
    let finalPhotoPublicId = editItem.photoPublicId;
    
    try {
      if (selectedFile) {
        setMsg("Uploading photo...");
        const sigRes = await fetch("/api/cloudinary-sign");
        const sigData = await sigRes.json();
        
        if (!sigRes.ok || !sigData.signature) {
          throw new Error(sigData.error || "Failed to get upload signature");
        }
        
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("api_key", sigData.apiKey);
        formData.append("timestamp", sigData.timestamp);
        formData.append("signature", sigData.signature);
        
        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`, {
          method: "POST",
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error?.message || "Cloudinary upload failed");
        
        finalPhotoUrl = uploadData.secure_url;
        finalPhotoPublicId = uploadData.public_id;
      }
      
      setMsg("Saving to database...");
      
      const res = await fetch("/api/about", {
        method: editItem.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editItem,
          photoUrl: finalPhotoUrl,
          photoPublicId: finalPhotoPublicId
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("Saved successfully!");
        setEditItem(null);
        setSelectedFile(null);
        fetchItems();
      } else {
        setMsg("Error: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      setMsg("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    background: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "20px",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2rem", color: "var(--secondary-color)" }}>About Us Manager</h1>
        <button
          onClick={() => {
            setEditItem({ role: "director", name: "", designation: "", message: "", photoUrl: "", photoPublicId: "" });
            setSelectedFile(null);
          }}
          style={{ padding: "10px 20px", background: "var(--primary-color)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          + Add New
        </button>
      </div>

      {msg && <div style={{ padding: "12px", borderRadius: "6px", marginBottom: "20px", background: msg.startsWith("Error") ? "#ffebee" : "#e8f5e9", color: msg.startsWith("Error") ? "#c62828" : "#2e7d32", fontWeight: msg.includes("Uploading") ? "bold" : "normal" }}>{msg}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div style={{ ...cardStyle, background: "#f8f9fa", border: "1px solid #ddd" }}>
            <h2 style={{ marginTop: 0 }}>School General Information</h2>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>About Vishwa Bharti Higher Secondary School</label>
              <textarea
                value={aboutSchoolText}
                onChange={e => setAboutSchoolText(e.target.value)}
                rows={4}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", resize: "vertical" }}
                placeholder="A legacy of education and character building..."
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Our Vision</label>
              <textarea
                value={visionText}
                onChange={e => setVisionText(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", resize: "vertical" }}
                placeholder="To be a premier educational institution recognized for academic excellence..."
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Our Mission</label>
              <textarea
                value={missionText}
                onChange={e => setMissionText(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", resize: "vertical" }}
                placeholder="To provide high-quality education that empowers students..."
              />
            </div>
            <button
              onClick={handleSaveGeneralInfo}
              disabled={savingGeneral}
              style={{ padding: "10px 20px", background: "#2e7d32", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
            >
              {savingGeneral ? "Saving..." : "Save General Info"}
            </button>
          </div>

          <h2 style={{ marginTop: "40px", color: "var(--secondary-color)" }}>Director & Principal Details</h2>
          {items.map(item => (
            <div key={item.id} style={cardStyle}>
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                {item.photoUrl && <img src={item.photoUrl} alt={item.name} style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }} />}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 5px", textTransform: "capitalize" }}>{item.role} — {item.name}</h3>
                  <p style={{ margin: "0 0 5px", color: "#666" }}>{item.designation}</p>
                  <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>{item.message?.substring(0, 100)}...</p>
                </div>
                <button
                  onClick={() => {
                    setEditItem({ ...item });
                    setSelectedFile(null);
                  }}
                  style={{ padding: "8px 16px", background: "#e3f2fd", color: "#1565c0", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ ...cardStyle, textAlign: "center", color: "#888", padding: "40px" }}>
              No entries yet. Add Director and Principal details.
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "12px", padding: "30px", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ marginTop: 0, color: "var(--secondary-color)" }}>{editItem.id ? "Edit" : "Add"} Entry</h2>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Role</label>
              <select value={editItem.role} onChange={e => setEditItem({ ...editItem, role: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}>
                <option value="director">Director</option>
                <option value="principal">Principal</option>
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Name</label>
              <input value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Designation</label>
              <input value={editItem.designation || ""} onChange={e => setEditItem({ ...editItem, designation: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Message</label>
              <textarea value={editItem.message || ""} onChange={e => setEditItem({ ...editItem, message: e.target.value })}
                rows={5} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", resize: "vertical" }} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Photo</label>
              {editItem.photoUrl && !selectedFile && (
                <img src={editItem.photoUrl} alt="preview" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px", display: "block" }} />
              )}
              
              <div style={{ marginBottom: "10px" }}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box" }}
                />
                {selectedFile && (
                  <p style={{ margin: "5px 0 0", fontSize: "0.8rem", color: "green" }}>{selectedFile.name} selected. Will replace existing photo on save.</p>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setEditItem(null)}
                style={{ padding: "10px 20px", background: "#f5f5f5", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ padding: "10px 20px", background: "var(--primary-color)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", opacity: saving ? 0.7 : 1, fontWeight: "bold" }}>
                {saving ? "Saving..." : "Save Data"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
