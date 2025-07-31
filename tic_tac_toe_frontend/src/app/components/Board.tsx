import React from "react";
import { SQUARE_SIZE, COLORS } from "../theme";

type BoardProps = {
  board: ("X" | "O" | null)[][];
  onMove: (i: number, j: number) => void;
  disabled?: boolean;
  winnerLine?: [number, number][];
};

export default function Board({ board, onMove, disabled, winnerLine }: BoardProps) {
  function isWinner(i: number, j: number) {
    return winnerLine?.some(([wi, wj]) => wi === i && wj === j);
  }
  return (
    <div
      className="grid"
      style={{
        gridTemplateRows: `repeat(3, ${SQUARE_SIZE}px)`,
        gridTemplateColumns: `repeat(3, ${SQUARE_SIZE}px)`,
        background: COLORS.surface,
        gap: 2,
        borderRadius: 18,
        border: `2.5px solid ${COLORS.primary}`,
        boxShadow: "0 0 16px #2229"
      }}
    >
      {board.map((row, i) =>
        row.map((val, j) => (
          <button
            key={i * 10 + j}
            className="bg-[#181818] flex items-center justify-center text-4xl font-bold"
            style={{
              width: SQUARE_SIZE,
              height: SQUARE_SIZE,
              cursor: val || disabled ? "not-allowed" : "pointer",
              border:
                isWinner(i, j)
                  ? `3.5px solid ${COLORS.accent}`
                  : "1px solid #444",
              color: val === "X" ? COLORS.primary : (val === "O" ? COLORS.accent : "#ccc"),
              borderRadius: 10,
              boxShadow: isWinner(i, j) ? `0 0 10px 2px ${COLORS.accent}77` : ""
            }}
            onClick={() => !val && !disabled && onMove(i, j)}
            tabIndex={val || disabled ? -1 : 0}
            aria-label={`cell-${i}-${j}`}
          >
            {val}
          </button>
        ))
      )}
    </div>
  );
}
