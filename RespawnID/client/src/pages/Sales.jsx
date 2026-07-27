import { games, getGameThumb, sales } from "../data/dummyData";
import GameCard from "../components/GameCard";

function Sales() {
  const liveSales = sales.filter((s) => s.startsIn === "Now live");
  const upcoming = sales.filter((s) => s.startsIn !== "Now live");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Discounts & Sales</h1>
        <p className="mt-1 text-sm text-white/50">
          Track upcoming events and active deals across your platforms.
        </p>
      </div>

      {liveSales.length > 0 && (
        <section>
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FF1E3C]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF1E3C]" />
            Live Now
          </p>
          <div className="space-y-4">
            {liveSales.map((sale) => (
              <SaleCard key={sale.id} sale={sale} live />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display mb-4 text-lg font-bold">Upcoming Sales</h2>
        <div className="space-y-4">
          {upcoming.map((sale) => (
            <SaleCard key={sale.id} sale={sale} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display mb-4 text-lg font-bold">On Sale in Your Library</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {games
            .filter((g) => g.onSale)
            .map((game) => (
              <GameCard key={game.id} game={game} showPrice />
            ))}
        </div>
      </section>
    </div>
  );
}

function SaleCard({ sale, live = false }) {
  const featuredGames = games.filter((g) => sale.featured.includes(g.id));

  return (
    <article
      className={`glass-card rounded-2xl p-5 ${live ? "border-[#FF1E3C]/30 ring-1 ring-[#FF1E3C]/20" : ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-white/45">{sale.platform}</p>
          <h3 className="font-display text-lg font-bold">{sale.title}</h3>
          <p className="mt-1 text-sm text-[#FF1E3C]">{sale.discount}</p>
        </div>
        <div className="text-right text-xs text-white/45">
          <p>{live ? "Ends" : "Starts in"}</p>
          <p className="font-semibold text-white">{live ? sale.endsAt : sale.startsIn}</p>
        </div>
      </div>
      {featuredGames.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {featuredGames.map((g) => (
            <div key={g.id} className="flex shrink-0 items-center gap-2 rounded-lg bg-white/5 pr-3">
              <img
                src={getGameThumb(g)}
                alt={g.title}
                loading="lazy"
                className="h-12 w-20 rounded-l-lg object-cover"
              />
              <span className="text-xs font-medium">{g.title}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default Sales;
