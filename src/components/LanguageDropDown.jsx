import { useState } from "react";
import { ChevronDownSvg } from "./Svgs";
import languages from "../utils/languages";
import { Flag } from "./Flag";
import { useDispatch, useSelector } from "react-redux";

export const LanguageDropDown = () => {
  const dispatch = useDispatch();
  const [languagesShown, setLanguagesShown] = useState(false);

  const languages = useSelector((state) => state.language.languages);

  return (
    <div
      className="relative hidden cursor-pointer items-center md:flex"
      onMouseEnter={() => setLanguagesShown(true)}
      onMouseLeave={() => setLanguagesShown(false)}
      aria-haspopup="true"
      aria-expanded={languagesShown}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setLanguagesShown((isShown) => !isShown);
        }
      }}
    >
      <span className="text-md uppercase">Site language: English</span>
      <ChevronDownSvg />

      {languagesShown && (
        <ul className="absolute right-0 top-full grid w-[500px] grid-cols-2 rounded-2xl border-2 border-gray-200 bg-white p-6 font-light text-gray-600">
          {languages.map((language) => (
            <li key={language.code}>
              <a
                href={`https://${language.code}.duolingo.com/`}
                tabIndex={0}
                className="flex items-center gap-3 whitespace-nowrap rounded-xl p-3 hover:bg-gray-300"
              >
                <Flag code={language.language_code} size="40px" />
                <span>{language.language_name}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
