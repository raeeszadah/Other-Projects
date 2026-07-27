const steamCover = (appId) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`;

export function normalizeGame(game) {
  if (!game) return null;

  const platforms = game.platforms || game.platform || ["Steam"];
  const gameDoc = game.gameId && typeof game.gameId === "object" ? game.gameId : game;
  const id = gameDoc._id || game._id || game.id;
  const steamAppId = gameDoc.steamAppId ?? game.steamAppId;
  const genres = gameDoc.genres || game.genres || [];

  return {
    id,
    _id: id,
    title: gameDoc.title || game.title || "Unknown Game",
    steamAppId,
    cover:
      game.cover ||
      game.coverImage ||
      (steamAppId ? steamCover(steamAppId) : ""),
    genre: game.genre || genres[0] || "Unknown",
    genres,
    platform: Array.isArray(platforms)
      ? platforms
      : game.platform
        ? [game.platform]
        : ["Steam"],
    hoursPlayed: game.hoursPlayed ?? 0,
    lastPlayed: game.lastPlayed || game.updatedAt || new Date().toISOString(),
    price: game.price ?? 0,
    onSale: game.onSale ?? false,
    salePrice: game.salePrice,
  };
}

export function getGameId(game) {
  return game?._id || game?.id;
}

export function cacheGames(userId, games) {
  if (!userId || !games?.length) return;
  const key = `gameCache_${userId}`;
  const existing = loadCachedGames(userId);
  const map = new Map(existing.map((g) => [getGameId(g), g]));
  games.forEach((g) => {
    const normalized = normalizeGame(g);
    if (normalized?.id) map.set(normalized.id, normalized);
  });
  localStorage.setItem(key, JSON.stringify([...map.values()]));
}

export function loadCachedGames(userId) {
  if (!userId) return [];
  try {
    const stored = localStorage.getItem(`gameCache_${userId}`);
    if (!stored) return [];
    return JSON.parse(stored).map(normalizeGame).filter(Boolean);
  } catch {
    return [];
  }
}

export function clearGameCache(userId) {
  if (userId) localStorage.removeItem(`gameCache_${userId}`);
}
