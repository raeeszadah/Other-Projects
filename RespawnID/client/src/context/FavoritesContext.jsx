import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";
import {
  addFavoriteGame,
  fetchFavoriteGames,
  fetchMyProfile,
  removeFavoriteGame,
} from "../services/userApi";
import { cacheGames, getGameId, normalizeGame } from "../utils/gameUtils";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  const refreshFavorites = useCallback(async () => {
    try {
      const games = await fetchFavoriteGames();
      const normalized = games.map(normalizeGame).filter(Boolean);
      setFavoriteGames(normalized);
      setFavoriteIds(normalized.map((g) => getGameId(g)));
      if (userId) cacheGames(userId, normalized);
      return normalized;
    } catch {
      try {
        const profile = await fetchMyProfile();
        const ids = (profile.favoriteGames || []).map((g) =>
          typeof g === "object" ? getGameId(g) : g?.toString?.()
        );
        setFavoriteIds(ids.filter(Boolean));
      } catch {
        setFavoriteIds([]);
        setFavoriteGames([]);
      }
      return [];
    }
  }, [userId]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        await refreshFavorites();
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [refreshFavorites]);

  const isFavorite = useCallback(
    (gameId) => favoriteIds.includes(gameId),
    [favoriteIds]
  );

  const toggleFavorite = async (game) => {
    const gameId = typeof game === "string" ? game : getGameId(game);
    if (!gameId) return;

    const wasFavorite = favoriteIds.includes(gameId);

    try {
      if (wasFavorite) {
        await removeFavoriteGame(gameId);
        setFavoriteIds((prev) => prev.filter((id) => id !== gameId));
        setFavoriteGames((prev) => prev.filter((g) => getGameId(g) !== gameId));
        toast.success("Removed from favorites");
      } else {
        await addFavoriteGame(gameId);
        setFavoriteIds((prev) => [...prev, gameId]);
        if (typeof game === "object") {
          const normalized = normalizeGame(game);
          setFavoriteGames((prev) => [...prev, normalized]);
          if (userId) cacheGames(userId, [normalized]);
        }
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update favorites"
      );
    }
  };

  const value = useMemo(
    () => ({
      favorites: favoriteIds,
      favoriteGames,
      loading,
      isFavorite,
      toggleFavorite,
      refreshFavorites,
    }),
    [favoriteIds, favoriteGames, loading, isFavorite, toggleFavorite, refreshFavorites]
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
