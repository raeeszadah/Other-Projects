import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthShowcase from "../components/AuthShowcase";
import api from "../utils/api";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = "respawnid-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", data.token);
      if (data.user?.id) {
        localStorage.setItem("userId", data.user.id);
      }

      toast.success(data.message || "User registered");
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.response?.status === 403
          ? "The API returned 403. On macOS, port 5000 is often used by AirPlay. Start the backend on port 5001 and restart the Vite dev server."
          : error.request
            ? "Unable to reach the server. Start the backend on port 5001, then restart the Vite dev server."
            : "Something went wrong");

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-root min-h-screen overflow-x-hidden bg-[#0A0A0A] text-white"
      style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}
    >
      <style>{`
        .font-display {
          font-family: 'Orbitron', 'Rajdhani', 'Exo 2', sans-serif;
        }

        .auth-input {
          background: rgba(21, 21, 21, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .auth-input:focus {
          outline: none;
          border-color: rgba(255, 30, 60, 0.45);
          box-shadow: 0 0 0 3px rgba(255, 30, 60, 0.12);
        }

        .cta-primary {
          background: linear-gradient(135deg, #FF1E3C 0%, #B3001B 100%);
          box-shadow: 0 0 24px rgba(255, 30, 60, 0.35);
        }

        .cta-primary:hover:not(:disabled) {
          box-shadow: 0 0 36px rgba(255, 30, 60, 0.55);
          transform: translateY(-1px);
        }

        .cta-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

      `}</style>

      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="font-display inline-block text-sm font-bold tracking-[0.22em] text-[#FF1E3C]"
            >
              RESPAWN<span className="text-white">ID</span>
            </Link>

            <p className="font-display mt-8 text-xs font-semibold uppercase tracking-[0.35em] text-[#FF1E3C]/80">
              Create Account
            </p>
            <h1 className="font-display mt-3 text-3xl font-bold text-white sm:text-4xl">
              Build Your RespawnID
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Sign up to connect your platforms and start building one legend
              profile.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="auth-input w-full rounded-2xl px-4 py-3 text-sm text-white"
                  placeholder="NightShiftNyx"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="auth-input w-full rounded-2xl px-4 py-3 text-sm text-white"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-input w-full rounded-2xl px-4 py-3 text-sm text-white"
                  placeholder="Create a strong password"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="auth-input w-full rounded-2xl px-4 py-3 text-sm text-white"
                  placeholder="Repeat your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cta-primary mt-2 w-full rounded-full px-7 py-3 text-sm font-semibold transition"
              >
                {loading ? "Creating RespawnID..." : "Create Your RespawnID"}
              </button>
            </form>

            <p className="mt-6 text-sm text-white/50">
              Already have an account?{" "}
              <Link to="/signin" className="text-[#FF1E3C] transition hover:text-white">
                Sign in
              </Link>
            </p>
          </div>
        </section>

        <AuthShowcase />
      </div>
    </div>
  );
}

export default Signup;
