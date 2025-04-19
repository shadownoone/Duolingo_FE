import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomBar } from "../components/BottomBar";
import { LeftBar } from "../components/LeftBar";
import {
  LeaderboardBannerSvg,
  LeaderboardExplanationSvg,
  LockedLeaderboardSvg,
} from "../components/Svgs";
import { useSelector } from "react-redux";
import { leaderBoard } from "../services/UserProgress/UserProgressService";

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

  const currentUser = useSelector((state) => state.user.currentUser);
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );

  // state để chứa bảng xếp hạng
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    fetchBoard();
  }, []);

  const handleClick = () => {
    navigate(`/learn/${currentLanguage.language_id}`);
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
              <LeaderboardBannerSvg />

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
