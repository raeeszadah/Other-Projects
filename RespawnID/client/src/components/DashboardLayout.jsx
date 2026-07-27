import { Outlet, useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";
import useFonts from "../hooks/useFonts";
import { clearUserStorage } from "../utils/profileUtils";

function DashboardLayout() {
  useFonts();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUserStorage();
    navigate("/");
  };

  return (
    <div
      className="app-shell min-h-screen bg-[#0A0A0A] pb-28 text-white"
      style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}
    >
      <style>{`
        .font-display {
          font-family: 'Orbitron', 'Rajdhani', 'Exo 2', sans-serif;
        }
        .glass-card {
          background: rgba(21, 21, 21, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.07);
        }
        .bottom-nav::before {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(255, 30, 60, 0.12), transparent 70%);
          z-index: -1;
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <p className="font-display text-sm font-bold tracking-[0.22em] text-[#FF1E3C]">
            RESPAWN<span className="text-white">ID</span>
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60 transition hover:border-[#FF1E3C]/40 hover:text-[#FF1E3C]"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}

export default DashboardLayout;
