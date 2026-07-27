import { Link } from "react-router-dom";
import { achievements, getGameThumb, weeklyActivity } from "../data/dummyData";
import { useGames } from "../context/GamesContext";
import { useProfile } from "../context/ProfileContext";
import GameCard from "../components/GameCard";
import FollowCountButtons from "../components/FollowCountButtons";

function StatCard({ label, value, sub }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wider text-white/40">{label}</p>
      <p className="font-display mt-1 text-2xl font-bold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/45">{sub}</p>}
    </div>
  );
}

function Dashboard() {
  const { profile, platforms, loading } = useProfile();
  const { recentGames, topGames, stats, syncing, syncSteam } = useGames();
  const connectedCount = platforms.filter((p) => p.connected).length;
  const maxHours = Math.max(...weeklyActivity.map((d) => d.hours));

  if (loading) {
    return <p className="text-center text-sm text-white/50 py-12">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      <section className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#FF1E3C]/10 blur-3xl" />
        <p className="text-xs uppercase tracking-[0.3em] text-[#FF1E3C]/80">Dashboard</p>
        <h1 className="font-display mt-2 text-2xl font-bold sm:text-3xl">
          Welcome back, {profile.displayName}
        </h1>
        <p className="mt-2 max-w-lg text-sm text-white/55">
          {stats.gamesOwned || profile.gamesOwned} games · {connectedCount} platforms linked
        </p>
        <FollowCountButtons
          userId={profile.id}
          followerCount={profile.followerCount}
          followingCount={profile.followingCount}
          className="mt-2"
        />
        {!profile.steamId && (
          <Link
            to="/profile"
            className="mt-4 inline-block text-xs text-[#FF1E3C] hover:text-white"
          >
            Connect Steam to sync your library →
          </Link>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Hours" value={`${stats.totalHours}h`} sub="Synced games" />
        <StatCard label="Achievements" value={profile.achievementCount} sub="Unlocked trophies" />
        <StatCard label="Games Owned" value={stats.gamesOwned} />
        <StatCard label="Followers" value={profile.followerCount} sub="Community" />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Recently Played</h2>
          <Link to="/library" className="text-xs text-[#FF1E3C] hover:text-white">
            View library →
          </Link>
        </div>
        {recentGames.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {recentGames.map((game) => (
              <GameCard key={game.id} game={game} compact />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-sm text-white/45">No synced games yet.</p>
            <button
              type="button"
              onClick={syncSteam}
              disabled={syncing}
              className="mt-3 rounded-full bg-[#FF1E3C] px-5 py-2 text-xs font-semibold disabled:opacity-70"
            >
              {syncing ? "Syncing..." : "Sync Steam Library"}
            </button>
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-display mb-4 text-lg font-bold">Top Played</h2>
          {topGames.length ? (
            <ul className="space-y-3">
              {topGames.slice(0, 4).map((game, i) => (
                <li key={game.id} className="flex items-center gap-3">
                  <span className="font-display w-5 text-sm text-[#FF1E3C]">{i + 1}</span>
                  <img
                    src={getGameThumb(game)}
                    alt={game.title}
                    loading="lazy"
                    className="h-9 w-16 shrink-0 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{game.title}</p>
                    <p className="text-xs text-white/45">{game.hoursPlayed} hours</p>
                  </div>
                  <div
                    className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10"
                    title={`${game.hoursPlayed}h`}
                  >
                    <div
                      className="h-full rounded-full bg-[#FF1E3C]"
                      style={{
                        width: `${topGames[0]?.hoursPlayed ? (game.hoursPlayed / topGames[0].hoursPlayed) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-white/45">Sync Steam to see your top played games.</p>
          )}
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-display mb-4 text-lg font-bold">Weekly Activity</h2>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyActivity.map((day) => (
              <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-[#B3001B] to-[#FF1E3C]"
                  style={{ height: `${(day.hours / maxHours) * 100}%`, minHeight: "8px" }}
                />
                <span className="text-[10px] text-white/40">{day.day}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/45">
            {weeklyActivity.reduce((s, d) => s + d.hours, 0).toFixed(1)}h this week
          </p>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-display mb-3 text-lg font-bold">Connected Platforms</h2>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <span
                key={p.id}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  p.connected
                    ? "border border-[#FF1E3C]/30 bg-[#FF1E3C]/10 text-[#FF1E3C]"
                    : "border border-white/10 bg-white/5 text-white/35"
                }`}
              >
                {p.name}
              </span>
            ))}
          </div>
          <Link
            to="/profile"
            className="mt-4 inline-block text-xs text-[#FF1E3C] hover:text-white"
          >
            Manage connections →
          </Link>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-display mb-3 text-lg font-bold">Latest Achievements</h2>
          <ul className="space-y-2">
            {achievements.slice(0, 3).map((a) => (
              <li key={a.id} className="flex items-center gap-3 text-sm">
                <span className="text-lg">{a.icon}</span>
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-xs text-white/45">{a.game}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            to="/profile"
            className="mt-4 inline-block text-xs text-[#FF1E3C] hover:text-white"
          >
            View on profile →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
