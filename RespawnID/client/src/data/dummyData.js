const steamCover = (appId) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`;

const steamHeader = (appId) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;

/** Landscape thumb for list rows; falls back to vertical cover */
export function getGameThumb(game) {
  if (game.steamAppId) return steamHeader(game.steamAppId);
  return game.cover;
}

export const currentUser = {
  id: "u1",
  username: "ShadowNova",
  displayName: "Alex Chen",
  email: "alex@respawnid.dev",
  bio: "Competitive FPS main. Building the ultimate cross-platform library one trophy at a time.",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ShadowNova",
  banner: steamHeader(1245620),
  memberSince: "2024-03-12",
  level: 42,
  totalHours: 1247,
  achievementCount: 186,
  gamesOwned: 94,
  friendsCount: 28,
};

export const platforms = [
  { id: "steam", name: "Steam", connected: true, color: "#1b2838" },
  { id: "xbox", name: "Xbox", connected: true, color: "#107c10" },
  { id: "psn", name: "PlayStation", connected: false, color: "#003791" },
  { id: "epic", name: "Epic Games", connected: true, color: "#2f2f2f" },
  { id: "gog", name: "GOG", connected: false, color: "#86328a" },
];

export const games = [
  {
    id: "g1",
    title: "Elden Ring",
    steamAppId: 1245620,
    cover: steamCover(1245620),
    genre: "Action RPG",
    platform: ["Steam", "Xbox"],
    hoursPlayed: 142,
    lastPlayed: "2026-05-14",
    rating: 4.9,
    price: 39.99,
    onSale: false,
  },
  {
    id: "g2",
    title: "Hades II",
    steamAppId: 1145350,
    cover: steamCover(1145350),
    genre: "Roguelike",
    platform: ["Steam", "Epic"],
    hoursPlayed: 68,
    lastPlayed: "2026-05-13",
    rating: 4.8,
    price: 29.99,
    onSale: true,
    salePrice: 23.99,
  },
  {
    id: "g3",
    title: "Cyberpunk 2077",
    steamAppId: 1091500,
    cover: steamCover(1091500),
    genre: "RPG",
    platform: ["Steam", "Xbox", "Epic"],
    hoursPlayed: 210,
    lastPlayed: "2026-05-12",
    rating: 4.5,
    price: 59.99,
    onSale: true,
    salePrice: 29.99,
  },
  {
    id: "g4",
    title: "Baldur's Gate 3",
    steamAppId: 1086940,
    cover: steamCover(1086940),
    genre: "RPG",
    platform: ["Steam", "GOG"],
    hoursPlayed: 320,
    lastPlayed: "2026-05-10",
    rating: 5.0,
    price: 59.99,
    onSale: false,
  },
  {
    id: "g5",
    title: "Helldivers 2",
    steamAppId: 553850,
    cover: steamCover(553850),
    genre: "Co-op Shooter",
    platform: ["Steam", "PSN"],
    hoursPlayed: 95,
    lastPlayed: "2026-05-11",
    rating: 4.6,
    price: 39.99,
    onSale: false,
  },
  {
    id: "g6",
    title: "Hollow Knight",
    steamAppId: 367520,
    cover: steamCover(367520),
    genre: "Metroidvania",
    platform: ["Steam", "Xbox", "GOG"],
    hoursPlayed: 54,
    lastPlayed: "2026-04-28",
    rating: 4.9,
    price: 14.99,
    onSale: true,
    salePrice: 7.49,
  },
  {
    id: "g7",
    title: "Valorant",
    cover:
      "https://images.launchbox-app.com/22d94894-e433-4568-b2b0-f3221357c7d2.jpg",
    genre: "FPS",
    platform: ["Epic"],
    hoursPlayed: 412,
    lastPlayed: "2026-05-14",
    rating: 4.4,
    price: 0,
    onSale: false,
  },
  {
    id: "g8",
    title: "Stardew Valley",
    steamAppId: 413150,
    cover: steamCover(413150),
    genre: "Simulation",
    platform: ["Steam", "Xbox"],
    hoursPlayed: 88,
    lastPlayed: "2026-05-08",
    rating: 4.8,
    price: 14.99,
    onSale: false,
  },
];

export const recentGames = games
  .slice()
  .sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed))
  .slice(0, 4);

export const topGames = games
  .slice()
  .sort((a, b) => b.hoursPlayed - a.hoursPlayed)
  .slice(0, 5);

export const favoriteGameIds = ["g4", "g1", "g7"];

export const topGenres = [
  { name: "RPG", hours: 530, percent: 42 },
  { name: "FPS", hours: 412, percent: 33 },
  { name: "Roguelike", hours: 180, percent: 14 },
  { name: "Co-op", hours: 125, percent: 11 },
];

export const achievements = [
  {
    id: "a1",
    title: "Shardbearer",
    game: "Elden Ring",
    icon: "🏆",
    rarity: "Rare",
    unlockedAt: "2026-04-02",
  },
  {
    id: "a2",
    title: "Brain Trust",
    game: "Baldur's Gate 3",
    icon: "🧠",
    rarity: "Epic",
    unlockedAt: "2026-03-18",
  },
  {
    id: "a3",
    title: "Democracy Delivered",
    game: "Helldivers 2",
    icon: "🦅",
    rarity: "Uncommon",
    unlockedAt: "2026-05-01",
  },
  {
    id: "a4",
    title: "Night City Legend",
    game: "Cyberpunk 2077",
    icon: "🌃",
    rarity: "Epic",
    unlockedAt: "2026-02-22",
  },
  {
    id: "a5",
    title: "Radiant Victory",
    game: "Hades II",
    icon: "⚡",
    rarity: "Rare",
    unlockedAt: "2026-05-10",
  },
  {
    id: "a6",
    title: "Greenhorn",
    game: "Stardew Valley",
    icon: "🌾",
    rarity: "Common",
    unlockedAt: "2025-12-05",
  },
];

export const sales = [
  {
    id: "s1",
    title: "Steam Summer Preview",
    platform: "Steam",
    discount: "Up to 75% off",
    startsIn: "12 days",
    endsAt: "2026-06-26",
    featured: ["g2", "g3", "g6"],
  },
  {
    id: "s2",
    title: "Epic Weekly Freebie",
    platform: "Epic Games",
    discount: "Free — Hades II",
    startsIn: "Now live",
    endsAt: "2026-05-22",
    featured: ["g2"],
  },
  {
    id: "s3",
    title: "Xbox Deals Unlocked",
    platform: "Xbox",
    discount: "Up to 50% off",
    startsIn: "3 days",
    endsAt: "2026-05-28",
    featured: ["g5", "g8"],
  },
  {
    id: "s4",
    title: "GOG RPG Festival",
    platform: "GOG",
    discount: "Up to 60% off",
    startsIn: "5 days",
    endsAt: "2026-05-30",
    featured: ["g4", "g6"],
  },
];

export const weeklyActivity = [
  { day: "Mon", hours: 2.4 },
  { day: "Tue", hours: 1.8 },
  { day: "Wed", hours: 3.2 },
  { day: "Thu", hours: 0.9 },
  { day: "Fri", hours: 4.1 },
  { day: "Sat", hours: 5.6 },
  { day: "Sun", hours: 3.8 },
];

export const gamingStats = {
  avgSession: "1h 42m",
  longestStreak: 14,
  completionRate: 68,
  multiplayerRatio: 42,
};
