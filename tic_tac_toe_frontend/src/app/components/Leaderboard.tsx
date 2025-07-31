import React, { useEffect, useState } from "react";
import { apiGetLeaderboard } from "../api";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../theme";

type Entry = {
  username: string;
  score: number;
  rank?: number;
};

function ordinal(n: number) {
  if (n > 10 && n < 20) return `${n}th`;
  if (n % 10 === 1) return `${n}st`;
  if (n % 10 === 2) return `${n}nd`;
  if (n % 10 === 3) return `${n}rd`;
  return `${n}th`;
}

// PUBLIC_INTERFACE
export default function Leaderboard() {
  const [leaders, setLeaders] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    apiGetLeaderboard()
      .then(data => {
        setLeaders(data?.map((e: Entry, idx: number) => ({ ...e, rank: idx + 1 })) || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <aside className="bg-[#232323] rounded-lg shadow-lg py-4 px-3 w-[235px] min-h-[280px] mr-2 mt-1">
      <div className="font-bold text-accent text-lg mb-3 text-center" style={{ color: COLORS.accent }}>
        Leaderboard
      </div>
      {loading && <div>Loading...</div>}
      {!loading && (
        <ol>
          {leaders.slice(0, 7).map((entry) => (
            <li key={entry.username} className={`flex items-center justify-between px-2 py-1 rounded mb-[2px] ${
              user && user.username === entry.username ? "bg-[#003363]" : ""
            }`}>
              <span className={`font-mono w-6 inline-block text-accent-400`} style={{ color: COLORS.accent }}>
                {ordinal(entry.rank || 0)}
              </span>
              <span className="flex-1 pl-2 truncate">{entry.username}</span>
              <span className="font-bold ml-2" style={{ color: COLORS.primary }}>{entry.score}</span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
