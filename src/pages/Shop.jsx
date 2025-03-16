import { LeftBar } from "../components/LeftBar";
import { RightBar } from "../components/RightBar";
import {
  DoubleOrNothingSvg,
  DuoPlushieSvg,
  EmptyGemSvg,
  StreakFreezeSvg,
} from "../components/Svgs";

function Shop() {
  const streakFreezes = 10;
  return (
    <div>
      <LeftBar selectedTab="Shop" />
      <div className="flex justify-center gap-3 pt-14 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
        <div className="px-4 pb-20">
          <div className="py-7">
            <h2 className="mb-5 text-2xl font-bold">Power-ups</h2>
            <div className="flex border-t-2 border-gray-300 py-5">
              <StreakFreezeSvg className="shrink-0" />
              <section className="flex flex-col gap-3">
                <h3 className="text-lg font-bold">Streak Freeze</h3>
                <p className="text-sm text-gray-500">
                  Streak Freeze allows your streak to remain in place for one
                  full day of inactivity.
                </p>
                <div className="w-fit rounded-full bg-gray-200 px-3 py-1 text-sm font-bold uppercase text-gray-400">
                  {streakFreezes} / 2 equipped
                </div>
                <button
                  className="flex w-fit items-center gap-1 rounded-2xl border-2 border-gray-300 bg-white px-4 py-2 text-sm font-bold uppercase text-gray-300"
                  disabled
                >
                  Get one for: <EmptyGemSvg /> 10
                </button>
              </section>
            </div>
            <div className="flex border-t-2 border-gray-300 py-5">
              <DoubleOrNothingSvg className="shrink-0" />
              <section className="flex flex-col gap-3">
                <h3 className="text-lg font-bold">Double or Nothing</h3>
                <p className="text-sm text-gray-500">
                  Attempt to double your five lingot wager by maintaining a
                  seven day streak.
                </p>
                <button
                  className="flex w-fit items-center gap-1 rounded-2xl border-2 border-gray-300 bg-white px-4 py-2 text-sm font-bold uppercase text-gray-300"
                  disabled
                >
                  Get for: <EmptyGemSvg /> 5
                </button>
              </section>
            </div>
          </div>
          <div className="py-7">
            <h2 className="mb-5 text-2xl font-bold">Merch</h2>
            <div className="flex border-t-2 border-gray-300 py-5">
              <DuoPlushieSvg className="h-32 w-32 shrink-0 p-4" />
              <section className="flex flex-col gap-3">
                <h3 className="text-lg font-bold">Duo Plushie</h3>
                <p className="text-sm text-gray-500">
                  {`Celebrate Duolingo's 10 year anniversary with a new exclusive Duo plushie!`}
                </p>
                <button className="flex w-fit items-center gap-1 rounded-2xl border-2 border-b-4 border-gray-300 bg-white px-4 py-3 text-sm font-bold uppercase text-red-500">
                  $29.99
                </button>
              </section>
            </div>
          </div>
        </div>
        <RightBar />
      </div>
    </div>
  );
}

export default Shop;
