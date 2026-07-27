import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { steamInputHint, normalizeSteamInput } from "../utils/steamUtils";
import { achievements, gamingStats, getGameThumb, topGenres } from "../data/dummyData";
import { useFavorites } from "../context/FavoritesContext";
import { useGames } from "../context/GamesContext";
import { useProfile } from "../context/ProfileContext";
import GameCard from "../components/GameCard";
import FollowCountButtons, {
  FollowListModal,
  useFollowList,
} from "../components/FollowCountButtons";
import Modal from "../components/Modal";
import ProfileAvatar from "../components/ProfileAvatar";

function Profile() {
  const { profile, platforms, loading, saving, saveProfile, setSteamId } = useProfile();
  const { favoriteGames, refreshFavorites } = useFavorites();
  const { recentGames, topGames, stats, syncing, syncSteam } = useGames();
  const [editOpen, setEditOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [steamIdInput, setSteamIdInput] = useState("");
  const [draft, setDraft] = useState({
    bio: "",
    avatar: "",
    banner: "",
  });

  const followList = useFollowList(profile.id);

  useEffect(() => {
    setDraft({
      bio: profile.bio,
      avatar: profile.avatar,
      banner: profile.banner,
    });
    setSteamIdInput(profile.steamId || "");
  }, [profile]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await saveProfile(draft);
      setEditOpen(false);
    } catch {
      // toast handled in context
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/profile/${profile.username}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Profile link copied");
    } catch {
      toast.info(url);
    }
  };

  const handleCopyId = async () => {
    if (!profile.id) return;
    try {
      await navigator.clipboard.writeText(profile.id);
      toast.success("User ID copied");
    } catch {
      toast.info(profile.id);
    }
  };

  const handleSaveSteam = async () => {
    const value = normalizeSteamInput(steamIdInput);
    if (!value) {
      toast.error("Enter your Steam profile URL, custom name, or steamID64");
      return;
    }

    try {
      await setSteamId(value);
      toast.success("Steam account connected");
    } catch {
      // toast handled in context
    }
  };

  const handleSyncSteam = async () => {
    if (!profile.steamId && !steamIdInput.trim()) {
      toast.error("Enter your Steam ID first");
      return;
    }
    if (!profile.steamId && steamIdInput.trim()) {
      await setSteamId(steamIdInput.trim());
    }
    try {
      await syncSteam();
      await refreshFavorites();
    } catch {
      // toast handled in context
    }
  };

  if (loading) {
    return <p className="text-center text-sm text-white/50 py-12">Loading profile...</p>;
  }

  return (
    <div className="space-y-6">
      <section className="glass-card overflow-hidden rounded-3xl">
        <div className="relative h-36 sm:h-44">
          <img src={profile.banner} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151515] to-transparent" />
        </div>
        <div className="relative px-5 pb-5">
          <ProfileAvatar name={profile.displayName} avatar={profile.avatar} />
          <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-xl font-bold sm:text-2xl">{profile.displayName}</h1>
              <p className="text-sm text-[#FF1E3C]">@{profile.username}</p>
              <button
                type="button"
                onClick={handleCopyId}
                className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-white/35 transition hover:text-[#FF1E3C]"
                title="Copy user ID"
              >
                ID: {profile.id}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
              <p className="mt-2 max-w-xl text-sm text-white/55">{profile.bio || "No bio yet."}</p>
              <FollowCountButtons
                userId={profile.id}
                followerCount={profile.followerCount}
                followingCount={profile.followingCount}
                className="mt-3"
                followList={followList}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraft({
                    bio: profile.bio,
                    avatar: profile.avatar,
                    banner: profile.banner,
                  });
                  setEditOpen(true);
                }}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold hover:border-[#FF1E3C]/40"
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full bg-gradient-to-r from-[#FF1E3C] to-[#B3001B] px-4 py-2 text-xs font-semibold"
              >
                Share Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Total Hours", value: `${stats.totalHours || profile.totalHours}h` },
          { label: "Achievements", value: profile.achievementCount },
          { label: "Games", value: stats.gamesOwned || profile.gamesOwned },
          {
            label: "Followers",
            value: profile.followerCount,
            listType: "followers",
          },
          {
            label: "Following",
            value: profile.followingCount,
            listType: "following",
          },
        ].map((stat) =>
          stat.listType ? (
            <button
              key={stat.label}
              type="button"
              onClick={() => followList.openList(stat.listType)}
              className="glass-card rounded-2xl p-4 text-center transition hover:border-[#FF1E3C]/30 hover:bg-white/[0.03]"
            >
              <p className="text-xs text-white/40">{stat.label}</p>
              <p className="font-display mt-1 text-xl font-bold">{stat.value}</p>
            </button>
          ) : (
            <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
              <p className="text-xs text-white/40">{stat.label}</p>
              <p className="font-display mt-1 text-xl font-bold">{stat.value}</p>
            </div>
          )
        )}
      </section>

      <FollowListModal
        listOpen={followList.listOpen}
        setListOpen={followList.setListOpen}
        listData={followList.listData}
        listTitle={followList.listTitle}
      />

      <section>
        <h2 className="font-display mb-3 text-lg font-bold">Favorite Games</h2>
        {favoriteGames.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {favoriteGames.map((game) => (
              <GameCard key={game.id} game={game} compact />
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/45">No favorites yet — heart games in your library.</p>
        )}
      </section>

      <section>
        <h2 className="font-display mb-3 text-lg font-bold">Recently Played</h2>
        {recentGames.length ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentGames.map((game) => (
              <div key={game.id} className="min-w-[120px] shrink-0">
                <img
                  src={getGameThumb(game)}
                  alt={game.title}
                  loading="lazy"
                  className="h-36 w-[100px] rounded-xl object-cover"
                />
                <p className="mt-1 truncate text-xs font-medium">{game.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/45">
            Sync your Steam library to see recently played games.
          </p>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-display mb-4 text-lg font-bold">Top Genres</h2>
          {profile.favoriteGenres?.length ? (
            <ul className="space-y-3">
              {profile.favoriteGenres.map((name) => (
                <li key={name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{name}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-2/3 rounded-full bg-[#FF1E3C]" />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-3">
              {topGenres.map((g) => (
                <li key={g.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{g.name}</span>
                    <span className="text-white/45">{g.hours}h</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#FF1E3C]" style={{ width: `${g.percent}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-display mb-4 text-lg font-bold">Gaming Stats</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-white/40">Avg Session</dt>
              <dd className="font-semibold">{gamingStats.avgSession}</dd>
            </div>
            <div>
              <dt className="text-white/40">Longest Streak</dt>
              <dd className="font-semibold">{gamingStats.longestStreak} days</dd>
            </div>
            <div>
              <dt className="text-white/40">Completion Rate</dt>
              <dd className="font-semibold">{gamingStats.completionRate}%</dd>
            </div>
            <div>
              <dt className="text-white/40">Multiplayer</dt>
              <dd className="font-semibold">{gamingStats.multiplayerRatio}%</dd>
            </div>
          </dl>
          <h3 className="font-display mt-6 mb-2 text-sm font-bold text-white/70">Top Played</h3>
          {topGames.length ? (
            <ul className="space-y-2">
              {topGames.slice(0, 3).map((g) => (
                <li key={g.id} className="flex justify-between text-sm">
                  <span>{g.title}</span>
                  <span className="text-white/45">{g.hoursPlayed}h</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-white/45">Sync Steam to populate playtime stats.</p>
          )}
        </div>
      </section>

      <section className="glass-card rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Top Achievements</h2>
          <button
            type="button"
            onClick={() => setConnectOpen(true)}
            className="text-xs text-[#FF1E3C] hover:text-white"
          >
            Connect platforms
          </button>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {platforms.map((p) => (
            <span
              key={p.id}
              className={`rounded-full px-3 py-1 text-xs ${
                p.connected ? "bg-[#FF1E3C]/15 text-[#FF1E3C]" : "bg-white/5 text-white/35"
              }`}
            >
              {p.name}
            </span>
          ))}
        </div>
        <ul className="space-y-3">
          {achievements.slice(0, 4).map((a) => (
            <li key={a.id} className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <span className="text-2xl">{a.icon}</span>
              <div>
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-white/45">
                  {a.game} · {a.rarity}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <form className="space-y-4" onSubmit={handleSaveProfile}>
          {[
            { name: "bio", label: "Bio", multiline: true },
            { name: "avatar", label: "Avatar URL" },
            { name: "banner", label: "Banner URL" },
          ].map((field) => (
            <div key={field.name}>
              <label className="mb-1 block text-xs text-white/50">{field.label}</label>
              {field.multiline ? (
                <textarea
                  value={draft[field.name]}
                  onChange={(e) => setDraft((d) => ({ ...d, [field.name]: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
                />
              ) : (
                <input
                  value={draft[field.name]}
                  onChange={(e) => setDraft((d) => ({ ...d, [field.name]: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-gradient-to-r from-[#FF1E3C] to-[#B3001B] py-3 text-sm font-semibold disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </Modal>

      <Modal open={connectOpen} onClose={() => setConnectOpen(false)} title="Connect Platforms">
        <p className="mb-4 text-sm text-white/50">
          Link your Steam account to sync your library and playtime.
        </p>
        <div className="mb-4 space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
          <label className="mb-1 block text-xs text-white/50">
            Steam profile URL, custom name, or steamID64
          </label>
          <input
            value={steamIdInput}
            onChange={(e) => setSteamIdInput(e.target.value)}
            placeholder="76561198..."
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
          />
          <p className="text-xs text-white/40">{steamInputHint(steamIdInput)}</p>
          <p className="text-xs text-white/35">
            Find your steamID64 at{" "}
            <a
              href="https://steamid.io"
              target="_blank"
              rel="noreferrer"
              className="text-[#FF1E3C] hover:text-white"
            >
              steamid.io
            </a>
            . Set Steam game details to Public before syncing.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleSaveSteam}
              disabled={saving}
              className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold"
            >
              Save Steam ID
            </button>
            <button
              type="button"
              onClick={handleSyncSteam}
              disabled={syncing || saving}
              className="rounded-full bg-[#FF1E3C] px-4 py-1.5 text-xs font-semibold disabled:opacity-70"
            >
              {syncing ? "Syncing..." : "Sync Steam Library"}
            </button>
          </div>
        </div>
        <ul className="space-y-2">
          {platforms
            .filter((p) => p.id !== "steam")
            .map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 opacity-60"
              >
                <span className="font-medium">{p.name}</span>
                <span className="text-xs text-white/40">Coming soon</span>
              </li>
            ))}
        </ul>
      </Modal>
    </div>
  );
}

export default Profile;
