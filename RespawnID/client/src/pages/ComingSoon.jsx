import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ComingSoon() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/signin", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-6 text-white"
      style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}
    >
      <p className="text-xs uppercase tracking-[0.35em] text-[#FF1E3C]/80">
        RespawnID
      </p>
      <h1 className="mt-4 text-3xl font-bold">Coming Soon</h1>
      <button
        type="button"
        onClick={handleLogout}
        className="mt-8 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold transition hover:border-[#FF1E3C]/55 hover:text-[#FF1E3C]"
      >
        Logout
      </button>
    </div>
  );
}

export default ComingSoon;
