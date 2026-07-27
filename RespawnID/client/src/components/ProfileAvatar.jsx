function ProfileAvatar({ name, avatar, size = "lg" }) {
  const sizeClasses =
    size === "lg"
      ? "-mt-12 h-20 w-20 sm:h-24 sm:w-24"
      : "h-12 w-12";

  const iconSize = size === "lg" ? "h-10 w-10 sm:h-12 sm:w-12" : "h-6 w-6";

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name ? `${name}'s avatar` : "Profile avatar"}
        className={`${sizeClasses} shrink-0 rounded-2xl border-4 border-[#151515] object-cover shadow-[0_0_24px_rgba(255,30,60,0.35)]`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} flex shrink-0 items-center justify-center rounded-2xl border-4 border-[#151515] bg-gradient-to-br from-[#FF1E3C] to-[#B3001B] shadow-[0_0_24px_rgba(255,30,60,0.35)]`}
      role="img"
      aria-label={name ? `${name}'s avatar` : "Profile avatar"}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className={`${iconSize} text-white`}
        aria-hidden
      >
        <path
          d="M6 11h12v2a6 6 0 0 1-12 0v-2Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8 11V8a2 2 0 0 1 2-2h1V5a1 1 0 0 1 2 0v1h1a2 2 0 0 1 2 2v3" strokeLinecap="round" />
        <circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
        <path d="M4 17h16" strokeLinecap="round" opacity="0.5" />
      </svg>
    </div>
  );
}

export default ProfileAvatar;
