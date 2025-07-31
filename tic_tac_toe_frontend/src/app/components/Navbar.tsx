import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";
import AuthForms from "./AuthForms";
import GameHistoryModal from "./GameHistoryModal";
import { COLORS } from "../theme";

/** Top Navbar: Logo, Login, Register, User info/logout, Game History */
export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [modal, setModal] = useState<"login" | "register" | "history" | null>(null);

  return (
    <>
      <nav className="flex items-center justify-between py-3 px-4 shadow mb-4 bg-[#232323]">
        <div className="text-[22px] font-bold tracking-wide" style={{ color: COLORS.primary }}>
          <span className="mr-2">⭕</span>Tic Tac Toe
        </div>
        <div className="flex space-x-2 items-center">
          {loading ? (
            <div className="text-secondary">...</div>
          ) : user ? (
            <>
              <button
                className="rounded bg-[#252f44] text-white px-3 py-1 text-sm mr-2 border border-transparent hover:border-accent"
                onClick={() => setModal("history")}
                style={{ color: COLORS.accent }}
              >
                Game History
              </button>
              <div className="mr-3 text-accent-400" style={{ color: COLORS.accent, fontWeight: 600 }}>
                {user.username}
                <span className="ml-2 text-[#ebebeb] text-xs bg-[#323232] py-[2px] px-2 rounded">
                  Score: {user.score}
                </span>
              </div>
              <button
                className="rounded bg-danger text-white px-3 py-1 text-sm"
                style={{ background: COLORS.danger }}
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="rounded bg-primary text-white px-3 py-1 text-sm"
                style={{ background: COLORS.primary }}
                onClick={() => setModal("login")}
              >
                Login
              </button>
              <button
                className="rounded bg-accent text-black px-3 py-1 text-sm"
                style={{ background: COLORS.accent, marginLeft: 8 }}
                onClick={() => setModal("register")}
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>
      <Modal
        open={modal === "login"}
        onClose={() => setModal(null)}
        title="Login"
      >
        <AuthForms mode="login" onSuccess={() => setModal(null)} />
        <div className="text-sm mt-1">
          No account?{" "}
          <button className="underline text-accent" style={{ color: COLORS.accent }}
            onClick={() => setModal("register")}
          >Register</button>
        </div>
      </Modal>
      <Modal
        open={modal === "register"}
        onClose={() => setModal(null)}
        title="Register"
      >
        <AuthForms mode="register" onSuccess={() => setModal(null)} />
        <div className="text-sm mt-1">
          Already have an account?{" "}
          <button className="underline text-accent"
            style={{ color: COLORS.accent }}
            onClick={() => setModal("login")}
          >Login</button>
        </div>
      </Modal>
      <GameHistoryModal open={modal === "history"} onClose={() => setModal(null)} />
    </>
  );
}
