import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../components/layouts/store/store";
import followApi from "../../api/content/follow.api";

interface FollowButtonProps {
  authorId: string;
}

export default function FollowButton({
  authorId,
}: FollowButtonProps) {
  const { user } = useSelector(
    (state: RootState) => state.auth,
  );

  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.userId === authorId) return;

    const loadFollowStatus = async () => {
      try {
        const res = await followApi.isFollowing(authorId);

        setIsFollowing(res.data.isFollowing);
      } catch (error) {
        console.error(error);
      }
    };

    loadFollowStatus();
  }, [authorId, user]);

  const handleFollow = async () => {
    try {
      setLoading(true);

      if (isFollowing) {
        await followApi.unfollow(authorId);
        setIsFollowing(false);
      } else {
        await followApi.follow(authorId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.userId === authorId) {
    return null;
  }

  return (
    <button
      className={`btn ${
        isFollowing ? "btn-outline-secondary" : "btn-primary"
      }`}
      disabled={loading}
      onClick={handleFollow}
    >
      {loading
        ? "Loading..."
        : isFollowing
        ? "Following"
        : "Follow"}
    </button>
  );
}