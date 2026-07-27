import { achievements } from "../data/dummyData";
import { useProfile } from "../context/ProfileContext";

const rarityColors = {
  Common: "text-white/50 border-white/15",
  Uncommon: "text-green-400 border-green-400/30",
  Rare: "text-blue-400 border-blue-400/30",
  Epic: "text-purple-400 border-purple-400/30",
};

function Achievements() {
  const { profile } = useProfile();

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 text-center">
        <p className="text-xs uppercase tracking-wider text-white/40">Total Trophies</p>
        <p className="font-display mt-2 text-4xl font-bold text-[#FF1E3C]">
          {profile.achievementCount}
        </p>
        <p className="mt-2 text-sm text-white/45">Synced from connected platforms</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {achievements.map((a) => (
          <article
            key={a.id}
            className={`glass-card flex items-center gap-4 rounded-2xl border p-4 ${rarityColors[a.rarity] || ""}`}
          >
            <span className="text-3xl">{a.icon}</span>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium">{a.title}</h3>
              <p className="text-xs text-white/45">{a.game}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-full border px-2 py-0.5 text-[10px] uppercase">
                  {a.rarity}
                </span>
                <span className="text-[10px] text-white/35">{a.unlockedAt}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Achievements;
