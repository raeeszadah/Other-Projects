import { useEffect } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useGames } from "../context/GamesContext";

export default function LibraryBridge() {
  const { favoriteGames } = useFavorites();
  const { registerGames } = useGames();

  useEffect(() => {
    registerGames(favoriteGames);
  }, [favoriteGames, registerGames]);

  return null;
}
