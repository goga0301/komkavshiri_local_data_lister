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

}
