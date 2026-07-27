const defaultAvatar = (seed) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

const defaultBanner =
  "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg";

export function mapUserToProfile(user) {
  if (!user) return null;

  const followers = user.followers || [];
  const following = user.following || [];

  return {
    id: user._id,
    _id: user._id,
    username: user.username || "",
    displayName: user.username || "",
    email: user.email || "",
    bio: user.bio || "",
    avatar: user.avatar || defaultAvatar(user.username || "player"),
    banner: user.banner || defaultBanner,
    steamId: user.steamId || "",
    favoriteGenres: user.favoriteGenres || [],
    favoriteGameIds: (user.favoriteGames || []).map((g) =>
      typeof g === "object" ? g._id : g?.toString?.() || String(g)
    ),
    followers,
    following,
    followerCount: followers.length,
    followingCount: following.length,
    memberSince: user.createdAt,
    gamesOwned: 0,
    totalHours: 0,
    achievementCount: 0,
    level: 1,
  };
}

export function clearUserStorage() {
  const userId = localStorage.getItem("userId");
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  if (userId) {
    localStorage.removeItem(`gameCache_${userId}`);
  }
}
