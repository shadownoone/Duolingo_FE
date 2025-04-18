import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgSnow from "../../src/assets/bg-snow.svg";
import { LanguageHeader } from "../components/LanguageHeader";
import { Flag } from "../components/Flag";
import { getAllLanguages } from "../services/Languages/languageService";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserLanguage,
  setCurrentLanguage,
  setLanguages,
  setUserLanguages,
} from "../features/language/languageSlice";
import {
  enrollLanguage,
  getUserLanguages,
} from "../services/Users/userService";

function LanguageList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy mảng languages từ Redux
  const languages = useSelector((state) => state.language.languages);

  const userLanguages = useSelector((s) => s.language.userLanguages);

  useEffect(() => {
    const fetchBoth = async () => {
      try {
        // 1) fetch all languages
        const allRes = await getAllLanguages();
        if (allRes.code === 0 && allRes.data) {
          dispatch(setLanguages(allRes.data.data));
        }

        // 2) fetch user languages
        const userRes = await getUserLanguages();
        // nếu service return { code, message, data: [...] }
        const arr = userRes.data ?? userRes;
        dispatch(setUserLanguages(arr));
      } catch (err) {
        console.error(err);
      }
    };
    fetchBoth();
  }, [dispatch]);

  const handleSelect = async (lang) => {
    try {
      // CHECK trên userLanguages, không phải languages
      const alreadyEnrolled = userLanguages.some(
        (l) => l.language.language_id === lang.language_id
      );

      if (!alreadyEnrolled) {
        // enroll mới, lưu luôn vào userLanguages
        const newEntry = await enrollLanguage({
          language_id: lang.language_id,
        });
        dispatch(addUserLanguage(newEntry));
      }

      // set current + điều hướng
      dispatch(setCurrentLanguage(lang));
      navigate(`/learn/${lang.language_id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    }
  };

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
              onClick={() => handleSelect(language)}
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
