import React, { useState } from "react";
import { apiLogin, apiRegister } from "../api";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../theme";

type Props = {
  mode: "login" | "register";
  onSuccess: () => void;
};

export default function AuthForms({ mode, onSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const { setAuth } = useAuth();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      if (mode === "login") {
        const res = await apiLogin(username, password);
        setAuth(res.token, res.user);
        setMsg("Login successful.");
      } else {
        const res = await apiRegister(username, password);
        setAuth(res.token, res.user);
        setMsg("Registration successful.");
      }
      onSuccess();
    } catch (e) {
      if (e instanceof Error) {
        setMsg(e.message);
      } else {
        setMsg("An error occurred.");
      }
    }
    setLoading(false);
  }

  return (
    <form className="flex flex-col gap-4 mb-3" onSubmit={submit}>
      <input
        className="rounded bg-[#181818] border border-[#333335] px-3 py-2 focus:outline-accent"
        placeholder="Username"
        minLength={3}
        value={username}
        autoComplete="username"
        required
        onChange={e => setUsername(e.target.value)}
      />
      <input
        className="rounded bg-[#181818] border border-[#333335] px-3 py-2 focus:outline-accent"
        placeholder="Password"
        type="password"
        minLength={4}
        autoComplete={mode === "register" ? "new-password" : "current-password"}
        value={password}
        required
        onChange={e => setPassword(e.target.value)}
      />
      <button
        disabled={loading}
        type="submit"
        style={{ background: COLORS.primary }}
        className="rounded text-white font-bold py-2 px-3 mt-2 hover:brightness-110 transition"
      >
        {loading ? "Please wait..." : (mode === "login" ? "Login" : "Register")}
      </button>
      {msg && <div className="text-sm mt-1 text-accent-400" style={{ color: COLORS.accent }}>{msg}</div>}
    </form>
  );
}
