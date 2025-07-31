"use client";

import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Leaderboard from "./components/Leaderboard";
import Board from "./components/Board";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { apiStartGame, apiGetGame, apiMove, GameData } from "./api";
import { COLORS, BOARD_SIZE } from "./theme";

/**
 * Home page: Main entry point and game play
 */
function TicTacToeContainer() {
  const { user, token } = useAuth();
  const [game, setGame] = useState<GameData | null>(null);
  const [moveLoading, setMoveLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Poll for game state if the game is active
  useEffect(() => {
    if (!game?.id || !game.active) return;
    const interval = setInterval(() => {
      apiGetGame(game.id, token || undefined)
        .then(newGame => setGame(newGame))
        .catch(() => {});
    }, 2000);
    return () => clearInterval(interval);
  }, [game?.id, game?.active, token]);

  async function startGame(vsAI: boolean = false) {
    setError("");
    try {
      const g = await apiStartGame(token || "", vsAI);
      setGame(g);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to start game.");
      }
    }
  }

  async function makeMove(i: number, j: number) {
    if (!user || !game || moveLoading) return;
    setMoveLoading(true);
    setError("");
    try {
      const updated = await apiMove(token as string, game.id, i, j);
      setGame(updated);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to make move.");
      }
    }
    setMoveLoading(false);
  }

  // Derive player symbol
  function getPlayerSymbol(): "X" | "O" {
    if (!user || !game) return "X";
    return game.playerSymbol === "O" ? "O" : "X";
  }

  function restartGame() {
    setGame(null);
    setError("");
  }

  // Board setup
  const canPlay = !!user && !!game?.active && !game.winner && !moveLoading;
  const winnerLine = game?.winnerLine ?? null;

  return (
    <div className="min-h-screen bg-[#181818]">
      <Navbar />
      <div
        className="flex max-w-5xl mx-auto w-full"
        style={{ minHeight: "600px" }}
      >
        {/* Left sidebar: leaderboard */}
        <Leaderboard />
        {/* Main game area */}
        <main className="flex-1 flex flex-col items-center py-4">
          {!user && (
            <div className="mt-24 text-lg text-accent" style={{ color: COLORS.accent }}>
              Please login or register to play Tic Tac Toe.
            </div>
          )}
          {user && !game && (
            <div className="flex flex-col items-center mt-7">
              <button
                className="rounded bg-primary text-white px-5 py-2 font-bold mb-4"
                style={{ background: COLORS.primary }}
                onClick={() => startGame(false)}
              >
                New Game (vs Human)
              </button>
              <button
                className="rounded bg-accent text-black px-5 py-2 font-bold"
                style={{ background: COLORS.accent }}
                onClick={() => startGame(true)}
              >
                New Game (vs Computer)
              </button>
            </div>
          )}
          {user && game && (
            <div className="flex flex-col items-center justify-center mt-1">
              <div className="mb-2 flex gap-3 items-center">
                <span className="text-base text-[#7ebcf7] bg-[#232f40] px-3 py-1 rounded">
                  Game ID: {game.id}
                </span>
                {game.winner && (
                  <span className="text-lg font-bold" style={{ color: COLORS.accent }}>
                    {game.winner === getPlayerSymbol()
                      ? "You Won!"
                      : game.winner === "Tie"
                        ? "It's a Tie!"
                        : game.winner === null
                          ? ""
                          : "You Lose"}
                  </span>
                )}
              </div>
              <div
                style={{
                  minWidth: BOARD_SIZE,
                  minHeight: BOARD_SIZE,
                  marginBottom: 16
                }}
              >
                <Board
                  board={game.board}
                  onMove={makeMove}
                  disabled={!canPlay}
                  winnerLine={winnerLine ?? undefined}
                />
              </div>
              <div className="flex gap-6 mt-2">
                {game.winner && (
                  <button
                    className="rounded bg-primary text-white px-4 py-2 font-bold"
                    style={{ background: COLORS.primary }}
                    onClick={restartGame}
                  >
                    New Game
                  </button>
                )}
                {!game.winner && (
                  <div
                    className="text-primary text-lg font-mono flex items-center"
                    style={{
                      color: COLORS.primary,
                      opacity: canPlay ? 1 : 0.6
                    }}
                  >
                    Your move: <b className="mx-2">{getPlayerSymbol()}</b>
                  </div>
                )}
              </div>
              {error && (
                <div className="mt-2 text-danger" style={{ color: COLORS.danger }}>
                  {error}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Root injects provider for the page
export default function PageRoot() {
  return (
    <AuthProvider>
      <TicTacToeContainer />
    </AuthProvider>
  );
}
