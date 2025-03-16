import { Link } from "react-router-dom";
import { BottomBar } from "../components/BottomBar";
import { LeftBar } from "../components/LeftBar";
import {
  LeaderboardBannerSvg,
  LeaderboardExplanationSvg,
  LockedLeaderboardSvg,
} from "../components/Svgs";

const LeaderboardExplanationSection = () => {
  return (
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

      <div className="w-10 shrink-0"></div>

      <LeaderboardExplanationSvg />
    </article>
  );
};

function Leaderboards() {
  const leaderboardIsUnlocked = false;
  const lessonsRemainingToUnlockLeaderboard = 1;

  return (
    <div>
      <LeftBar selectedTab="Leaderboards" />
      <div className="flex justify-center gap-3 pt-14 md:ml-24 md:p-6 md:pt-10 lg:ml-64 lg:gap-12">
        <div className="flex w-full max-w-xl flex-col items-center gap-5 pb-28 md:px-5">
          {!leaderboardIsUnlocked && (
            <>
              <LeaderboardBannerSvg />
              <h1 className="text-center text-2xl font-bold text-gray-700">
                Unlock Leaderboards!
              </h1>
              <p className="text-center text-lg text-gray-500">
                Complete {lessonsRemainingToUnlockLeaderboard} more lesson
                {lessonsRemainingToUnlockLeaderboard === 1 ? "" : "s"} to start
                competing
              </p>
              <Link
                to="/lesson?practice"
                className="w-fit rounded-2xl border-2 border-b-4 border-gray-200 px-16 py-2 text-center font-bold uppercase text-blue-400 transition hover:bg-gray-50 hover:brightness-90"
              >
                Start a lesson
              </Link>
              <div className="h-5"></div>
              <LockedLeaderboardSvg />
            </>
          )}
        </div>
        {!leaderboardIsUnlocked && <LeaderboardExplanationSection />}
      </div>

      <BottomBar selectedTab="Leaderboards" />
    </div>
  );
}

export default Leaderboards;
