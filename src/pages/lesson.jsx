import React, { useEffect, useRef, useState } from "react";
import {
  AppleSvg,
  BigCloseSvg,
  BoySvg,
  CloseSvg,
  DoneSvg,
  LessonFastForwardStartSvg,
  LessonTopBarEmptyHeart,
  LessonTopBarHeart,
  WomanSvg,
} from "../components/Svgs";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getLessonDetail } from "../services/Lessons/lessonService";
import { completeLesson } from "../services/UserProgress/UserProgressService";
import { chatAI } from "../services/AI/chatService";

import { getCurrentUser, updateHeart } from "../services/Users/userService";

const Lesson = () => {
  const { lessonId } = useParams();

  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswerShown, setCorrectAnswerShown] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const startTime = useRef(Date.now());
  const endTime = useRef(null);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [questionResults, setQuestionResults] = useState([]);
  const [reviewLessonShown, setReviewLessonShown] = useState(false);

  const [hearts, setHearts] = useState(0);

  const { search } = useLocation();
  const fastForwardUnit = new URLSearchParams(search).get("fast-forward");

  if (fastForwardUnit) {
    return (
      <LessonFastForwardStart
        unitNumber={fastForwardUnit}
        onJump={() => {
          navigate(
            `/learn/${lesson.Course.language_id}?unit=${fastForwardUnit}`
          );
        }}
      />
    );
  }

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res.code === 0) {
          setCurrentUser(res.data);
          setHearts(res.data.hearts_count);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!lessonId) return;
    getLessonDetail(lessonId)
      .then((res) => {
        if (res.code === 0) {
          setLesson(res.data);
        } else {
          setError(res.message);
        }
      })
      .catch((err) => {
        console.error("Error calling getLessonDetail:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [lessonId]);

  const currentExercise =
    lesson && lesson.exercises && lesson.exercises.length > 0
      ? lesson.exercises[currentQuestionIndex]
      : null;

  const onCheckAnswer = async () => {
    setCorrectAnswerShown(true);
    const correctIndex = currentExercise.options.findIndex(
      (opt) => opt.is_correct
    );
    const isCorrect = selectedAnswer === correctIndex;
    setIsAnswerCorrect(isCorrect);

    if (!isCorrect) {
      // Giảm số lượng trái tim khi trả lời sai
      const newHeartsCount = Math.max(hearts - 1, 0);
      setHearts(newHeartsCount); // Cập nhật trái tim trên frontend

      // Gọi API để cập nhật trái tim trong cơ sở dữ liệu
      if (currentUser) {
        try {
          await updateHeart({
            userId: currentUser.user_id, // Dùng currentUser.user_id
            heartsCount: newHeartsCount,
          });
        } catch (error) {
          console.error("Failed to update hearts count", error);
        }
      }

      if (newHeartsCount === 0) {
        alert("You have no more hearts! Returning to the main screen.");
        navigate(`/learn/${lesson.Course.language_id}`); // Điều hướng trở lại màn hình học
        return;
      }
    }
  };

  const onFinish = () => {
    // Reset trạng thái và chuyển sang câu hỏi tiếp theo
    setSelectedAnswer(null);
    setCorrectAnswerShown(false);

    if (currentQuestionIndex < lesson.exercises.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      endTime.current = Date.now();
      setLessonComplete(true);
    }
  };

  if (lessonComplete) {
    return (
      <LessonComplete
        lessonId={lessonId}
        correctAnswerCount={correctAnswerCount}
        totalQuestions={lesson?.exercises?.length || 0}
        startTime={startTime.current}
        endTime={endTime.current}
        setReviewLessonShown={setReviewLessonShown}
        reviewLessonShown={reviewLessonShown}
        questionResults={questionResults}
        languageId={lesson.Course.language_id}
      />
    );
  }
  if (loading) return <div>Loading lesson details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!lesson) return <div>No lesson data available.</div>;
  if (!currentExercise)
    return <div>No exercise data available for this lesson.</div>;

  return (
    <div className="flex min-h-screen flex-col gap-5 px-4 py-5 sm:px-0 sm:py-0">
      <div className="flex grow flex-col items-center gap-5">
        {/* Thanh tiến trình */}
        <div className="w-full max-w-5xl sm:mt-8 sm:px-5">
          <header className="flex items-center gap-4">
            <button
              className="text-gray-400 rounded-full p-2 hover:bg-gray-100"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to exit this lesson?")
                ) {
                  navigate(`/learn/${lesson.Course.language_id}`);
                }
              }}
            >
              <CloseSvg />
              <span className="sr-only">Exit lesson</span>
            </button>
            <div
              className="h-4 grow rounded-full bg-gray-200"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={
                (currentQuestionIndex + 1) / lesson.exercises.length
              }
            >
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-700"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / lesson.exercises.length) * 100
                  }%`,
                }}
              />
            </div>
            {[1, 2, 3, 4, 5].map((n) =>
              n <= hearts ? (
                <LessonTopBarHeart key={n} />
              ) : (
                <LessonTopBarEmptyHeart key={n} />
              )
            )}
          </header>
        </div>

        {/* Câu hỏi */}
        <section className="flex max-w-2xl grow flex-col gap-5 self-center sm:items-center sm:justify-center sm:gap-24 sm:px-5">
          <h1 className="self-start text-2xl font-bold sm:text-3xl">
            {currentExercise
              ? currentExercise.question_content
              : "Loading question..."}
          </h1>

          {/* Các lựa chọn */}
          <div className="grid grid-cols-2 gap-4" role="radiogroup">
            {currentExercise.options && currentExercise.options.length > 0
              ? currentExercise.options.map((option, i) => (
                  <div
                    key={option.id}
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
                    {/* {answer.icon} */}
                    <h2 className="text-center">{option.option_text}</h2>
                  </div>
                ))
              : "Loading options..."}
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
            currentExercise.options[
              currentExercise.options.findIndex((opt) => opt.is_correct)
            ].option_text
          }
          onFinish={onFinish}
        />
      )}

      <ChatBox exercise_id={currentExercise?.exercise_id} />
    </div>
  );
};

const ChatBox = ({ exercise_id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  // Toggle chatbox visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add the user's message to the messages state
    setMessages([...messages, { sender: "user", text: inputMessage }]);

    // Clear the input field
    setInputMessage("");

    // Check if exercise_id is available
    if (!exercise_id) {
      console.error("exercise_id is missing");
      return;
    }

    try {
      // Call chatAI to get a response from the backend
      const response = await chatAI(inputMessage, exercise_id);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: response.reply.text },
      ]);
    } catch (error) {
      console.error("Error while chatting with AI:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Sorry, there was an error. Please try again." },
      ]);
    }
  };

  return (
    <div>
      {/* Floating chat icon */}
      <div
        className={`fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full cursor-pointer shadow-lg ${
          isOpen ? "hidden" : ""
        }`}
        onClick={toggleChat}
      >
        <span>Chat</span>
      </div>

      {/* Chatbox */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 bg-white p-5 rounded-lg shadow-lg w-80 h-96">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Chat with us</h3>
            <button onClick={toggleChat}>X</button>
          </div>

          {/* Messages */}
          <div className="overflow-y-auto max-h-72 my-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.sender === "user" ? "text-right" : "text-left"}
              >
                <p
                  className={`p-2 ${
                    msg.sender === "user" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
          </div>

          {/* Message input */}
          <div className="flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="border-2 border-gray-300 rounded-lg p-2 flex-grow"
              placeholder="Type a message..."
            />
            <button
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
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
  lessonId,
  correctAnswerCount,
  startTime,
  endTime,
  setReviewLessonShown,
  reviewLessonShown,
  questionResults,
  languageId,
  lesson,
}) => {
  const totalQuestions = lesson?.exercises?.length || 0;
  const totalXP = correctAnswerCount;
  const totalTime = Math.floor((endTime - startTime) / 1000);
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  const accuracy = Math.round((correctAnswerCount / totalQuestions) * 100);
  const navigate = useNavigate();

  const handleContinue = async () => {
    try {
      // gọi API lưu tiến độ
      const res = await completeLesson(lessonId);
    } catch (err) {
      console.error("Lưu tiến độ thất bại:", err);
      // bạn có thể show toast hoặc thông báo lỗi ở đây
    } finally {
      // rồi mới chuyển sang màn Learn
      navigate(`/learn/${languageId}`);
    }
  };

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
          <button
            className="flex w-full items-center justify-center rounded-2xl border-b-4 border-green-600 bg-green-500 p-3 font-bold uppercase text-white transition hover:brightness-105 sm:min-w-[150px] sm:max-w-fit"
            onClick={handleContinue}
          >
            Continue
          </button>
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

const LessonFastForwardStart = ({ unitNumber, onJump }) => {
  return (
    <div className="flex min-h-screen flex-col px-5 py-8 text-center">
      <div className="flex grow flex-col items-center justify-center gap-5">
        <LessonFastForwardStartSvg />
        <h1 className="text-lg font-bold">Want to jump to Unit ?</h1>
        <p className="text-sm text-gray-400">
          {`Pass the test to jump ahead. We won't make it easy for you though.`}
        </p>
      </div>
      <div className="flex flex-col gap-5"></div>
      <section className="border-gray-200 sm:border-t-2 sm:p-10">
        <div className="mx-auto flex max-w-5xl flex-col-reverse items-center gap-5 sm:flex-row sm:justify-between">
          <Link
            to={`/learn/${unitNumber}`}
            className="font-bold uppercase text-blue-400 transition hover:brightness-110"
          >
            Maybe later
          </Link>
          <button
            onClick={onJump}
            className="w-full rounded-2xl border-b-4 border-blue-500 bg-blue-400 p-3 font-bold uppercase text-white transition hover:brightness-110 sm:min-w-[150px] sm:max-w-fit"
          >
            {`Let's go`}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Lesson;
