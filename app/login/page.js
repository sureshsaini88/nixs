"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "../../contexts/UserContext";
import styles from "./login.module.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { updateUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user token and data
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Update context immediately
        updateUser(data.user);
        
        // Store in localStorage if remember is checked
        if (remember) {
          localStorage.setItem('rememberedUser', username);
        }
        
        // Redirect to dashboard
        router.push('/dashboard');
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

          <h1 className={styles.title}>Hello!</h1>
          <p className={styles.subtitle}>
            WELCOME TO AGENCY ADS SYSTEM
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <div className={styles.rememberRow}>
              <input 
                type="checkbox" 
                id="remember" 
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="remember">Remember me</label>
            </div>

            {error && (
              <div style={{ color: 'red', fontSize: '14px', marginBottom: '10px', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
