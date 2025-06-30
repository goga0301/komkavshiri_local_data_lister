import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AuthPanel.css";

function AuthPanel({ onLoginSuccess }: { onLoginSuccess: (user: { username: string; token: string }) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("rememberedUser");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUsername(parsed.username || "");
        setRememberMe(true);
      } catch {}
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", { username, password });
      if (rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify({ username }));
      } else {
        localStorage.removeItem("rememberedUser");
      }
      setHistory((prev) => [...prev, `Login at ${new Date().toLocaleString()}`]);
      onLoginSuccess({ username, token: res.data.token });
    } catch (err: any) {
      setError("Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h1>Local Data Lister Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe((prev) => !prev)}
            />
            Remember me
          </label>
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          {error && <div className="auth-error">{error}</div>}
        </form>
        <div className="auth-meta">
          <h4>Session Log</h4>
          <ul>{history.map((entry, i) => <li key={i}>{entry}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

export default AuthPanel;
