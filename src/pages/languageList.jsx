import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgSnow from "../../src/assets/bg-snow.svg";
import { LanguageHeader } from "../components/LanguageHeader";
import { Flag } from "../components/Flag";
import { getAllLanguages } from "../services/Languages/languageService";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentLanguage,
  setLanguages,
} from "../features/language/languageSlice";

function LanguageList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy mảng languages từ Redux
  const languages = useSelector((state) => state.language.languages);

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const response = await getAllLanguages();
        console.log("API response:", response);
        if (response.code === 0 && response.data) {
          // Lưu mảng language vào Redux
          dispatch(setLanguages(response.data.data));
        } else {
          console.error("Dữ liệu trả về không hợp lệ:", response);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách languages:", error);
      }
    };
    fetchLanguage();
  }, [dispatch]);

  return (
    <main
      className="flex min-h-screen flex-col items-center bg-[#235390] text-white"
      style={{ backgroundImage: `url(${bgSnow.src})` }}
    >
      <LanguageHeader />
      <div className="container flex grow flex-col items-center justify-center gap-20 px-4 py-16">
        <h1 className="mt-20 text-center text-3xl font-extrabold tracking-tight text-white">
          I want to learn...
        </h1>
        <section className="mx-auto grid w-full max-w-5xl grow gap-x-2 gap-y-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {languages.map((language) => (
            <button
              key={language.language_id}
              onClick={() => {
                dispatch(setCurrentLanguage(language));
                navigate(`/learn/${language.language_id}`);
              }}
              className="flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-b-4 border-gray-400 px-5 py-8 text-xl font-bold hover:bg-gray-300 hover:bg-opacity-20"
            >
              <Flag code={language.language_code} size="40px" />
              <span>{language.language_name}</span>
            </button>
          ))}
        </section>
      </div>
    </main>
  );
}

export default LanguageList;
