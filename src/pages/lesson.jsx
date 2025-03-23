import React, { useRef, useState } from "react";
import {
  AppleSvg,
  BigCloseSvg,
  BoySvg,
  CloseSvg,
  DoneSvg,
  LessonTopBarEmptyHeart,
  LessonTopBarHeart,
  WomanSvg,
} from "../components/Svgs";
import { Link } from "react-router-dom";

// Danh sách các câu hỏi
const lessonProblems = [
  {
    type: "SELECT_1_OF_3",
    question: `Which one of these is "the apple"?`,
    answers: [
      { icon: <AppleSvg />, name: "la manzana" },
      { icon: <BoySvg />, name: "el niño" },
      { icon: <WomanSvg />, name: "la mujer" },
    ],
    correctAnswer: 0,
  },
  {
    type: "SELECT_1_OF_3",
    question: `Which one of these is "the boy"?`,
    answers: [
      { icon: <AppleSvg />, name: "la manzana" },
      { icon: <BoySvg />, name: "el niño" },
      { icon: <WomanSvg />, name: "la mujer" },
    ],
    correctAnswer: 1,
  },
];

const Lesson = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Câu hỏi hiện tại
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswerShown, setCorrectAnswerShown] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const startTime = useRef(Date.now()); // Thời gian bắt đầu
  const endTime = useRef(null); // Thời gian kết thúc
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0); // Đếm số câu đúng
  const [lessonComplete, setLessonComplete] = useState(false); // Kiểm tra hoàn thành bài học
  const [questionResults, setQuestionResults] = useState([]);
  const [reviewLessonShown, setReviewLessonShown] = useState(false);

  const hearts = 3; // Fix cứng dữ liệu tạm thời

  const onCheckAnswer = () => {
    setCorrectAnswerShown(true);
    const isCorrect =
      selectedAnswer === lessonProblems[currentQuestionIndex].correctAnswer;
    setIsAnswerCorrect(isCorrect);

    setQuestionResults((prevResults) => [
      ...prevResults,
      {
        question: lessonProblems[currentQuestionIndex].question,
        yourResponse:
          lessonProblems[currentQuestionIndex].answers[selectedAnswer].name,
        correctResponse:
          lessonProblems[currentQuestionIndex].answers[
            lessonProblems[currentQuestionIndex].correctAnswer
          ].name,
      },
    ]);

    if (isCorrect) {
      setCorrectAnswerCount((prev) => prev + 1); // Tăng điểm nếu đúng
    }
  };

  const onFinish = () => {
    // Reset trạng thái và chuyển sang câu hỏi tiếp theo
    setSelectedAnswer(null);
    setCorrectAnswerShown(false);

    if (currentQuestionIndex < lessonProblems.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1); // Chuyển sang câu tiếp theo
    } else {
      endTime.current = Date.now(); // Lưu thời gian kết thúc bài học
      setLessonComplete(true); // Đánh dấu bài học đã hoàn thành
    }
  };

  const currentProblem = lessonProblems[currentQuestionIndex];

  if (lessonComplete) {
    return (
      <LessonComplete
        correctAnswerCount={correctAnswerCount}
        totalQuestions={lessonProblems.length}
        startTime={startTime.current}
        endTime={endTime.current}
        setReviewLessonShown={setReviewLessonShown}
        reviewLessonShown={reviewLessonShown}
        questionResults={questionResults}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col gap-5 px-4 py-5 sm:px-0 sm:py-0">
      <div className="flex grow flex-col items-center gap-5">
        {/* Thanh tiến trình */}
        <div className="w-full max-w-5xl sm:mt-8 sm:px-5">
          <header className="flex items-center gap-4">
            <button className="text-gray-400">
              <CloseSvg />
              <span className="sr-only">Exit lesson</span>
            </button>

            <div
              className="h-4 grow rounded-full bg-gray-200"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={(currentQuestionIndex + 1) / lessonProblems.length}
            >
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-700"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / lessonProblems.length) * 100
                  }%`,
                }}
              />
            </div>

            {[1, 2, 3].map((heart) =>
              heart <= hearts ? (
                <LessonTopBarHeart key={heart} />
              ) : (
                <LessonTopBarEmptyHeart key={heart} />
              )
            )}
          </header>
        </div>

        {/* Câu hỏi */}
        <section className="flex max-w-2xl grow flex-col gap-5 self-center sm:items-center sm:justify-center sm:gap-24 sm:px-5">
          <h1 className="self-start text-2xl font-bold sm:text-3xl">
            {currentProblem.question}
          </h1>

          {/* Các lựa chọn */}
          <div
            className="grid grid-cols-2 gap-2 sm:grid-cols-3"
            role="radiogroup"
          >
            {currentProblem.answers.map((answer, i) => (
              <div
                key={i}
                className={
                  i === selectedAnswer
                    ? "cursor-pointer rounded-xl border-2 border-b-4 border-blue-300 bg-blue-100 p-4 text-blue-400"
                    : "cursor-pointer rounded-xl border-2 border-b-4 border-gray-200 p-4 hover:bg-gray-100"
                }
                role="radio"
                aria-checked={i === selectedAnswer}
                tabIndex={0}
                onClick={() => setSelectedAnswer(i)}
              >
                {answer.icon}
                <h2 className="text-center">{answer.name}</h2>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Nút kiểm tra đáp án */}
      <section className="border-gray-200 sm:border-t-2 sm:p-10">
        <div className="mx-auto flex max-w-5xl sm:justify-between">
          <button className="rounded-2xl border-2 border-b-4 border-gray-200 bg-white p-3 font-bold uppercase text-gray-400 sm:min-w-[150px] sm:max-w-fit">
            Skip
          </button>
          <button
            onClick={onCheckAnswer}
            className={
              selectedAnswer !== null
                ? "grow rounded-2xl border-b-4 border-green-600 bg-green-500 p-3 font-bold uppercase text-white sm:min-w-[150px] sm:max-w-fit"
                : "grow rounded-2xl bg-gray-200 p-3 font-bold uppercase text-gray-400 sm:min-w-[150px] sm:max-w-fit"
            }
            disabled={selectedAnswer === null}
          >
            Check
          </button>
        </div>
      </section>

      {/* Phản hồi sau khi kiểm tra đáp án */}
      {correctAnswerShown && (
        <FeedbackMessage
          isAnswerCorrect={isAnswerCorrect}
          correctAnswer={
            currentProblem.answers[currentProblem.correctAnswer].name
          }
          onFinish={onFinish}
        />
      )}
    </div>
  );
};

const FeedbackMessage = ({ isAnswerCorrect, correctAnswer, onFinish }) => (
  <div
    className={
      isAnswerCorrect
        ? "fixed bottom-0 left-0 right-0 bg-lime-100 font-bold text-green-600 transition-all"
        : "fixed bottom-0 left-0 right-0 bg-red-100 font-bold text-red-500 transition-all"
    }
  >
    <div className="flex max-w-5xl flex-col gap-4 p-5 sm:mx-auto sm:flex-row sm:items-center sm:justify-between sm:p-10 sm:py-14">
      {isAnswerCorrect ? (
        <div className="mb-2 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="hidden rounded-full bg-white p-5 text-green-500 sm:block">
            <DoneSvg />
          </div>
          <div className="text-2xl">Good job!</div>
        </div>
      ) : (
        <div className="mb-2 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="hidden rounded-full bg-white p-5 text-red-500 sm:block">
            <BigCloseSvg />
          </div>
          <div className="text-2xl">Correct answer: {correctAnswer}</div>
        </div>
      )}

      {/* Nút "CONTINUE" */}
      <button
        onClick={onFinish}
        className={
          isAnswerCorrect
            ? "w-full rounded-2xl border-b-4 border-green-600 bg-green-500 p-3 font-bold uppercase text-white transition hover:brightness-105 sm:min-w-[150px] sm:max-w-fit"
            : "w-full rounded-2xl border-b-4 border-red-600 bg-red-500 p-3 font-bold uppercase text-white transition hover:brightness-105 sm:min-w-[150px] sm:max-w-fit"
        }
      >
        Continue
      </button>
    </div>
  </div>
);

const LessonComplete = ({
  correctAnswerCount,
  totalQuestions,
  startTime,
  endTime,
  setReviewLessonShown,
  reviewLessonShown,
  questionResults,
}) => {
  const totalXP = correctAnswerCount;
  const totalTime = Math.floor((endTime - startTime) / 1000); // Thời gian tính bằng giây
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  const accuracy = Math.round((correctAnswerCount / totalQuestions) * 100);

  return (
    <div className="flex min-h-screen flex-col gap-5 px-4 py-5 sm:px-0 sm:py-0">
      <div className="flex grow flex-col items-center justify-center gap-8 font-bold">
        <h1 className="text-3xl font-bold text-yellow-400">Lesson Complete!</h1>

        {/* Hiển thị kết quả */}
        <div className="flex flex-wrap justify-center gap-5">
          <div className="min-w-[110px] rounded-xl border-2 border-yellow-400 bg-yellow-400">
            <h2 className="py-1 text-center text-white">Total XP</h2>
            <div className="flex justify-center rounded-xl bg-white py-4 text-yellow-400">
              {totalXP}
            </div>
          </div>

          <div className="min-w-[110px] rounded-xl border-2 border-blue-400 bg-blue-400">
            <h2 className="py-1 text-center text-white">Committed</h2>
            <div className="flex justify-center rounded-xl bg-white py-4 text-blue-400">
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </div>
          </div>

          <div className="min-w-[110px] rounded-xl border-2 border-green-400 bg-green-400">
            <h2 className="py-1 text-center text-white">Amazing</h2>
            <div className="flex justify-center rounded-xl bg-white py-4 text-green-400">
              {accuracy}%
            </div>
          </div>
        </div>
      </div>

      {/* Các nút điều hướng */}
      <section className="border-gray-200 sm:border-t-2 sm:p-10">
        <div className="mx-auto flex max-w-5xl sm:justify-between">
          {/* Nút Review Lesson */}
          <button
            className="rounded-2xl border-2 border-b-4 border-gray-200 bg-white p-3 font-bold uppercase text-gray-400 transition hover:border-gray-300 hover:bg-gray-200 sm:min-w-[150px] sm:max-w-fit"
            onClick={() => setReviewLessonShown(true)}
          >
            Review lesson
          </button>

          {/* Nút Continue */}
          <Link
            className="flex w-full items-center justify-center rounded-2xl border-b-4 border-green-600 bg-green-500 p-3 font-bold uppercase text-white transition hover:brightness-105 sm:min-w-[150px] sm:max-w-fit"
            to="/learn"
            onClick={() => {
              // Xử lý cập nhật XP, Lingots, LessonsCompleted nếu cần
            }}
          >
            Continue
          </Link>
        </div>
      </section>

      {/* Giao diện Review Lesson */}
      <ReviewLesson
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
      />
    </div>
  );
};

const ReviewLesson = ({
  reviewLessonShown,
  setReviewLessonShown,
  questionResults,
}) => {
  const [selectedQuestionResult, setSelectedQuestionResult] = useState(null);

  return (
    <div
      className={[
        "fixed inset-0 flex items-center justify-center p-5 transition duration-300",
        reviewLessonShown ? "" : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-0 bg-black",
          reviewLessonShown ? "opacity-75" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setReviewLessonShown(false)}
      ></div>
      <div className="relative flex w-full max-w-4xl flex-col gap-5 rounded-2xl border-2 border-gray-200 bg-white p-8">
        <button
          className="absolute -right-5 -top-5 rounded-full border-2 border-gray-200 bg-gray-100 p-1 text-gray-400 hover:brightness-90"
          onClick={() => setReviewLessonShown(false)}
        >
          <BigCloseSvg className="h-8 w-8" />
          <span className="sr-only">Close</span>
        </button>
        <h2 className="text-center text-3xl">Check out your scorecard!</h2>
        <p className="text-center text-xl text-gray-400">
          Click the tiles below to reveal the solutions
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {questionResults.map((questionResult, i) => (
            <button
              key={i}
              className={[
                "relative flex flex-col items-stretch gap-3 rounded-xl p-5 text-left",
                questionResult.yourResponse === questionResult.correctResponse
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-red-100 text-red-500",
              ].join(" ")}
              onClick={() =>
                setSelectedQuestionResult((prevSelected) =>
                  prevSelected === questionResult ? null : questionResult
                )
              }
            >
              <div className="flex justify-between gap-2">
                <h3 className="font-bold">{questionResult.question}</h3>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white">
                  {questionResult.yourResponse ===
                  questionResult.correctResponse ? (
                    <DoneSvg className="h-5 w-5" />
                  ) : (
                    <BigCloseSvg className="h-5 w-5" />
                  )}
                </div>
              </div>
              <div>{questionResult.yourResponse}</div>
              {selectedQuestionResult === questionResult && (
                <div className="absolute left-1 right-1 top-20 z-10 rounded-2xl border-2 border-gray-200 bg-white p-3 text-sm tracking-tighter">
                  <div
                    className="absolute -top-2 h-3 w-3 rotate-45 border-l-2 border-t-2 border-gray-200 bg-white"
                    style={{ left: "calc(50% - 6px)" }}
                  ></div>
                  <div className="font-bold uppercase text-gray-400">
                    Your response:
                  </div>
                  <div className="mb-3 text-gray-700">
                    {questionResult.yourResponse}
                  </div>
                  <div className="font-bold uppercase text-gray-400">
                    Correct response:
                  </div>
                  <div className="text-gray-700">
                    {questionResult.correctResponse}
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lesson;
