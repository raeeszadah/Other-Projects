import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";
import { platforms as defaultPlatforms } from "../data/dummyData";
import { fetchMyProfile, updateMyProfile } from "../services/userApi";
import { mapUserToProfile } from "../utils/profileUtils";

const ProfileContext = createContext(null);

const emptyProfile = {
  id: "",
  username: "",
  displayName: "",
  email: "",
  bio: "",
  avatar: "",
  banner: "",
  steamId: "",
  favoriteGenres: [],
  favoriteGameIds: [],
  followers: [],
  following: [],
  followerCount: 0,
  followingCount: 0,
  gamesOwned: 0,
  totalHours: 0,
  achievementCount: 0,
  level: 1,
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [platforms, setPlatforms] = useState(defaultPlatforms);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const applyProfile = useCallback((user) => {
    const mapped = mapUserToProfile(user);
    if (!mapped) return;
    setProfile(mapped);
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === "steam" ? { ...p, connected: Boolean(mapped.steamId) } : p
      )
    );
  }, []);

  const refreshProfile = useCallback(async () => {
    const data = await fetchMyProfile();
    applyProfile(data);
    return data;
  }, [applyProfile]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await fetchMyProfile();
        if (active) applyProfile(data);
      } catch {
        if (active) toast.error("Failed to load profile");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [applyProfile]);

  const saveProfile = async (updates) => {
    setSaving(true);
    try {
      const payload = {
        bio: updates.bio,
        avatar: updates.avatar,
        banner: updates.banner,
        steamId: updates.steamId,
        favoriteGenres: updates.favoriteGenres,
      };
      const { user } = await updateMyProfile(payload);
      applyProfile(user);
      toast.success("Profile updated");
      return user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const setSteamId = async (steamId) => {
    setSaving(true);
    try {
      const { user } = await updateMyProfile({ steamId });
      applyProfile(user);
      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === "steam" ? { ...p, connected: Boolean(steamId) } : p
        )
      );
      return user;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save Steam ID"
      );
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const updateStats = useCallback((stats) => {
    setProfile((prev) => ({ ...prev, ...stats }));
  }, []);

  const value = useMemo(
    () => ({
      profile,
      platforms,
      loading,
      saving,
      refreshProfile,
      saveProfile,
      setSteamId,
      updateStats,
    }),
    [profile, platforms, loading, saving, refreshProfile, updateStats]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
