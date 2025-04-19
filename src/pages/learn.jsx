import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { LeftBar } from "../components/LeftBar";
import { RightBar } from "../components/RightBar";
import {
  ActiveBookSvg,
  ActiveDumbbellSvg,
  ActiveTreasureSvg,
  ActiveTrophySvg,
  CheckmarkSvg,
  FastForwardSvg,
  GoldenDumbbellSvg,
  GoldenTreasureSvg,
  GoldenTrophySvg,
  GuidebookSvg,
  LessonCompletionSvg0,
  LessonCompletionSvg1,
  LessonCompletionSvg2,
  LessonCompletionSvg3,
  LockedBookSvg,
  LockedDumbbellSvg,
  LockedTreasureSvg,
  LockedTrophySvg,
  LockSvg,
  PracticeExerciseSvg,
  StarSvg,
  UpArrowSvg,
} from "../components/Svgs";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getCourseByLanguage } from "../services/Languages/languageService";
import { getLessonByCourse } from "../services/Courses/courseService";
import { useDispatch } from "react-redux";
import { setCurrentLanguage } from "../features/language/languageSlice";
import { getUserProgress } from "../services/UserProgress/UserProgressService";

const UnitSection = ({ courseId, unitNumber, locked }) => {
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);

  const [completedLessons, setCompletedLessons] = useState([]);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    getLessonByCourse(courseId)
      .then((res) => {
        if (res.code === 0) {
          const lessons = Array.isArray(res.data) ? res.data : [res.data];
          const { Course } = lessons[0];
          const lessonTiles = lessons.map((lesson) => ({
            type: "star",
            description: lesson.lesson_title,
            lessonId: lesson.lesson_id,
          }));

          setUnit({
            description: Course.course_name,
            backgroundColor: "bg-[#58cc02]",
            textColor: "text-[#58cc02]",
            borderColor: "border-[#46a302]",
            tiles: lessonTiles,
          });
        }
      })
      .catch((error) => {
        console.error("getLessonByCourse error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [courseId]);

  useEffect(() => {
    getUserProgress()
      .then((res) => {
        if (res.code === 0) {
          // lọc ra lesson_id nào completed
          const doneIds = res.data
            .filter((p) => p.status === "completed")
            .map((p) => p.lesson_id);
          setCompletedLessons(doneIds);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const unselectTile = () => setSelectedTile(null);
    window.addEventListener("scroll", unselectTile);
    return () => window.removeEventListener("scroll", unselectTile);
  }, []);

  const closeTooltip = useCallback(() => setSelectedTile(null), []);

  const increaseLessonsCompleted = () => {
    // Increase the number of lessons completed
  };
  const increaseLingots = () => {
    // Increase the number of lingots
  };

  if (loading) return <div>Loading...</div>;
  if (!unit) return <div>No unit data available.</div>;

  const tileIds = unit?.tiles?.map((t) => t.lessonId) || [];
  const doneList = completedLessons.filter((id) => tileIds.includes(id));
  const doneSet = new Set(doneList);

  return (
    <>
      <UnitHeader
        unitNumber={unitNumber}
        description={unit.description}
        backgroundColor={unit.backgroundColor}
        borderColor={unit.borderColor}
      />
      <div className="relative mb-8 mt-[67px] flex max-w-2xl flex-col items-center gap-4">
        {unit.tiles.map((tile, i) => {
          let status = locked
            ? "LOCKED"
            : doneSet.has(tile.lessonId)
            ? "COMPLETE"
            : i === doneList.length
            ? "ACTIVE"
            : "LOCKED";

          return (
            <Fragment key={tile.lessonId}>
              {(() => {
                switch (tile.type) {
                  case "star":
                  case "book":
                  case "dumbbell":
                  case "trophy":
                  case "fast-forward":
                    if (tile.type === "trophy" && status === "COMPLETE") {
                      return (
                        <div className="relative">
                          <TileIcon tileType={tile.type} status={status} />
                          <div className="absolute left-0 right-0 top-6 flex justify-center text-lg font-bold text-yellow-700">
                            {unit.unitNumber}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div
                        className={[
                          "relative -mb-4 h-[93px] w-[98px]",
                          getTileLeftClassName({
                            index: i,
                            unitNumber: unit.unitNumber,
                            tilesLength: unit.tiles.length,
                          }),
                        ].join(" ")}
                      >
                        {tile.type === "fast-forward" && status === "LOCKED" ? (
                          <HoverLabel
                            text="Jump here?"
                            textColor={unit.textColor}
                          />
                        ) : selectedTile !== i && status === "ACTIVE" ? (
                          <HoverLabel text="Start" textColor={unit.textColor} />
                        ) : null}
                        <LessonCompletionSvg
                          lessonsCompleted={lessonsCompleted}
                          status={status}
                        />
                        <button
                          className={[
                            "absolute m-3 rounded-full border-b-8 p-4",
                            getTileColors({
                              tileType: tile.type,
                              status,
                              defaultColors: `${unit.borderColor} ${unit.backgroundColor}`,
                            }),
                          ].join(" ")}
                          onClick={() => {
                            if (
                              tile.type === "fast-forward" &&
                              status === "LOCKED"
                            ) {
                              navigate(
                                `/lesson?fast-forward=${unit.unitNumber}`
                              );
                              return;
                            }
                            setSelectedTile(i);
                          }}
                        >
                          <TileIcon tileType={tile.type} status={status} />
                          <span className="sr-only">Show lesson</span>
                        </button>
                      </div>
                    );
                  case "treasure":
                    return (
                      <div
                        className={[
                          "relative -mb-4",
                          getTileLeftClassName({
                            index: i,
                            unitNumber: unit.unitNumber,
                            tilesLength: unit.tiles.length,
                          }),
                        ].join(" ")}
                        onClick={() => {
                          if (status === "ACTIVE") {
                            increaseLessonsCompleted(4);
                            increaseLingots(1);
                          }
                        }}
                        role="button"
                        tabIndex={status === "ACTIVE" ? 0 : undefined}
                        aria-hidden={status !== "ACTIVE"}
                        aria-label={status === "ACTIVE" ? "Collect reward" : ""}
                      >
                        {status === "ACTIVE" && (
                          <HoverLabel text="Open" textColor="text-yellow-400" />
                        )}
                        <TileIcon tileType={tile.type} status={status} />
                      </div>
                    );
                  default:
                    return null;
                }
              })()}
              <TileTooltip
                selectedTile={selectedTile}
                index={i}
                unitNumber={unit.unitNumber}
                tilesLength={unit.tiles.length}
                description={(() => {
                  switch (tile.type) {
                    case "book":
                    case "dumbbell":
                    case "star":
                      return tile.description;
                    case "fast-forward":
                      return status === "LOCKED"
                        ? "Jump here?"
                        : tile.description;
                    case "trophy":
                      return `Unit ${unit.unitNumber} review`;
                    case "treasure":
                      return "";
                    default:
                      return "";
                  }
                })()}
                status={status}
                lessonId={tile.lessonId}
                closeTooltip={closeTooltip}
              />
            </Fragment>
          );
        })}
      </div>
    </>
  );
};

const Learn = () => {
  const { languageId } = useParams();
  const dispatch = useDispatch();
  const [language, setLanguage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [completedLessons, setCompletedLessons] = useState([]);

  const [courseLessonsMap, setCourseLessonsMap] = useState({});

  const { search } = useLocation();
  const forcedUnit = Number(new URLSearchParams(search).get("unit"));

  useEffect(() => {
    const fetchLanguageData = async () => {
      try {
        const response = await getCourseByLanguage(languageId);
        if (response.code === 0) {
          dispatch(
            setCurrentLanguage({
              language_id: +languageId,
              language_code: response.data.language_code,
              language_name: response.data.language_name,
              description: response.data.description,
            })
          );
          setLanguage(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLanguageData();
  }, [languageId, dispatch]);

  useEffect(() => {
    getUserProgress()
      .then((res) => {
        if (res.code === 0) {
          const doneIds = res.data
            .filter((p) => p.status === "completed")
            .map((p) => p.lesson_id);
          setCompletedLessons(doneIds);
        }
      })
      .catch(console.error);
  }, []);

  // sau khi biết language.courses thì build map từ mỗi course sang lesson_ids
  useEffect(() => {
    if (!language?.courses) return;
    language.courses.forEach((course) => {
      getLessonByCourse(course.course_id)
        .then((res) => {
          if (res.code === 0) {
            setCourseLessonsMap((m) => ({
              ...m,
              [course.course_id]: res.data.map((l) => l.lesson_id),
            }));
          }
        })
        .catch(console.error);
    });
  }, [language?.courses]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!language) return <p>No language data found.</p>;

  return (
    <>
      <LeftBar selectedTab="Learn" languageId={languageId} />
      <div className="flex justify-center gap-3 pt-14 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
        <div className="flex max-w-2xl grow flex-col">
          {/* Hiển thị danh sách course của ngôn ngữ */}
          <section className="grid grid-cols-1 gap-4">
            {language.courses && language.courses.length > 0 ? (
              language.courses.map((course, idx) => {
                const unitNumber = idx + 1;
                const prevCourseId = language.courses[idx - 1]?.course_id;
                const prevLessons = courseLessonsMap[prevCourseId] || [];
                console.log(
                  `Unit ${unitNumber}:`,
                  "prevLessons =",
                  prevLessons,
                  "completedLessons =",
                  completedLessons
                );

                // Điều kiện gốc (unit 1 luôn mở, unit N mở nếu unit N-1 đã hoàn thành)
                const baseUnlocked =
                  idx === 0 ||
                  prevLessons.every((lessonId) =>
                    completedLessons.includes(lessonId)
                  );

                // Nếu có ?unit=<n> trong URL, cho phép mở tất cả unit ≤ n
                const isForced = forcedUnit > 0 && unitNumber <= forcedUnit;

                const isUnlocked = forcedUnit ? isForced : baseUnlocked;

                return (
                  <div
                    key={course.course_id}
                    className="rounded-xl p-4 text-white border-2"
                  >
                    <h2 className="text-xl font-bold">{course.course_name}</h2>
                    <p>{course.description}</p>

                    <UnitSection
                      unitNumber={unitNumber}
                      courseId={course.course_id}
                      locked={!isUnlocked}
                    />
                  </div>
                );
              })
            ) : (
              <p>No courses available for this language.</p>
            )}
          </section>

          {/* Phần footer: Practice & Jump to top */}
          <div className="relative mt-8">
            <Link
              to="/lesson?practice"
              className="absolute left-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-b-4 border-gray-200 bg-white transition hover:bg-gray-50 hover:brightness-90 md:left-0"
            >
              <span className="sr-only">Practice exercise</span>
              <PracticeExerciseSvg className="h-8 w-8" />
            </Link>
            <button
              className="absolute right-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-b-4 border-gray-200 bg-white transition hover:bg-gray-50 hover:brightness-90 md:right-0"
              onClick={() => window.scrollTo(0, 0)}
            >
              <span className="sr-only">Jump to top</span>
              <UpArrowSvg />
            </button>
          </div>
        </div>
        <RightBar />
      </div>
    </>
  );
};

const UnitHeader = ({
  unitNumber,
  description,
  backgroundColor,
  borderColor,
}) => {
  return (
    <article
      className={["max-w-2xl text-white sm:rounded-xl", backgroundColor].join(
        " "
      )}
    >
      <header className="flex items-center justify-between gap-4 p-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">Unit {unitNumber}</h2>
          <p className="text-lg">{description}</p>
        </div>
        <Link
          className={[
            "flex items-center gap-3 rounded-2xl border-2 border-b-4 p-3 transition hover:text-gray-100",
            borderColor,
          ].join(" ")}
        >
          <GuidebookSvg />
          <span className="sr-only font-bold uppercase lg:not-sr-only">
            Guidebook
          </span>
        </Link>
      </header>
    </article>
  );
};

const TileIcon = ({ tileType, status }) => {
  switch (tileType) {
    case "star":
      return status === "COMPLETE" ? (
        <CheckmarkSvg />
      ) : status === "ACTIVE" ? (
        <StarSvg />
      ) : (
        <LockSvg />
      );
    case "book":
      return status === "COMPLETE" ? (
        <GoldenBookSvg />
      ) : status === "ACTIVE" ? (
        <ActiveBookSvg />
      ) : (
        <LockedBookSvg />
      );
    case "dumbbell":
      return status === "COMPLETE" ? (
        <GoldenDumbbellSvg />
      ) : status === "ACTIVE" ? (
        <ActiveDumbbellSvg />
      ) : (
        <LockedDumbbellSvg />
      );
    case "fast-forward":
      return status === "COMPLETE" ? (
        <CheckmarkSvg />
      ) : status === "ACTIVE" ? (
        <StarSvg />
      ) : (
        <FastForwardSvg />
      );
    case "treasure":
      return status === "COMPLETE" ? (
        <GoldenTreasureSvg />
      ) : status === "ACTIVE" ? (
        <ActiveTreasureSvg />
      ) : (
        <LockedTreasureSvg />
      );
    case "trophy":
      return status === "COMPLETE" ? (
        <GoldenTrophySvg />
      ) : status === "ACTIVE" ? (
        <ActiveTrophySvg />
      ) : (
        <LockedTrophySvg />
      );
    default:
      return null; // Thêm `default` để xử lý các trường hợp không mong đợi
  }
};

const getTileLeftClassName = ({ index, unitNumber, tilesLength }) => {
  const tileLeftClassNames = [
    "left-0",
    "left-[-45px]",
    "left-[-70px]",
    "left-[-45px]",
    "left-0",
    "left-[45px]",
    "left-[70px]",
    "left-[45px]",
  ];
  if (index >= tilesLength - 1) {
    return "left-0";
  }

  const classNames =
    unitNumber % 2 === 1
      ? tileLeftClassNames
      : [...tileLeftClassNames.slice(4), ...tileLeftClassNames.slice(0, 4)];

  return classNames[index % classNames.length] ?? "left-0";
};

const HoverLabel = ({ text, textColor }) => {
  const hoverElement = useRef(null);
  const [width, setWidth] = useState(72);

  useEffect(() => {
    setWidth(hoverElement.current?.clientWidth ?? width);
  }, [hoverElement.current?.clientWidth, width]);

  return (
    <div
      className={`absolute z-10 w-max animate-bounce rounded-lg border-2 border-gray-200 bg-white px-3 py-2 font-bold uppercase ${textColor}`}
      style={{
        top: "-25%",
        left: `calc(50% - ${width / 2}px)`,
      }}
      ref={hoverElement}
    >
      {text}
      <div
        className="absolute h-3 w-3 rotate-45 border-b-2 border-r-2 border-gray-200 bg-white"
        style={{ left: "calc(50% - 8px)", bottom: "-8px" }}
      ></div>
    </div>
  );
};

const LessonCompletionSvg = ({ lessonsCompleted, status, style = {} }) => {
  if (status !== "ACTIVE") {
    return null;
  }
  switch (lessonsCompleted % 4) {
    case 0:
      return <LessonCompletionSvg0 style={style} />;
    case 1:
      return <LessonCompletionSvg1 style={style} />;
    case 2:
      return <LessonCompletionSvg2 style={style} />;
    case 3:
      return <LessonCompletionSvg3 style={style} />;
    default:
      return null;
  }
};

const getTileColors = ({ tileType, status, defaultColors }) => {
  switch (status) {
    case "LOCKED":
      if (tileType === "fast-forward") return defaultColors;
      return "border-[#b7b7b7] bg-[#e5e5e5]";
    case "COMPLETE":
      return "border-yellow-500 bg-yellow-400";
    case "ACTIVE":
      return defaultColors;
    default:
      return "";
  }
};

const getTileTooltipLeftOffset = ({ index, unitNumber, tilesLength }) => {
  const tileTooltipLeftOffsets = [140, 95, 70, 95, 140, 185, 210, 185];

  if (index >= tilesLength - 1) {
    return tileTooltipLeftOffsets[0];
  }

  const offsets =
    unitNumber % 2 === 1
      ? tileTooltipLeftOffsets
      : [
          ...tileTooltipLeftOffsets.slice(4),
          ...tileTooltipLeftOffsets.slice(0, 4),
        ];

  return offsets[index % offsets.length] ?? tileTooltipLeftOffsets[0];
};

const TileTooltip = ({
  selectedTile,
  index,
  unitNumber,
  tilesLength,
  description,
  status,
  closeTooltip,
  backgroundColor,
  textColor,
  lessonId,
}) => {
  const tileTooltipRef = useRef(null);

  useEffect(() => {
    const containsTileTooltip = (event) => {
      if (selectedTile !== index) return;
      const clickIsInsideTooltip = tileTooltipRef.current?.contains(
        event.target
      );
      if (clickIsInsideTooltip) return;
      closeTooltip();
    };

    window.addEventListener("click", containsTileTooltip, true);
    return () => window.removeEventListener("click", containsTileTooltip, true);
  }, [selectedTile, closeTooltip, index]);

  // const unit = units.find((unit) => unit.unitNumber === unitNumber);
  const activeBackgroundColor = backgroundColor || "bg-green-500";
  const activeTextColor = textColor || "text-green-500";

  return (
    <div
      className={[
        "relative h-0 w-full",
        index === selectedTile ? "" : "invisible",
      ].join(" ")}
      ref={tileTooltipRef}
    >
      <div
        className={[
          "absolute z-30 flex w-[300px] flex-col gap-4 rounded-xl p-4 font-bold transition-all duration-300",
          status === "ACTIVE"
            ? activeBackgroundColor
            : status === "LOCKED"
            ? "border-2 border-gray-200 bg-gray-100"
            : "bg-yellow-400",
          index === selectedTile ? "top-4 scale-100" : "-top-14 scale-0",
        ].join(" ")}
        style={{ left: "calc(50% - 150px)" }}
      >
        <div
          className={[
            "absolute left-[140px] top-[-8px] h-4 w-4 rotate-45",
            status === "ACTIVE"
              ? activeBackgroundColor
              : status === "LOCKED"
              ? "border-l-2 border-t-2 border-gray-200 bg-gray-100"
              : "bg-yellow-400",
          ].join(" ")}
          style={{
            left: getTileTooltipLeftOffset({ index, unitNumber, tilesLength }),
          }}
        ></div>

        <div
          className={[
            "text-lg",
            status === "ACTIVE"
              ? "text-white"
              : status === "LOCKED"
              ? "text-gray-400"
              : "text-yellow-600",
          ].join(" ")}
        >
          {description}
        </div>

        {status === "ACTIVE" ? (
          <Link
            to={`/lesson/${lessonId}`}
            className={[
              "flex w-full items-center justify-center rounded-xl border-b-4 border-gray-200 bg-white p-3 uppercase",
              activeTextColor,
            ].join(" ")}
          >
            Start +10 XP
          </Link>
        ) : status === "LOCKED" ? (
          <button
            className="w-full rounded-xl bg-gray-200 p-3 uppercase text-gray-400"
            disabled
          >
            Locked
          </button>
        ) : (
          <Link
            to={`/lesson/${lessonId}`}
            className="flex w-full items-center justify-center rounded-xl border-b-4 border-yellow-200 bg-white p-3 uppercase text-yellow-400"
          >
            Practice +5 XP
          </Link>
        )}
      </div>
    </div>
  );
};

export default Learn;
