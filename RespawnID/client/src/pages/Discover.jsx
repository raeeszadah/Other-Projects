import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useProfile } from "../context/ProfileContext";
import {
  fetchDiscoverUsers,
  followUser,
  searchUsers,
  unfollowUser,
} from "../services/userApi";
import ProfileAvatar from "../components/ProfileAvatar";

function UserCard({ user, isFollowing, loading, onToggle }) {
  return (
    <article className="glass-card flex items-center gap-3 rounded-2xl p-4">
      <Link to={`/profile/${user.username}`} className="shrink-0">
        <ProfileAvatar name={user.username} avatar={user.avatar} size="sm" />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          to={`/profile/${user.username}`}
          className="truncate text-sm font-semibold hover:text-[#FF1E3C]"
        >
          @{user.username}
        </Link>
        {user.bio && (
          <p className="mt-0.5 line-clamp-2 text-xs text-white/45">{user.bio}</p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-white/35">
          {typeof user.followerCount === "number" && (
            <span>{user.followerCount} followers</span>
          )}
          <span className="truncate font-mono">ID: {user._id}</span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-2">
        <button
          type="button"
          onClick={() => onToggle(user._id)}
          disabled={loading}
          className={`rounded-full px-4 py-2 text-xs font-semibold disabled:opacity-60 ${
            isFollowing
              ? "border border-white/20 bg-white/5 text-white/70"
              : "bg-gradient-to-r from-[#FF1E3C] to-[#B3001B] text-white"
          }`}
        >
          {loading ? "..." : isFollowing ? "Following" : "Follow"}
        </button>
        <Link
          to={`/messages/${user._id}`}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-xs font-semibold text-white/60 transition hover:border-[#FF1E3C]/40 hover:text-white"
        >
          Message
        </Link>
      </div>
    </article>
  );
}

function Discover() {
  const { profile, refreshProfile } = useProfile();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [followingIds, setFollowingIds] = useState(new Set());
  const [loadingSuggested, setLoadingSuggested] = useState(true);
  const [searching, setSearching] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const myId = profile?.id?.toString();
  const isSearching = query.trim().length >= 2;

  useEffect(() => {
    const ids = new Set(
      (profile.following || []).map((id) => id.toString?.() || String(id))
    );
    setFollowingIds(ids);
  }, [profile.following]);

  const loadSuggested = useCallback(async () => {
    setLoadingSuggested(true);
    try {
      const users = await fetchDiscoverUsers();
      setSuggested(users);
    } catch {
      toast.error("Failed to load suggested users");
    } finally {
      setLoadingSuggested(false);
    }
  }, []);

  useEffect(() => {
    loadSuggested();
  }, [loadSuggested]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const users = await searchUsers(trimmed);
        setResults(users);
      } catch {
        toast.error("Search failed");
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleFollowToggle = async (userId) => {
    const id = userId.toString();
    const isFollowing = followingIds.has(id);

    setActionLoading(id);
    try {
      if (isFollowing) {
        await unfollowUser(id);
        setFollowingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        toast.success("Unfollowed");
      } else {
        await followUser(id);
        setFollowingIds((prev) => new Set(prev).add(id));
        setSuggested((prev) => prev.filter((u) => u._id.toString() !== id));
        toast.success("Following");
      }
      await refreshProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const displayUsers = isSearching ? results : suggested;
  const showEmptySearch = isSearching && !searching && results.length === 0;

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-3xl p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#FF1E3C]/80">
          Discover
        </p>
        <h1 className="font-display mt-2 text-2xl font-bold sm:text-3xl">
          Find players
        </h1>
        <p className="mt-2 max-w-lg text-sm text-white/55">
          Search by user ID or username, follow players, and start a conversation.
        </p>

        <div className="relative mt-5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search user ID or username..."
            className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/35 outline-none focus:border-[#FF1E3C]/40"
          />
          {searching && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/35">
              Searching...
            </span>
          )}
        </div>

        {myId && (
          <p className="mt-3 font-mono text-[10px] text-white/30">
            Your ID: {myId}
          </p>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">
            {isSearching ? "Search results" : "Suggested for you"}
          </h2>
          {!isSearching && (
            <button
              type="button"
              onClick={loadSuggested}
              disabled={loadingSuggested}
              className="text-xs text-[#FF1E3C] hover:text-white disabled:opacity-50"
            >
              Refresh
            </button>
          )}
        </div>

        {loadingSuggested && !isSearching ? (
          <p className="text-center text-sm text-white/40 py-12">
            Loading players...
          </p>
        ) : showEmptySearch ? (
          <div className="glass-card rounded-2xl py-12 text-center">
            <p className="text-sm text-white/50">No users found</p>
            <p className="mt-1 text-xs text-white/35">
              Try a full 24-character user ID or a different username
            </p>
          </div>
        ) : displayUsers.length === 0 ? (
          <div className="glass-card rounded-2xl py-12 text-center">
            <p className="text-sm text-white/50">
              {isSearching
                ? "Type at least 2 characters to search"
                : "No new players to suggest right now"}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {displayUsers.map((user) => (
              <li key={user._id}>
                <UserCard
                  user={user}
                  isFollowing={followingIds.has(user._id.toString())}
                  loading={actionLoading === user._id.toString()}
                  onToggle={handleFollowToggle}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Discover;
