"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(160deg, #1C1208 0%, #3D2010 50%, #6F4E37 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorative circles */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(230,126,34,0.12), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-150px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(111,78,55,0.2), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        margin: '20px',
        background: 'rgba(255,253,249,0.97)',
        backdropFilter: 'blur(20px)',
        padding: '48px 44px',
        borderRadius: '24px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        position: 'relative',
        borderTop: '4px solid #E67E22',
        overflow: 'hidden',
      }}>
        {/* Top gradient tint */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(180deg, rgba(230,126,34,0.06), transparent)', pointerEvents: 'none' }} />

        {/* Icon */}
        <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, rgba(230,126,34,0.15), rgba(243,156,18,0.1))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px' }}>
          🔐
        </div>

        <h1 style={{ textAlign: 'center', marginBottom: '6px', color: '#1C1C1C', fontFamily: 'var(--font-heading)', fontSize: '1.7rem', fontWeight: '800' }}>
          Admin Portal
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '32px', color: '#767676', fontSize: '0.9rem' }}>
          Vishwa Bharti Higher Secondary School
        </p>

        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center', fontSize: '0.9rem', borderLeft: '3px solid #c62828' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '0.85rem', color: '#4A4A4A', letterSpacing: '0.3px' }}>
              USERNAME
            </label>
            <input
              type="text"
              required
              value={username}
              placeholder="Enter your username"
              onChange={e => setUsername(e.target.value)}
              style={{ width: '100%', padding: '13px 16px', borderRadius: '8px', border: '1.5px solid #E8E0D5', fontFamily: 'var(--font-body)', fontSize: '1rem', transition: 'all 0.2s', outline: 'none', marginBottom: 0 }}
              onFocus={e => { e.target.style.borderColor = '#E67E22'; e.target.style.boxShadow = '0 0 0 3px rgba(230,126,34,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#E8E0D5'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '0.85rem', color: '#4A4A4A', letterSpacing: '0.3px' }}>
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              placeholder="Enter your password"
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '13px 16px', borderRadius: '8px', border: '1.5px solid #E8E0D5', fontFamily: 'var(--font-body)', fontSize: '1rem', transition: 'all 0.2s', outline: 'none', marginBottom: 0 }}
              onFocus={e => { e.target.style.borderColor = '#E67E22'; e.target.style.boxShadow = '0 0 0 3px rgba(230,126,34,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#E8E0D5'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #E67E22, #C0392B)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(230,126,34,0.35)',
              transition: 'all 0.3s ease',
              letterSpacing: '0.4px',
            }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}
