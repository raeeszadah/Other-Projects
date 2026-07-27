function AuthShowcase() {
  return (
    <section
      aria-hidden="true"
      className="auth-showcase relative hidden overflow-hidden border-l border-white/5 lg:block"
    >
      <style>{`
        .auth-showcase .hero-glow {
          background:
            radial-gradient(circle at 50% 42%, rgba(255, 30, 60, 0.14), transparent 38%),
            linear-gradient(180deg, #0A0A0A 0%, #101010 50%, #0A0A0A 100%);
        }
      `}</style>

      <div className="hero-glow absolute inset-0" />
    </section>
  );
}

export default AuthShowcase;
