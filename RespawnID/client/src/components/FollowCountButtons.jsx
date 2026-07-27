import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchFollowers, fetchFollowing } from "../services/userApi";
import Modal from "./Modal";
import ProfileAvatar from "./ProfileAvatar";

export function useFollowList(userId) {
  const [listOpen, setListOpen] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const openList = async (type) => {
    if (!userId) return;
    setListOpen(type);
    try {
      if (type === "followers") {
        const data = await fetchFollowers(userId);
        setFollowers(data);
      } else {
        const data = await fetchFollowing(userId);
        setFollowingList(data);
      }
    } catch {
      toast.error(`Failed to load ${type}`);
    }
  };

  const listData = listOpen === "followers" ? followers : followingList;
  const listTitle = listOpen === "followers" ? "Followers" : "Following";

  return {
    listOpen,
    setListOpen,
    openList,
    listData,
    listTitle,
  };
}

export function FollowListModal({ listOpen, setListOpen, listData, listTitle }) {
  return (
    <Modal open={Boolean(listOpen)} onClose={() => setListOpen(null)} title={listTitle}>
      {listData.length === 0 ? (
        <p className="text-sm text-white/45">No users yet.</p>
      ) : (
        <ul className="space-y-2">
          {listData.map((user) => (
            <li key={user._id}>
              <Link
                to={`/profile/${user.username}`}
                onClick={() => setListOpen(null)}
                className="flex items-center gap-3 rounded-xl bg-white/5 p-3 transition hover:bg-white/10"
              >
                <ProfileAvatar
                  name={user.username}
                  avatar={user.avatar}
                  size="sm"
                />
                <span className="text-sm font-medium">@{user.username}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

function FollowCountButtons({
  userId,
  followerCount = 0,
  followingCount = 0,
  className = "",
  followList,
}) {
  const internal = useFollowList(userId);
  const { openList, listOpen, setListOpen, listData, listTitle } =
    followList || internal;

  return (
    <>
      <div className={`flex gap-4 text-xs ${className}`}>
        <button
          type="button"
          onClick={() => openList("followers")}
          className="text-white/45 transition hover:text-[#FF1E3C]"
        >
          <span className="font-semibold text-white">{followerCount}</span> followers
        </button>
        <button
          type="button"
          onClick={() => openList("following")}
          className="text-white/45 transition hover:text-[#FF1E3C]"
        >
          <span className="font-semibold text-white">{followingCount}</span> following
        </button>
      </div>

      {!followList && (
        <FollowListModal
          listOpen={listOpen}
          setListOpen={setListOpen}
          listData={listData}
          listTitle={listTitle}
        />
      )}
    </>
  );
}

export default FollowCountButtons;
