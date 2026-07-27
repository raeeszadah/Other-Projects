import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";
import { fetchMyGames } from "../services/userApi";
import { syncSteamGames } from "../services/steamApi";
import { cacheGames, normalizeGame } from "../utils/gameUtils";

const GamesContext = createContext(null);

export function GamesProvider({ children }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const userId = localStorage.getItem("userId");

  const mergeGames = useCallback((sources) => {
    const map = new Map();
    sources.flat().forEach((game) => {
      const normalized = normalizeGame(game);
      if (normalized?.id) map.set(normalized.id, normalized);
    });
    return [...map.values()];
  }, []);

  const applyLibrary = useCallback(
    (libraryGames) => {
      const merged = mergeGames([libraryGames]);
      setGames(merged);
      if (userId) cacheGames(userId, merged);
      const totalHours = merged.reduce((sum, g) => sum + (g.hoursPlayed || 0), 0);
      return { games: merged, totalHours, count: merged.length };
    },
    [mergeGames, userId]
  );

  const refreshLibrary = useCallback(async () => {
    try {
      const libraryGames = await fetchMyGames();
      return applyLibrary(libraryGames);
    } catch {
      return applyLibrary([]);
    }
  }, [applyLibrary]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        await refreshLibrary();
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [refreshLibrary]);

  const syncSteam = async () => {
    setSyncing(true);
    try {
      const result = await syncSteamGames();
      setLastSync(result);

      if (result.games?.length) {
        const { games: library, totalHours, count } = applyLibrary(result.games);
        toast.success(
          result.message ||
            `Steam sync complete — ${result.totalGames ?? count} games`
        );
        return { result, games: library, totalHours, count };
      }

      const { games: library, totalHours, count } = await refreshLibrary();
      toast.success(
        result.totalGames > 0
          ? `Synced ${result.totalGames} games`
          : result.message || "Steam sync complete"
      );
      return { result, games: library, totalHours, count };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Steam sync failed";
      toast.error(message);
      throw error;
    } finally {
      setSyncing(false);
    }
  };

  const registerGames = useCallback(
    (incoming) => {
      if (!incoming?.length) return;
      setGames((prev) => {
        const merged = mergeGames([prev, incoming]);
        if (userId) cacheGames(userId, merged);
        return merged;
      });
    },
    [mergeGames, userId]
  );

  const recentGames = useMemo(
    () =>
      [...games]
        .sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed))
        .slice(0, 4),
    [games]
  );

  const topGames = useMemo(
    () =>
      [...games]
        .sort((a, b) => (b.hoursPlayed || 0) - (a.hoursPlayed || 0))
        .slice(0, 5),
    [games]
  );

  const stats = useMemo(
    () => ({
      gamesOwned: games.length,
      totalHours: Math.round(
        games.reduce((sum, g) => sum + (g.hoursPlayed || 0), 0)
      ),
    }),
    [games]
  );

  const value = useMemo(
    () => ({
      games,
      loading,
      syncing,
      lastSync,
      recentGames,
      topGames,
      stats,
      refreshLibrary,
      syncSteam,
      registerGames,
    }),
    [
      games,
      loading,
      syncing,
      lastSync,
      recentGames,
      topGames,
      stats,
      refreshLibrary,
      registerGames,
    ]
  );

  return (
    <GamesContext.Provider value={value}>{children}</GamesContext.Provider>
  );
}

export function useGames() {
  const ctx = useContext(GamesContext);
  if (!ctx) throw new Error("useGames must be used within GamesProvider");
  return ctx;
}
