import api from "../utils/api";

export async function syncSteamGames() {
  const { data } = await api.post("/steam/sync");
  return data;
}
