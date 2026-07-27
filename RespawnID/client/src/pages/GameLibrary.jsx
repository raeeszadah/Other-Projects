import { useMemo, useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useGames } from "../context/GamesContext";
import GameCard from "../components/GameCard";

const SORT_OPTIONS = [
  { value: "title", label: "Title A–Z" },
  { value: "hours", label: "Most Played" },
  { value: "recent", label: "Recently Played" },
  { value: "genre", label: "Genre A–Z" },
];

function GameLibrary() {
  const { favorites, refreshFavorites } = useFavorites();
  const { games, loading, syncing, syncSteam } = useGames();
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [sort, setSort] = useState("title");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const genres = useMemo(
    () => ["all", ...new Set(games.map((g) => g.genre).filter(Boolean))],
    [games]
  );
  const platformList = useMemo(
    () => ["all", ...new Set(games.flatMap((g) => g.platform))],
    [games]
  );

  const filtered = useMemo(() => {
    let list = [...games];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((g) => g.title.toLowerCase().includes(q));
    }
    if (genre !== "all") list = list.filter((g) => g.genre === genre);
    if (platform !== "all") list = list.filter((g) => g.platform.includes(platform));
    if (showFavoritesOnly) {
      list = list.filter((g) => favorites.includes(g._id || g.id));
    }

    switch (sort) {
      case "hours":
        list.sort((a, b) => b.hoursPlayed - a.hoursPlayed);
        break;
      case "recent":
        list.sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed));
        break;
      case "genre":
        list.sort((a, b) => a.genre.localeCompare(b.genre));
        break;
      default:
        list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [search, genre, platform, sort, showFavoritesOnly, favorites, games]);

  if (loading) {
    return <p className="text-center text-sm text-white/50 py-12">Loading library...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Game Library</h1>
          <p className="mt-1 text-sm text-white/50">
            {filtered.length} of {games.length} games in your synced library
          </p>
        </div>
        <button
          type="button"
          onClick={async () => {
            try {
              await syncSteam();
              await refreshFavorites();
            } catch {
              // handled in context
            }
          }}
          disabled={syncing}
          className="rounded-full bg-gradient-to-r from-[#FF1E3C] to-[#B3001B] px-5 py-2 text-xs font-semibold disabled:opacity-70"
        >
          {syncing ? "Syncing Steam..." : "Sync Steam"}
        </button>
      </div>

      <div className="glass-card space-y-3 rounded-2xl p-4">
        <input
          type="search"
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm placeholder:text-white/30"
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs"
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g === "all" ? "All Genres" : g}
              </option>
            ))}
          </select>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs"
          >
            {platformList.map((p) => (
              <option key={p} value={p}>
                {p === "all" ? "All Platforms" : p}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowFavoritesOnly((v) => !v)}
            className={`rounded-lg px-3 py-2 text-xs font-semibold ${
              showFavoritesOnly
                ? "bg-[#FF1E3C] text-white"
                : "border border-white/10 text-white/60"
            }`}
          >
            Favorites
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-white/45">
            {games.length === 0
              ? "No games yet. Connect Steam on your profile and sync your library."
              : "No games match your filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((game) => (
            <GameCard key={game.id} game={game} owned />
          ))}
        </div>
      )}
    </div>
  );
}

export default GameLibrary;
