import api from "../utils/api";

export async function fetchMyProfile() {
  const { data } = await api.get("/users/me");
  return data;
}

export async function updateMyProfile(updates) {
  const { data } = await api.put("/users/me", updates);
  return data;
}

export async function fetchUserByUsername(username) {
  const { data } = await api.get(`/users/${encodeURIComponent(username)}`);
  return data;
}

export async function fetchMyGames() {
  const { data } = await api.get("/users/me/games");
  return Array.isArray(data) ? data : [];
}

export async function fetchFavoriteGames() {
  try {
    const { data } = await api.get("/users/favorites");
    if (Array.isArray(data)) return data;
  } catch (error) {
    if (error.response?.status !== 404) throw error;
  }

  const profile = await fetchMyProfile();
  const favorites = profile.favoriteGames || [];
  return favorites.filter(
    (item) => item && typeof item === "object" && item.title
  );
}

export async function addFavoriteGame(gameId) {
  const { data } = await api.post("/users/favorites", { gameId });
  return data;
}

export async function removeFavoriteGame(gameId) {
  const { data } = await api.delete(`/users/favorites/${gameId}`);
  return data;
}

export async function followUser(userId) {
  const { data } = await api.post(`/users/follow/${userId}`);
  return data;
}

export async function unfollowUser(userId) {
  const { data } = await api.post(`/users/unfollow/${userId}`);
  return data;
}

export async function fetchFollowers(userId) {
  const { data } = await api.get(`/users/followers/${userId}`);
  return data;
}

export async function fetchFollowing(userId) {
  const { data } = await api.get(`/users/following/${userId}`);
  return data;
}

export async function searchUsers(query) {
  const { data } = await api.get(`/users/search/${encodeURIComponent(query)}`);
  return Array.isArray(data) ? data : [];
}

export async function fetchDiscoverUsers() {
  const { data } = await api.get("/users/discover");
  return Array.isArray(data) ? data : [];
}
