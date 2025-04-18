import { useEffect, useState } from "react";
import {
  EmptyFireSvg,
  EmptyGemSvg,
  FireSvg,
  GemSvg,
  LightningProgressSvg,
  LingotsTreasureChestSvg,
  TreasureClosedSvg,
  TreasureProgressSvg,
} from "./Svgs";
import { Link, useNavigate } from "react-router-dom";

import { Flag } from "./Flag";
import dayjs from "dayjs";
import { Calendar } from "./Calendar";
import { useSelector } from "react-redux";
import { getUserLanguages } from "../services/Users/userService";

export const RightBar = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [languagesShown, setLanguagesShown] = useState(false);

  const current = useSelector((state) => state.language.currentLanguage);

  const streak = 3;
  const lingots = 10;
  const [gemsShown, setGemsShown] = useState(false);
  const [streakShown, setStreakShown] = useState(false);
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    getUserLanguages()
      .then(({ data }) => {
        setCourses(data);
        console.log("Courses:", data);
      })
      .catch((err) => {
        console.error("Lấy courses lỗi:", err);
      });
  }, []);

  return (
    <>
      <aside className="sticky top-0 hidden w-96 flex-col gap-6 self-start sm:flex">
        {/* Choose Languages */}
        <article className="my-6 flex justify-between gap-4">
          <div
            className="relative flex cursor-default items-center gap-2 rounded-xl p-3 font-bold uppercase text-gray-500 hover:bg-gray-100"
            onMouseEnter={() => setLanguagesShown(true)}
            onMouseLeave={() => setLanguagesShown(false)}
            onClick={() => setLanguagesShown((x) => !x)}
            role="button"
            tabIndex={0}
          >
            {current ? (
              <>
                <Flag code={current.language_code} size="45px" />
                <div>{current.language_name}</div>
              </>
            ) : (
              <div className="text-gray-400">No course selected</div>
            )}

            <div
              className="absolute top-full z-10 rounded-2xl border-2 border-gray-300 bg-white"
              style={{
                left: "calc(50% - 150px)",
                width: 300,
                display: languagesShown ? "block" : "none",
              }}
            >
              <h2 className="px-5 py-3 font-bold uppercase text-gray-400">
                My courses
              </h2>
              {courses.map((c) => (
                <button
                  key={c.language.language_id}
                  className="flex w-full items-center gap-3 border-t border-gray-300 px-5 py-3 text-left font-bold hover:bg-gray-100"
                  onClick={() => navigate(`/learn/${c.language.language_id}`)}
                >
                  <Flag code={c.language.language_code} size="45px" />
                  <span className="text-blue-500">
                    {c.language.language_name}
                  </span>
                </button>
              ))}
              <Link
                className="flex w-full items-center gap-3 rounded-b-2xl border-t-2 border-gray-300 px-5 py-3 text-left font-bold hover:bg-gray-100"
                to={"/languageList"}
              >
                <span className="flex items-center justify-center rounded-lg border-2 border-gray-400 px-2 text-lg font-bold text-gray-400">
                  +
                </span>
                <span className="text-gray-600">Add new course</span>
              </Link>
            </div>
          </div>
          {/* Streak */}
          <span
            className="relative flex items-center gap-2 rounded-xl p-3 font-bold text-orange-500 hover:bg-gray-100"
            onMouseEnter={() => setStreakShown(true)}
            onMouseLeave={() => {
              setStreakShown(false);
              setNow(dayjs());
            }}
            onClick={(event) => {
              if (event.target !== event.currentTarget) return;
              setStreakShown((x) => !x);
              setNow(dayjs());
            }}
            role="button"
            tabIndex={0}
          >
            <div className="pointer-events-none">
              {streak > 0 ? <FireSvg /> : <EmptyFireSvg />}
            </div>
            <span className={streak > 0 ? "text-orange-500" : "text-gray-300"}>
              {streak}
            </span>
            <div
              className="absolute top-full z-10 flex flex-col gap-5 rounded-2xl border-2 border-gray-300 bg-white p-5 text-black"
              style={{
                left: "calc(50% - 200px)",
                width: 400,
                display: streakShown ? "flex" : "none",
              }}
            >
              <h2 className="text-center text-lg font-bold">Streak</h2>
              <p className="text-center text-sm font-normal text-gray-400">
                {`But your streak will reset tomorrow if you don't practice tomorrow. Watch out!`}
              </p>
              <Calendar now={now} setNow={setNow} />
            </div>
          </span>
          {/* Gem */}
          <span
            className="relative flex items-center gap-2 rounded-xl p-3 font-bold text-red-500 hover:bg-gray-100"
            onMouseEnter={() => setGemsShown(true)}
            onMouseLeave={() => setGemsShown(false)}
            onClick={() => setGemsShown((x) => !x)}
            role="button"
            tabIndex={0}
          >
            {lingots > 0 ? <GemSvg /> : <EmptyGemSvg />}
            <span className={lingots > 0 ? "text-red-500" : "text-gray-300"}>
              {lingots}
            </span>
            <div
              className="absolute top-full z-10 flex w-72 items-center gap-3 rounded-2xl border-2 border-gray-300 bg-white p-5"
              style={{
                left: "calc(50% - 150px)",
                display: gemsShown ? "flex" : "none",
              }}
            >
              <LingotsTreasureChestSvg className="w-24" />
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-bold text-black">Lingots</h2>
                <p className="text-sm font-normal text-gray-400">
                  You have {lingots} {lingots === 1 ? "lingot" : "lingots"}.
                </p>
                <Link
                  className="uppercase text-blue-400 transition hover:brightness-110"
                  to="/shop"
                >
                  Go to shop
                </Link>
              </div>
            </div>
          </span>
        </article>

        {/* Daily Quests */}
        <DailyQuestsSection />
        {/* EXP */}
        <XpProgressSection />

        <CreateAProfileSection />
      </aside>
    </>
  );
};

const DailyQuestsSection = () => {
  const goalXp = 50; // Mục tiêu điểm kinh nghiệm
  const xpToday = 30;

  return (
    <article className="flex flex-col gap-5 rounded-2xl border-2 border-gray-200 p-6 font-bold text-gray-700">
      <h2 className="text-xl">Daily Quests</h2>
      <div className="flex items-center gap-4">
        <LightningProgressSvg />
        <div className="flex flex-col gap-2">
          <h3>Earn {goalXp} XP</h3>
          <div className="flex items-center">
            <div className="relative h-5 w-52 rounded-l-full bg-gray-200">
              <div
                className={[
                  "relative h-full rounded-l-full bg-yellow-400",
                  xpToday === 0 ? "" : "px-2",
                ].join(" ")}
                style={{ width: `${Math.min(1, xpToday / goalXp) * 100}%` }}
              >
                <div className="absolute left-2 right-0 top-1 h-2 rounded-l-full bg-yellow-300"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center text-sm text-gray-400">
                {xpToday} / {goalXp}
              </div>
            </div>
            <TreasureProgressSvg />
          </div>
        </div>
      </div>
    </article>
  );
};

const XpProgressSection = () => {
  const goalXp = 50; // Mục tiêu điểm kinh nghiệm
  const xpToday = 30;
  return (
    <article className="flex flex-col gap-5 rounded-2xl border-2 border-gray-200 p-6 font-bold text-gray-700">
      <div className="flex items-center justify-between">
        <h2 className="text-xl">XP Progress</h2>
        <Link href="/settings/coach" className="uppercase text-blue-400">
          Edit goal
        </Link>
      </div>
      <div className="flex gap-5">
        <TreasureClosedSvg />
        <div className="flex grow flex-col justify-around">
          <h3 className="font-normal text-gray-500">Daily goal</h3>
          <div className="flex items-center gap-5">
            <div className="relative h-4 w-full grow rounded-full bg-gray-200">
              {xpToday > 0 && (
                <div
                  className="absolute left-0 top-0 h-4 rounded-full bg-yellow-400"
                  style={{ width: `${Math.min(1, xpToday / goalXp) * 100}%` }}
                >
                  <div className="absolute left-2 right-2 top-1 h-[6px] rounded-full bg-yellow-300"></div>
                </div>
              )}
            </div>
            <div className="text-md shrink-0 font-normal text-gray-400">
              {xpToday}/{goalXp} XP
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

const CreateAProfileSection = ({}) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  if (currentUser) {
    return null;
  }
  return (
    <article className="flex flex-col gap-5 rounded-2xl border-2 border-gray-200 p-6 font-bold">
      <h2 className="text-xl">Create a profile to save your progress!</h2>
      <button
        onClick={() => navigate("/login")}
        className="rounded-2xl border-b-4 border-green-600 bg-green-500 py-3 uppercase text-white transition hover:border-green-500 hover:bg-green-400"
      >
        Create a profile
      </button>
      <button
        onClick={() => navigate("/login")}
        className="rounded-2xl border-b-4 border-blue-500 bg-blue-400 py-3 uppercase text-white transition hover:border-blue-400 hover:bg-blue-300"
      >
        Sign in
      </button>
    </article>
  );
};
