"use client";
import { useState, useEffect } from "react";

export default function AdminAnnouncements() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/announcements?all=true");
      const data = await res.json();
      if (data.success) setItems(data.announcements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async () => {
    if (!newText.trim()) return;
    setAdding(true);
    setMsg("");
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText.trim(), isActive: true }),
      });
      const data = await res.json();
      if (data.success) {
        setNewText("");
        setMsg("Announcement added!");
        fetchItems();
      } else {
        setMsg("Error: " + data.error);
      }
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (item: any) => {
    setMsg("");
    try {
      const res = await fetch("/api/announcements", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, text: item.text, isActive: !item.isActive, displayOrder: item.displayOrder ?? 0 }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("Announcement status updated!");
        fetchItems();
      } else {
        setMsg("Error: " + (data.error || "Update failed"));
      }
    } catch {
      setMsg("Error updating announcement");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this announcement?")) return;
    setMsg("");
    try {
      const res = await fetch(`/api/announcements?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMsg("Announcement deleted!");
        fetchItems();
      } else {
        setMsg("Error: " + (data.error || "Delete failed"));
      }
    } catch {
      setMsg("Error deleting announcement");
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "var(--secondary-color)", marginBottom: "30px" }}>📢 Announcements Manager</h1>

      {msg && (
        <div style={{ padding: "12px", borderRadius: "6px", marginBottom: "20px", background: msg.startsWith("Error") ? "#ffebee" : "#e8f5e9", color: msg.startsWith("Error") ? "#c62828" : "#2e7d32" }}>
          {msg}
        </div>
      )}

      {/* Add new */}
      <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "24px" }}>
        <h3 style={{ margin: "0 0 15px", color: "#444" }}>Add New Announcement</h3>
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Type announcement text here..."
            style={{ flex: 1, padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "1rem" }}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newText.trim()}
            style={{ padding: "12px 24px", background: "var(--primary-color)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", opacity: adding ? 0.7 : 1 }}
          >
            {adding ? "Adding..." : "+ Add"}
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <div style={{ background: "white", borderRadius: "12px", padding: "40px", textAlign: "center", color: "#888", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          No announcements yet. Add one above!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{ background: "white", borderRadius: "10px", padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "16px", opacity: item.isActive ? 1 : 0.6 }}
            >
              <span style={{ fontSize: "1.5rem" }}>📢</span>
              <p style={{ flex: 1, margin: 0, fontSize: "0.95rem" }}>{item.text}</p>
              <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600", background: item.isActive ? "#e8f5e9" : "#f5f5f5", color: item.isActive ? "#2e7d32" : "#888" }}>
                {item.isActive ? "Active" : "Hidden"}
              </span>
              <button
                onClick={() => handleToggle(item)}
                style={{ padding: "7px 14px", background: item.isActive ? "#fff3e0" : "#e8f5e9", color: item.isActive ? "#e65100" : "#2e7d32", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}
              >
                {item.isActive ? "Hide" : "Show"}
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                style={{ padding: "7px 14px", background: "#ffebee", color: "#c62828", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
