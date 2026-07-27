import { useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
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

  return (
    <div
      className="home-root min-h-screen overflow-x-hidden bg-[#0A0A0A] text-white"
      style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}
    >
      <style>{`
        .font-display {
          font-family: 'Orbitron', 'Rajdhani', 'Exo 2', sans-serif;
        }

        .scanlines::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 30, 60, 0.03) 2px,
            rgba(255, 30, 60, 0.03) 4px
          );
          opacity: 0.35;
        }

        @keyframes drift {
          0% { transform: translate(0, 0) scale(1); opacity: 0.35; }
          50% { transform: translate(18px, -24px) scale(1.08); opacity: 0.65; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.35; }
        }

        .particle { animation: drift 8s ease-in-out infinite; }

        .hero-glow {
          background:
            radial-gradient(circle at 20% 20%, rgba(255, 30, 60, 0.18), transparent 32%),
            radial-gradient(circle at 80% 10%, rgba(179, 0, 27, 0.22), transparent 28%),
            radial-gradient(circle at 50% 80%, rgba(255, 30, 60, 0.08), transparent 40%),
            linear-gradient(180deg, #0A0A0A 0%, #111111 45%, #0A0A0A 100%);
        }

        .red-text-glow {
          text-shadow: 0 0 24px rgba(255, 30, 60, 0.35);
        }

        .cta-primary {
          background: linear-gradient(135deg, #FF1E3C 0%, #B3001B 100%);
          box-shadow: 0 0 24px rgba(255, 30, 60, 0.35);
        }

        .cta-primary:hover {
          box-shadow: 0 0 36px rgba(255, 30, 60, 0.55);
          transform: translateY(-1px);
        }

        .cta-secondary:hover {
          border-color: rgba(255, 30, 60, 0.55);
          box-shadow: 0 0 20px rgba(255, 30, 60, 0.2);
        }
      `}</style>

      <main className="relative min-h-screen overflow-hidden">
        <section className="relative flex min-h-screen items-center justify-center">
          <div className="hero-glow scanlines absolute inset-0" />
          <div className="pointer-events-none absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="particle absolute h-1 w-1 rounded-full bg-[#FF1E3C]"
                style={{
                  top: `${8 + (i * 7) % 84}%`,
                  left: `${4 + (i * 11) % 92}%`,
                  animationDelay: `${i * 0.35}s`,
                  opacity: 0.35 + (i % 4) * 0.1,
                }}
              />
            ))}
          </div>

          <div className="relative mx-auto w-full max-w-3xl px-6 text-center">
            <p className="font-display mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#FF1E3C]/80">
              Respawn Your Identity
            </p>
            <h1 className="font-display red-text-glow text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Your Gaming Legacy. One Identity.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              Connect every platform, track every achievement, and build the gamer
              profile your grind deserves.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/signup"
                className="cta-primary rounded-full px-7 py-3 text-sm font-semibold transition"
              >
                Create Your RespawnID
              </Link>
              <Link
                to="/signin"
                className="cta-secondary rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition"
              >
                Respawn Back In
              </Link>
            </div>

            <p className="mt-4 text-sm text-white/45">
              No more scattered stats. No more forgotten achievements.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
