import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGetUserGames } from "../api";
import Modal from "./Modal";
import { COLORS } from "../theme";

type Game = {
  id: string;
  result: string;
  opponent: string;
  createdAt?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

// PUBLIC_INTERFACE
export default function GameHistoryModal({ open, onClose }: Props) {
  const { user, token } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open || !user || !token) {
      setErr("");
      setGames([]);
      return;
    }
    setLoading(true);
    apiGetUserGames(user.username, token)
      .then(setGames)
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [open, user, token]);

  return (
    <Modal open={open} onClose={onClose} title="Game History" wide>
      {loading && <div>Loading...</div>}
      {err && <div style={{ color: COLORS.danger }}>{err}</div>}
      {!loading && !err && games.length === 0 && <div>No games found.</div>}
      {!loading && !err && games.length > 0 && (
        <table className="w-full text-xs border-separate" style={{ borderSpacing: "0 0.5rem" }}>
          <thead>
            <tr className="text-accent" style={{ color: COLORS.accent }}>
              <th>Date</th>
              <th>Opponent</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {games.map((g, idx) => (
              <tr key={g.id + idx} className="bg-[#181818]">
                <td className="p-2">
                  {g.createdAt
                    ? new Date(g.createdAt).toLocaleString()
                    : "-"}
                </td>
                <td className="p-2">{g.opponent || "AI"}</td>
                <td className="p-2 font-semibold">
                  <span style={{ color: getResultColor(g.result) }}>{g.result}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Modal>
  );
}

function getResultColor(result: string) {
  if (result?.toLowerCase().includes("win")) return COLORS.success;
  if (result?.toLowerCase().includes("lose")) return COLORS.danger;
  return COLORS.accent;
}
