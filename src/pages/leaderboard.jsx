import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BottomBar } from "../components/BottomBar";
import { LeftBar } from "../components/LeftBar";
import {
  BronzeSvg,
  GoldSvg,
  LeaderboardBannerSvg,
  LeaderboardExplanationSvg,
  LockedLeaderboardSvg,
  PlusSvg,
  SiverSvg,
} from "../components/Svgs";
import { useSelector } from "react-redux";
import { leaderBoard } from "../services/UserProgress/UserProgressService";
import { autoFollowing, getFriend } from "../services/Friends/friendService";
import { toast } from "react-toastify";
import { getBadge } from "../services/Badges/badgeService";
import { assignBadge } from "../services/UserBadges/userBadgeService";

const LeaderboardExplanationSection = () => (
  <article className="relative hidden h-fit w-96 shrink-0 gap-5 rounded-2xl border-2 border-gray-200 p-6 xl:flex">
    <div className="flex flex-col gap-5">
      <h2 className="font-bold uppercase text-gray-400">
        What are leaderboards?
      </h2>
      <p className="font-bold text-gray-700">Do lessons. Earn XP. Compete.</p>
      <p className="text-gray-400">
        Earn XP through lessons, then compete with players in a weekly
        leaderboard
      </p>
    </div>
    <div className="w-10 shrink-0" />
    <LeaderboardExplanationSvg />
  </article>
);

export default function Leaderboards() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const currentUser = useSelector((state) => state.user.currentUser);
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );

  // state để chứa bảng xếp hạng
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [following, setFollowing] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await leaderBoard();
        if (res.code === 0) {
          setBoard(res.data);
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchFollowing = async () => {
      try {
        const res = await getFriend();
        if (res.code === 0) {
          setFollowing(res.data.map((friend) => friend.user_id));
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchBadges = async () => {
      try {
        const res = await getBadge();
        if (res.code === 0) {
          setBadges(res.data.data);
          console.log(res.data);
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBadges();

    fetchBoard();
    fetchFollowing();
  }, []);

  const badgeSvgs = {
    Bronze: BronzeSvg,
    Silver: SiverSvg,
    Gold: GoldSvg,
  };

  const handleClick = () => {
    navigate(`/learn/${currentLanguage.language_id}`);
  };

  const handleFollow = (userId) => {
    autoFollowing(userId)
      .then((res) => {
        toast.success(`Successfully followed user`, {
          position: "top-right",
          autoClose: 2000,
        });
      })
      .catch((err) => {
        toast.error(`Failed to follow user`, {
          position: "top-right",
          autoClose: 2000,
        });
      });
  };

  const sortedBadges = useMemo(() => {
    return [...badges].sort((a, b) => a.xp_threshold - b.xp_threshold);
  }, [badges]);

  const groupedUsers = useMemo(() => {
    const groups = {};
    sortedBadges.forEach((badge, i) => {
      const minXp = badge.xp_threshold;
      const nextXp = sortedBadges[i + 1]?.xp_threshold ?? Infinity;
      groups[badge.badge_name] = board.filter(
        (u) => u.totalXp >= minXp && u.totalXp < nextXp
      );
    });
    return groups;
  }, [board, sortedBadges]);

  const prevBadge = () => setActiveIndex((i) => Math.max(0, i - 1));
  const nextBadge = () =>
    setActiveIndex((i) => Math.min(sortedBadges.length - 1, i + 1));

  // Badge active & users của nó
  const activeBadge = sortedBadges[activeIndex];
  const usersInGroup = activeBadge
    ? groupedUsers[activeBadge.badge_name] || []
    : [];

  const handleClaim = async (badge) => {
    const myXp =
      board.find((u) => u.userId === currentUser.user_id)?.totalXp || 0;
    if (myXp < badge.xp_threshold) {
      return toast.error(
        `Cần ${badge.xp_threshold - myXp} XP nữa để nhận huy chương ${
          badge.badge_name
        }`
      );
    }
    if (userBadges.includes(badge.badge_id)) {
      return toast.info(`Bạn đã có huy chương ${badge.badge_name}`);
    }
    try {
      const res = await assignBadge(badge.badge_id);
      if (res.code === 0) {
        toast.success(`Bạn đã nhận huy chương ${badge.badge_name}!`);
        setUserBadges((prev) => [...prev, badge.badge_id]);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Cấp huy chương thất bại.");
    }
  };

  return (
    <div>
      <LeftBar selectedTab="Leaderboards" />

      <div className="flex justify-center gap-3 pt-14 md:ml-24 md:p-6 md:pt-10 lg:ml-64 lg:gap-12">
        <div className="flex w-full max-w-xl flex-col items-center gap-5 pb-28 md:px-5">
          {loading ? (
            <p className="text-center text-gray-500">Loading leaderboard…</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : board.length === 0 ? (
            <>
              <LeaderboardBannerSvg />
              <h1 className="text-center text-2xl font-bold text-gray-700">
                No one has earned XP yet
              </h1>
              <button
                onClick={handleClick}
                className="mt-4 rounded-2xl border-2 border-b-4 border-gray-200 px-8 py-2 font-bold uppercase text-blue-400 transition hover:bg-gray-50"
              >
                Start a lesson
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-2">
                <button
                  onClick={prevBadge}
                  disabled={activeIndex === 0}
                  className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  &larr;
                </button>

                {/* Icon và tên badge */}
                {(() => {
                  const Svg = badgeSvgs[activeBadge.badge_name];
                  return Svg ? (
                    <Svg className="h-8 w-8" />
                  ) : (
                    <img
                      src={activeBadge.icon_url}
                      alt={activeBadge.badge_name}
                      className="h-8 w-8"
                    />
                  );
                })()}
                <span className="font-semibold">
                  {activeBadge.badge_name} (XP ≥ {activeBadge.xp_threshold})
                </span>

                <button
                  onClick={() => handleClaim(activeBadge)}
                  className="ml-4 px-3 py-1 bg-green-500 text-white rounded"
                >
                  Nhận huy chương
                </button>

                <button
                  onClick={nextBadge}
                  disabled={activeIndex === sortedBadges.length - 1}
                  className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  &rarr;
                </button>
              </div>

              <ul className="w-full divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white overflow-hidden">
                {usersInGroup.length > 0 ? (
                  usersInGroup.map((user, idx) => {
                    const rank = idx + 1;
                    const isMe =
                      currentUser && user.userId === currentUser.user_id;
                    const medalEmoji =
                      rank === 1
                        ? "🥇"
                        : rank === 2
                        ? "🥈"
                        : rank === 3
                        ? "🥉"
                        : null;
                    const isFollowed = following.includes(user.userId);

                    return (
                      <li
                        key={user.userId}
                        className={`flex items-center px-4 py-3 hover:bg-gray-50 ${
                          isMe ? "bg-blue-50" : ""
                        }`}
                      >
                        <span className="w-6 text-center text-lg">
                          {medalEmoji || `${rank}.`}
                        </span>
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="h-10 w-10 rounded-full mx-3 flex-shrink-0"
                          />
                        ) : (
                          <img
                            src="/woman.png"
                            alt="default avatar"
                            className="h-10 w-10 rounded-full mx-3 flex-shrink-0 opacity-50"
                          />
                        )}
                        <span className="flex-1 font-medium text-gray-800">
                          {user.username}{" "}
                          {isMe && (
                            <span className="text-sm text-blue-600">(you)</span>
                          )}
                        </span>
                        <span className="font-bold text-gray-600">
                          {user.totalXp} XP
                        </span>
                        {!isMe && !isFollowed && (
                          <button
                            className="ml-3 p-2 bg-blue-500 text-white rounded-full"
                            onClick={() => handleFollow(user.userId)}
                          >
                            <PlusSvg />
                          </button>
                        )}
                      </li>
                    );
                  })
                ) : (
                  <li className="px-4 py-3 text-gray-500"></li>
                )}
              </ul>

              <h1 className="text-center text-2xl font-bold text-gray-700">
                Weekly Leaderboard
              </h1>
              <ul className="w-full divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white overflow-hidden">
                {board.map((user, idx) => {
                  const rank = idx + 1;
                  const isMe =
                    currentUser && user.userId === currentUser.user_id;

                  const isFirst = rank === 1;
                  const bgHighlight = isFirst
                    ? "bg-green-50"
                    : isMe
                    ? "bg-blue-50"
                    : "";

                  const medalEmoji =
                    rank === 1
                      ? "🥇"
                      : rank === 2
                      ? "🥈"
                      : rank === 3
                      ? "🥉"
                      : null;

                  const isFollowed = following.includes(user.userId);

                  return (
                    <li
                      key={user.userId}
                      className={`${bgHighlight} flex items-center px-4 py-3 hover:bg-gray-50`}
                    >
                      <span className="w-6 text-center text-lg">
                        {medalEmoji || `${rank}.`}
                      </span>

                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="object-cover rounded-full h-10 w-10 rounded-full mx-3 flex-shrink-0"
                        />
                      ) : (
                        <img
                          src="/woman.png"
                          alt="default avatar"
                          className="h-10 w-10 rounded-full mx-3 flex-shrink-0 opacity-50"
                        />
                      )}

                      <span className="flex-1 font-medium text-gray-800">
                        {user.username}{" "}
                        {isMe && (
                          <span className="text-sm text-blue-600">(you)</span>
                        )}
                      </span>

                      <span className="font-bold text-gray-600">
                        {user.totalXp} XP
                      </span>

                      {!isMe && !isFollowed && (
                        <button
                          className="ml-3 p-2 bg-blue-500 text-white rounded-full"
                          onClick={() => handleFollow(user.userId)}
                        >
                          <PlusSvg />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        <LeaderboardExplanationSection />
      </div>

      <BottomBar selectedTab="Leaderboards" />
    </div>
  );
}
