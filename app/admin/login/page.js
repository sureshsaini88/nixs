"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../login/login.module.css";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store admin token
        localStorage.setItem('adminToken', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>

      {/* LEFT SIDE */}
      <div className={styles.left}>
        <Image
          src="/banner.png"
          alt="Banner"
          fill
          priority
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.right}>

        <div className={styles.content}>

          <Image
            src="/IMG_0907.png"
            alt="Product Logo"
            width={190}
            height={190}
            className={styles.logo}
          />

          <h1 className={styles.title}>Admin Login</h1>
          <p className={styles.subtitle}>
            AGENCY ADMIN PANEL
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Admin Username"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Admin Password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div style={{ color: 'red', fontSize: '14px', marginBottom: '10px', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Signing in...' : 'Admin Sign in'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link href="/login" style={{ color: '#0eab79', textDecoration: 'none' }}>
              ← Back to User Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
