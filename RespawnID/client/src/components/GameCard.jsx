import { useFavorites } from "../context/FavoritesContext";

function GameCard({ game, compact = false, showPrice = false, owned = false }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const gameId = game._id || game.id;
  const fav = isFavorite(gameId);

  return (
    <article className="glass-card group overflow-hidden rounded-2xl transition hover:border-[#FF1E3C]/25">
      <div className="relative">
        <img
          src={game.cover}
          alt={game.title}
          loading="lazy"
          decoding="async"
          className={`w-full object-cover ${compact ? "h-36" : "h-44"}`}
        />
        <button
          type="button"
          onClick={() => toggleFavorite(game)}
          className={`absolute right-2 top-2 rounded-full p-1.5 backdrop-blur-sm transition ${
            fav ? "bg-[#FF1E3C]/90 text-white" : "bg-black/50 text-white/70 hover:text-white"
          }`}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        >
          <svg viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
        {showPrice && game.onSale && (
          <span className="absolute left-2 top-2 rounded-full bg-[#FF1E3C] px-2 py-0.5 text-[10px] font-bold uppercase">
            Sale
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold">{game.title}</h3>
        <p className="mt-0.5 text-xs text-white/45">{game.genre}</p>
        {!compact && (
          <div className="mt-2 space-y-1.5">
            <p className="text-xs text-white/50">{game.hoursPlayed}h played</p>
            {owned ? (
              <div className="flex flex-wrap gap-1">
                {game.platform.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/55"
                  >
                    {p}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/50">{game.platform[0]}</p>
            )}
          </div>
        )}
        {showPrice && (
          <p className="mt-2 text-sm font-semibold text-[#FF1E3C]">
            {game.onSale ? (
              <>
                <span className="mr-2 text-white/35 line-through">${game.price}</span>
                ${game.salePrice}
              </>
            ) : game.price === 0 ? (
              "Free"
            ) : (
              `$${game.price}`
            )}
          </p>
        )}
      </div>
    </article>
  );
}

export default GameCard;
